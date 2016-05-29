var amqp = require('amqplib');
var Client = require('../lib/rabbit');


module.exports = function (app, done) {
    if (process.env.NODE_ENV != 'test') {
        var microserviceName = app.get('ms_name') || 'profile'
        var rabbit_host = app.get("rabbit_host");
        var client = new Client({
            host: `amqp://${rabbit_host}`,           
            name: microserviceName
        })
        client.open().then((rabbit) => {
            app.rabbit = rabbit;
            rabbit.subscribe((message, callback) => {
                switch (message.action) {
                    case 'update_car':
                        console.log("update", message.value);
                        callback({ err: null, result: message });
                        break;
                    default:
                        callback({ err: "wrong operation" });
                        break;
                }
            })
        }, (err) => {
            console.log("ERROR")
        }).catch(console.log)

        app.close = () => {
            client.close();
        };
    }
    done();
};
