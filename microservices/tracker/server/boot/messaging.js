var amqp = require('amqplib');
var Client = require('../lib/rabbit');

module.exports = function (app, done) {
    var Track = app.models.track;
    var microserviceName = app.get('ms_name') || 'tracker'
    var rabbit_host = app.get("rabbit_host");

    var client = new Client({
        host: `amqp://${rabbit_host}`,
        name: microserviceName
    });
    client.open().then((rabbit) => {
        app.rabbit = rabbit;
        rabbit.subscribe((message, callback) => {
            switch (message.action) {
                case 'track':
                    console.log('Add car to list')
                    Track.create(message.value, (err, track) => {
                        callback({ err: err, result: track });
                    })
                    break;
                case 'track.delete':
                    console.log('Delete car from list');
                    if (message.value && message.value.carId)
                        Track.destroyAll({ carId: message.value.carId }, (err, info) => {
                            callback({ err: err, result: info });
                        })
                    break;
                case 'track.update':
                    if (message.value && message.value.carId)
                        Track.findOne({ where: { carId: message.value.carId } }, (err, track) => {
                            if (err || !track) {
                                callback({ err: err ? err : "Not tracked" });
                            } else {
                                track.updateAttributes({
                                    image: message.value.image,
                                    description: message.value.description ? message.value.description : track.description
                                }, (err, tr) => {
                                    callback({ result: tr });
                                })
                            }
                        })
                    break;
                default:
                    callback({ err: "wrong operation", result: null });
                    break;
            }
        })

    }).catch(console.log)

    app.close = () => {
        client.close();
    };

    done();
};
