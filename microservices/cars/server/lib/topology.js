module.exports = function (rabbit, options) {
    return rabbit.configure({
        // arguments used to establish a connection to a broker
        connection: {
            user: 'guest',
            pass: 'guest',
            server: [options.host],
            timeout: 2000,
            port: 5672,
            vhost: '%2f',

            // vhost: '%2f',
            replyQueue: options.name + '_reply'
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


/*


var settings = {
        connection: {
            user: 'guest',
            pass: 'guest',
            server: '127.0.0.1',
            // server: '127.0.0.1, 194.66.82.11',
            // server: ['127.0.0.1', '194.66.82.11'],
            port: 5672,
            timeout: 2000,
            vhost: '%2fmyhost'
            },
        exchanges:[
            { name: 'config-ex.1', type: 'fanout', publishTimeout: 1000 },
            { name: 'config-ex.2', type: 'topic', alternate: 'alternate-ex.2', persistent: true },
            { name: 'dead-letter-ex.2', type: 'fanout' }
            ],
        queues:[
            { name:'config-q.1', limit: 100, queueLimit: 1000 },
            { name:'config-q.2', subscribe: true, deadLetter: 'dead-letter-ex.2' }
            ],
        bindings:[
            { exchange: 'config-ex.1', target: 'config-q.1', keys: [ 'bob','fred' ] },
            { exchange: 'config-ex.2', target: 'config-q.2', keys: 'test1' }
        ]
    };




 */