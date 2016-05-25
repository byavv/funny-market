var amqp = require('amqplib');
var Client = require('../lib/rabbit');


module.exports = function (app, done) {
    var Car = app.models.Car

    var microserviceName = app.get('ms_name') || 'cars'
    var rabbit_host = app.get("rabbit_host");

    var client = new Client({
        host: `amqp://${rabbit_host}`,
        name: microserviceName
    })

    client.open()
        .then((rabbit) => {
            app.rabbit = rabbit;
            rabbit.subscribe((message, callback) => {
                switch (message.action) {
                    case 'cars.delete.all':
                        Car.destroyAll({ userId: message.value }, (err, info, count) => {
                            callback({ err: err, result: info });
                        })
                        break;
                    default:
                        callback({ err: "wrong operation" });
                        break;
                }
            })
        })
        .then(done)
        .catch(done);

    app.close = () => {
        client.close();
    };
};
