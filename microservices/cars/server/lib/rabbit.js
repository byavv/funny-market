/**
 *  Simple RabbitMQ client with RPC feature. Fault tolerant.
 *  Inspired by this discussion https://github.com/squaremo/amqp.node/issues/25
 *  Usage:  rabbit.publish('cars', { action: 'myaction', value: "somevalue" }, (err, result) => {});    
 */

'use strict'
var amqp = require('amqplib');
var uuid = require('node-uuid');

var Descriptor = (function () {
    var _channel;
    var _callbacksMap = new Map();
    var _offlineCache = [];
    var _subscribtionCallback = null;
    var _name;
    var _offline;
    // CAUTION: REPLY CONTRACT: {err: {}, result: {}} to be equal to node.js error handling convention
    var __replyHandler = (msg) => {
        if (msg.properties.correlationId
            && _callbacksMap.has(msg.properties.correlationId)) {
            var res = JSON.parse(msg.content.toString());
            var clb = _callbacksMap.get(msg.properties.correlationId);
            clb.call(this, res.err, res.result);
            _callbacksMap.delete(msg.properties.correlationId);
        }
    }
    var __consumeHandler = (msg) => {
        var result = JSON.parse(msg.content.toString());
        if (_subscribtionCallback && typeof _subscribtionCallback === 'function') {
            _subscribtionCallback(result, (responce) => {
                responce = JSON.stringify(responce)
                if (msg.properties && msg.properties.replyTo && msg.properties.correlationId) {
                    _channel.sendToQueue(msg.properties.replyTo, new Buffer(responce), { correlationId: msg.properties.correlationId });
                }
            })
        }
        _channel.ack(msg);
    }
    var __publish = (target, message, callback) => {
        try {
            if (_offline) throw new Error("Offline");
            if (!_channel) throw new Error("Channel closed");
            if (callback && typeof callback === 'function') {
                var correlationId = uuid.v4();
                _callbacksMap.set(correlationId, callback);
                _channel.sendToQueue(target, new Buffer(JSON.stringify(message)), {
                    correlationId: correlationId,
                    replyTo: `amq.rabbitmq.reply-to`
                });
            } else {
                _channel.sendToQueue(target, new Buffer(JSON.stringify(message)));
            }
        } catch (error) {
            console.log("[PUBLISHING ERROR]", error.message)
            _offlineCache.push([target, message, callback])
        }
    }

    var cls = function (name) { _name = name; this.offline = true; };

    cls.prototype = {
        subscribe: (callback) => {
            _subscribtionCallback = callback;
        },
        publish: __publish
    };
    Object.defineProperty(cls.prototype, 'offline', {
        get: function () { return _offline },
        set: function (value) { _offline = value; }
    });
    Object.defineProperty(cls.prototype, 'channel', {
        get: function () { return _channel },
        set: function (value) {
            _channel = value;
            Promise.all([
                _channel.assertQueue(_name, { durable: false }),
                _channel.consume(_name, __consumeHandler, { noAck: false }),
                _channel.consume(`amq.rabbitmq.reply-to`, __replyHandler, { noAck: true })
            ]).then(() => {
                console.log('Rabbit client started');
                _offline = false;
                while (true) {
                    var pubm = _offlineCache.shift();
                    if (!pubm) {
                        _offlineCache.splice(0, _offlineCache.length);
                        break;
                    };
                    __publish(pubm[0], pubm[1], pubm[2]);
                }
            })
        }
    });
    return cls;
})()


var Client = (function () {
    var defaults = {
        host: `amqp://localhost`,
        name: `localhost`,
        reconnectTime: 5000
    }
    var _config = {};
    var _connection = null;
    var _descriptor;

    var cls = function (options) {
        _config = Object.assign(defaults, options || {});
        _descriptor = new Descriptor(_config.name);
    };

    var __createConnection = function () {
        return new Promise((resolve, reject) => {
            resolve(_descriptor);
            amqp.connect(_config.host)
                .then((conn) => {
                    _connection = conn;
                    _connection.on('close', () => {
                        console.log("Connection closed.");
                    });
                    _connection.on('error', (err) => {
                        _descriptor.offline = true;
                        if (err.message !== "Connection closing") {
                            console.error("[RABBIT CONNECTION ERROR]", err.message);
                        }
                        console.log("Try to reconnect");
                        return setTimeout(__createConnection, _config.reconnectTime);
                    });
                    _connection.createChannel().then((channel) => {
                        _descriptor.channel = channel;
                    });
                }, (err) => {
                    _descriptor.offline = true;
                    console.log(err);
                    console.log("Try to reconnect");
                    setTimeout(__createConnection, _config.reconnectTime);
                })
        });
    };

    cls.prototype = {
        open: () => {
            return __createConnection.call(this);
        },
        close: () => {
            if (_connection) {
                _connection.close();
            }
        }
    };
    return cls;
})();

module.exports = Client;
