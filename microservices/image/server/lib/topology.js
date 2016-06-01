module.exports = function (rabbit, options) {
    return rabbit.configure({
        // arguments used to establish a connection to a broker
        connection: {
            user: 'guest',
            pass: 'guest',
            server: [options.host],
            port: 5672,            
            replyQueue: options.name + '_reply',
            vhost: '%2f',

        },
        // define the exchanges
        exchanges: [
            { name: 'ms.1', type: 'topic', persistent: true }
        ],
        // setup the queues, only subscribing to the one this service
        // will consume messages from
        queues: [
            { name: `${options.name}_q`, subscribe: true, durable: true }
        ],
        // binds exchanges and queues to one another
        bindings: [
            { exchange: 'ms.1', target: `${options.name}_q`, keys: [`${options.name}`] }
        ]
    });
};
