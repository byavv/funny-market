'use strict'
const rabbit = require('wascally')
    , debug = require('debug')('cars');

module.exports = function (app, done) {
    var Car = app.models.Car;
    function handle() {
        rabbit.handle('cars.delete.all', (message) => {
            debug(`Deleting cars for user: ${message.body}`)
            Car.destroyAll({ userId: message.body }, (err, info, count) => {
                if (err) {
                    message.nack();
                } else {
                    message.reply(info);
                }
            })
        });
        rabbit.handle('cars.delete.image', (message) => {
            var carId = message.body.carId;
            var key = message.body.key;
            Car.findById(carId, (err, carInst) => {
                if (err || !carInst) { message.nack(); return; }
                let image = carInst.images.find(image => image.key == key);
                if (image) {
                    carInst.images.splice(carInst.images.indexOf(image), 1);
                    Car.updateAll({ id: carId }, carInst, (err, info) => {
                        err
                            ? message.nack()
                            : message.ack();
                    });
                } else {
                    message.reject();
                }
            })
        });
        rabbit.handle('cars.update.images', (message) => {
            const carId = message.body.carId;
            const files = message.body.files;
            Car.findById(carId, (err, carInst) => {
                if (err || !carInst) { message.nack(); return; }
                const images = (files || []).map((file) => {
                    return {
                        url: file.location,
                        key: file.key
                    }
                });
                carInst.images = carInst.images.concat(images);
                Car.updateAll({ id: carId }, carInst, (err, info) => {
                    err
                        ? message.nack()
                        : rabbit.publish('ex.tracker', {
                            type: 'tracker.update',
                            routingKey: "messages",
                            body: {
                                carId: `${carInst.id}`,
                                image: carInst.images ? carInst.images[0].url : '/static/assets/img/default.png',
                                description: `${carInst.makerName}, ${carInst.modelName}`
                            }
                        }).then(() => {
                            message.ack();
                        });
                })
            });
        });
        rabbit.handle('cars.snd.test', (message) => {
            console.log(message.body)
            message.ack();
        })


    }
    if (process.env.NODE_ENV != 'test')
        require('../lib/topology')(rabbit, {
            name: app.get('ms_name'),
            host: app.get("rabbit_host")
        })
            .then(handle)
            .then(() => {
                app.rabbit = rabbit;
                debug("Rabbit client started");
            })
            .then(done);

    app.close = () => {
        rabbit.closeAll();
    };
}