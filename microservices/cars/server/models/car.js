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
                /* app.rabbit.publish('tracker', {
                     action: 'track',
                     value: {
                         carId: `${car.id}`,
                         image: '/static/assets/img/default.png',
                         description: `${car.makerName}, ${car.modelName}`
                     }
                 })*/
                app.rabbit.request('ms.1', {
                    type: 'track',
                    routingKey: "tracker",
                    body: {
                        carId: `${car.id}`,
                        image: '/static/assets/img/default.png',
                        description: `${car.makerName}, ${car.modelName}`
                    }
                }).then(function (final) {
                    console.log(final.body);
                    final.ack();
                });
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
                        app.rabbit.request('ms.1', {
                            routingKey: "image",
                            type: "delete",
                            body: car.images
                        }).then((final) => {
                            console.log(final.body);
                            final.ack();
                        });

                        app.rabbit.request('ms.1', {
                            type: "delete",
                            routingKey: "tracker",
                            body: {
                                carId: `${car.id}`
                            }
                        }).then((final) => {
                            console.log(final.body);
                            final.ack();
                        });


                        /*  app.rabbit.publish('image', { action: 'image.delete', value: car.images });
                          app.rabbit.publish('tracker', {
                              action: 'track.delete',
                              value: {
                                  carId: `${car.id}`
                              }
                          })*/
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
            cb(new Error("Request does't contain authority information"));
        }
        car.userId = userId;
        car.images = [];
        Car.create(car, (err, carInst) => {
            if (err) cb(err);
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
            if (err || !carInst) return cb(err || "Not found");
            Object.assign(carInst, car);
            Car.updateAll({ id: id }, carInst, (err, info) => {
                if (err) return cb(err);
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
        if (!userId) return cb(new Error("Principle doesn't set"));
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

    Car.search = function (query, cb) {
        Car.find(query).then((cars) => {
            return cb(null, cars)
        }).catch((err) => {
            return cb(err)
        })
    }

    Car.remoteMethod(
        'search',
        {
            accepts: [
                {
                    arg: 'query',
                    type: 'object',
                    http: (ctx) => {
                        var filterQuery = _createFilterQuery(ctx.req.body);
                        var optionsQuery = _createOptionsQuery(ctx.req.body);
                        var fields = {
                            fields: {
                                id: true,
                                makerName: true,
                                modelName: true,
                                description: true,
                                images: true,
                                price: true,
                                year: true,
                                milage: true
                            }
                        }
                        return Object.assign({ where: filterQuery }, optionsQuery, fields);
                    }
                }
            ],
            returns: { type: 'array', root: true },
            http: { path: '/search', verb: 'post', errorStatus: 400 }
        }
    );


    Car.count = function (query, cb) {
        Car.count(query).then((count) => {
            return cb(null, count)
        }).catch((err) => {
            return cb(err)
        })
    }

    Car.remoteMethod(
        'count',
        {
            accepts: [
                {
                    arg: 'query',
                    type: 'object',
                    http: (ctx) => {
                        return _createFilterQuery(ctx.req.body);
                    }
                }
            ],
            returns: { arg: 'count', type: 'number' },
            http: { path: '/count', verb: 'post', errorStatus: 400 }
        }
    );

    function _createOptionsQuery(request) {
        var query = {};
        if (request.sort) {
            var sort = request.sort;
            var sort = sort.replace('+', " ASC");
            var sort = sort.replace("-", " DESC");
            Object.assign(query, { order: sort })
        }
        if (request.limit) {
            Object.assign(query, { limit: +request.limit })
        }
        if (request.limit && request.page) {
            Object.assign(query, { skip: (+request.limit) * (+request.page - 1) })
        }
        return query;
    }

    function _createFilterQuery(request) {
        var query = [];
        if (request) {
            if (request.model) {
                query.push({ modelName: request.model });
            }
            if (request.maker) {
                query.push({ makerName: request.maker });
            }
            if (request.priceFrom) {
                query.push({ price: { gte: +request.priceFrom } });
            }
            if (request.priceUp) {
                query.push({ price: { lte: +request.priceUp } });
            }
            if (request.yearFrom) {
                query.push({ year: { gte: +request.yearFrom } });
            }
            if (request.yearUp) {
                query.push({ year: { lte: +request.yearUp } });
            }
            if (request.colors && request.colors.length > 0) {
                query.push({ color: { inq: request.colors } });
            }
            if (request.milageUp) {
                query.push({ milage: { lte: +request.milageUp } });
            }
            if (request.milageFrom) {
                query.push({ milage: { gte: +request.milageFrom } });
            }
            if (request.engineTypes && request.engineTypes.length > 0) {
                query.push({ engineType: { inq: request.engineTypes } });
            }
        }
        return query.length > 0 ? { and: query } : {};
    }

};
