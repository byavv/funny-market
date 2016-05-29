"use strict"
var async = require('async');

module.exports = function (Car) {
    var app;
    Car.on('attached', function (a) {
        app = a;
    });

    Car.observe('after save', function (ctx, next) {
        if (ctx.instance) {
            var car = ctx.instance;
            if (app.rabbit && car) {
                app.rabbit.publish('tracker', {
                    action: 'track',
                    value: {
                        carId: `${car.id}`,
                        image: '/build/cl/assets/img/default.png',
                        description: `${car.makerName}, ${car.modelName}`
                    }
                })
            }
        }
        next();
    })

    Car.observe('before save', function (ctx, next) {
        if (ctx.instance) {
            // todo add default image
        }
        next();
    })

    Car.observe('before delete', function (ctx, next) {
        console.log('Deleted %s matching %j',
            ctx.Model.pluralModelName,
            ctx.where);

        Car.find({ where: ctx.where }, function (err, cars) {
            if (cars) {
                cars.forEach((car) => {
                    if (app.rabbit) {
                        app.rabbit.publish('image', { action: 'image.delete', value: car.images });
                        app.rabbit.publish('tracker', {
                            action: 'track.delete',
                            value: {
                                carId: `${car.id}`
                            }
                        })
                    }
                })
            }
            next();
        });
    });
    /**
     * Create new car from multipart/form-data. Routes POST /api/cars/new
     */
    Car.createNew = function (car, userId, cb) {
        if (!userId) {
            throw new Error("Request does't contain authority information");
        }
        car.userId = userId;
        car.images = [];
        Car.create(car, (err, carInst) => {
            if (err) throw err;
            cb(null, carInst);
        })
    };
    Car.remoteMethod('createNew', {
        accepts: [
            {
                arg: 'car',
                type: 'object',
                http: (ctx) => {
                    // added by upload middleware
                    return ctx.req.body;
                }
            },
            {
                arg: 'userId',
                type: 'string',
                http: (ctx) => {
                    return ctx.req.get('X-PRINCIPLE');
                }
            }
        ],
        returns: { arg: 'car', type: 'object' },
        http: { path: '/new', verb: 'post', errorStatus: 400 }
    });

    /**
     * Update car data and images. Routes POST (multipart/form-data) to /api/cars/update/:id
     */
    Car.updateCurrent = function (id, car, cb) {
        Car.findById(id, (err, carInst) => {
            if (err) throw err;
            Object.assign(carInst, car);
            Car.updateAll({ id: id }, carInst, (err, info) => {
                if (err) throw err;
                cb(null, carInst);
            })
        });
    };
    Car.remoteMethod('updateCurrent', {
        accepts: [
            { arg: 'id', type: 'string' },
            {
                arg: 'car',
                type: 'object',
                http: (ctx) => {
                    return ctx.req.body;
                }
            }
        ],
        returns: { arg: 'car', type: 'object' },
        http: { path: '/update/:id', verb: 'post', errorStatus: 400 }
    });

    /**
     * X-PRINCIPLE header is added by proxy when user authorization passed
     */
    Car.getCarsByPrinciple = function (userId, cb) {
        if (!userId) throw new Error("Principle doesn't set");
        Car.find({ where: { userId: userId } }, (err, cars) => {
            cb(err, cars);
        })
    };
    Car.remoteMethod('getCarsByPrinciple', {
        accepts: {
            arg: 'userId',
            type: 'string',
            http: (ctx) => {
                return ctx.req.get('X-PRINCIPLE');
            }
        },
        returns: { type: 'array', root: true },
        http: { path: '/getusercars', verb: 'post', errorStatus: 400 }
    });
};
