var async = require('async');
var aws = require('aws-sdk');
var s3 = new aws.S3({
    accessKeyId: 'AKIAJKHY45HRXJI3RXKQ',
    secretAccessKey: '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',
    signatureVersion: 'v4'
})
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
                        image: car.images.length > 0 ? car.images[0].url : '/build/cl/assets/images/default.png',
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
                async.each(cars, function (car, done) {
                    async.each(car.images, function (image, callback) {
                        var params = {
                            Bucket: 'carmarket',
                            Key: image.key,
                        };
                        s3.deleteObject(params, function (err, data) {
                            callback(err)
                        });
                    }, function (err) {
                        if (app.rabbit && car) {
                            app.rabbit.publish('tracker', {
                                action: 'track.delete',
                                value: {
                                    carId: `${car.id}`
                                }
                            })
                        }
                        done(err);
                    })

                }, (err) => {
                    next(err);
                })


            } else {
                next();
            }
        });
    });
    /**
     * Create new car from multipart/form-data. Routes POST /api/cars/new
     */
    Car.createNew = function (car, files, userId, cb) {
        console.log(car, files, userId)
        if (!userId) {
            throw new Error("Request does't contain authority information");
        }
        car.userId = userId;
        car.images = (files || []).map((file) => {
            return {
                url: file.location,
                key: file.key
            }
        });
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
                arg: 'files',
                type: 'array',
                http: (ctx) => {
                    // added by upload middleware
                    return ctx.req.files;
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
    Car.updateCurrent = function (id, car, files, cb) {
        console.log(car, files, id)
        Car.findById(id, (err, carInst) => {
            if (err) throw err;
            var images = (files || []).map((file) => {
                return {
                    url: file.location,
                    key: file.key
                }
            });
            carInst.images = carInst.images.concat(images);
            Object.assign(carInst, car);
            Car.updateAll({ id: id }, carInst, (err, info) => {
                if (err) throw err;
                cb(null, info);
            })
        })
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
            },
            {
                arg: 'files',
                type: 'array',
                http: (ctx) => {
                    // added by upload middleware
                    return ctx.req.files;
                }
            }
        ],
        returns: { arg: 'info', type: 'object' },
        http: { path: '/update/:id', verb: 'post', errorStatus: 400 }
    });

    /**
     * Remove car image updating database record and deleting from amason s3
     */
    Car.removeimage = function (carId, key, cb) {
        Car.findById(carId, (err, carInst) => {
            if (err) throw err;
            if (carInst && carInst.images) {
                var image = carInst.images.find(image => image.key == key);
                if (image) {
                    var params = {
                        Bucket: 'carmarket',
                        Key: image.key,
                    };
                    s3.deleteObject(params, function (err, data) {
                        if (err) throw err;
                        carInst.images.splice(carInst.images.indexOf(image), 1);
                        Car.updateAll({ id: carId }, carInst, (err, info) => {
                            if (err) throw err;
                            cb(null, info);
                        })
                    });
                }
            } else {
                cb(null, { message: " nothing was found" })
            }
        })
    };
    Car.remoteMethod('removeimage', {
        accepts: [
            { arg: 'carId', type: 'string' },
            {
                arg: 'key',
                type: 'string',
                http: (ctx) => {
                    return ctx.req.body.key;
                }
            }
        ],
        returns: { arg: 'info', type: 'object' },
        http: { path: '/removeimage/:carId/', verb: 'post', errorStatus: 400 }
    })

    /**
     * X-PRINCIPLE header is added by proxy when user authorization passed
     */
    Car.getCarsByPrinciple = function (userId, cb) {
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
