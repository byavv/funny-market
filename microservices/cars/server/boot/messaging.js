var rabbit = require('wascally');

module.exports = function (app, done) {
    var Car = app.models.Car;
    function handle() {
        rabbit.handle('delete.all', (message) => {
            Car.destroyAll({ userId: message.body }, (err, info, count) => {
                if (err) {
                    message.nack();
                } else {
                    message.reply(info);
                }
            })
        });
        rabbit.handle('delete.image', (message) => {
            var carId = message.body.carId;
            var key = message.body.key;
            Car.findById(carId, (err, carInst) => {
                if (err) return callback({ err: err });
                let image = carInst.images.find(image => image.key == key);
                if (image) {
                    carInst.images.splice(carInst.images.indexOf(image), 1);
                    Car.updateAll({ id: carId }, carInst, (err, info) => {
                        if (err) {
                            message.nack();
                        } else {
                            message.reply(info);
                        }
                    });
                } else {
                    message.nack();
                }
            })
        });

        rabbit.handle('*', (message) => {
            console.log("ALL", message)
        })
        rabbit.handle('update.images', (message) => {
            console.log("YYYYYOW")
            var carId = message.body.carId;
            var files = message.body.files;
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
                    if (err) {
                        message.nack();
                    } else {
                        message.reply(info);
                    }
                    rabbit.request('ms.1', {
                        type: 'update',
                        routingKey: "tracker",
                        body: {
                            carId: `${carInst.id}`,
                            image: carInst.images ? carInst.images[0].url : '/static/assets/img/default.png',
                            description: `${carInst.makerName}, ${carInst.modelName}`
                        }
                    }).then(function (final) {
                        console.log(final.body);
                        final.ack();
                    });
                })
            });
        });
    }

    require('../lib/topology')(rabbit, {
        name: app.get('ms_name'),
        host: app.get("rabbit_host")
    })
        .then(() => {
            app.rabbit = rabbit;
            console.log("Rabbit client started");
        })
        .then(handle)
        .then(done);

    app.close = () => {
        rabbit.closeAll();
    };
}