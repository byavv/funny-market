"use strict"
var Client = require('../lib/rabbit');

module.exports = function (app, done) {
    var microserviceName = app.get('ms_name');
    var rabbit_host = app.get("rabbit_host");

    var Car = app.models.Car;

    if (process.env.NODE_ENV != 'test') {
        var client = new Client({
            host: `amqp://${rabbit_host}`,
            name: microserviceName
        });
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
                        case 'cars.delete.image':
                            var carId = message.value.carId;
                            var key = message.value.key;
                            console.log("WOW", carId, key)
                            Car.findById(carId, (err, carInst) => {
                                if (err) return callback({ err: err });
                                let image = carInst.images.find(image => image.key == key);
                                if (image) {
                                    carInst.images.splice(carInst.images.indexOf(image), 1);
                                    Car.updateAll({ id: carId }, carInst, (err, info) => {
                                        if (err) return callback({ err: err });
                                        callback({ result: info });
                                    });
                                } else {
                                    callback({ err: "nothing to delete" });
                                }
                            })
                            break;
                        case 'cars.update.images':
                            var carId = message.value.carId;
                            var files = message.value.files;
                            Car.findById(carId, (err, carInst) => {
                                if (err) throw err;
                                var images = (files || []).map((file) => {
                                    return {
                                        url: file.location,
                                        key: file.key
                                    }
                                });
                                carInst.images = carInst.images.concat(images);
                                Car.updateAll({ id: carId }, carInst, (err, info) => {
                                    if (err) throw err;
                                    callback({ err: err, result: info });
                                    rabbit.publish('tracker', {
                                        action: 'track.update',
                                        value: {
                                            carId: `${carInst.id}`,
                                            image: carInst.images ? carInst.images[0].url : '/build/cl/assets/img/default.png',
                                            description: `${carInst.makerName}, ${carInst.modelName}`
                                        }
                                    })
                                })
                            });
                            break;
                        default:
                            callback({ err: "wrong operation" });
                            break;
                    };
                });
            })
            .then(done)
            .catch(done);

        app.close = () => {
            client.close();
        };
    } else {
        done()
    };
};
