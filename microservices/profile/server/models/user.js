"use strict"
const async = require('async')
    , debug = require('debug')('profile');

module.exports = function (User) {
    var app;
    User.on('attached', function (a) {
        app = a;
    });
    User.deleteUser = function (userId, done) {
        if (!userId) {
            return done(new Error('Bad request'));
        }
        async.waterfall([
            (callback) => {
                User.findOne({ where: { id: userId } }, callback)
            },
            (user, callback) => {
                if (user && user.profile) {
                    user.profile.destroy((err) => {
                        callback(err, user);
                    })
                } else {
                    callback(new Error("User not found"));
                }
            },
            (user, callback) => {
                user.destroy((err) => {
                    callback(err, user.id);
                })
            },
            (userId, callback) => {
                if (app.rabbit) {
                    app.rabbit.request('ms.1', {
                        routingKey: "cars",
                        type: 'delete.all',
                        body: userId
                    }).then((final) => {
                        debug("ALL BOUND CARS DELETED");
                        callback(null, final.body);
                        final.ack();
                    });
                } else {
                    callback(new Error("Operation can't be completed, broker is not available"));
                }
            }], (err, result) => {
                return done(err, result);
            })
    };
    User.remoteMethod('deleteUser', {
        accepts: {
            arg: 'userId',
            type: 'string',
            http: (ctx) => {
                return ctx.req.get('X-PRINCIPLE');
            }
        },
        returns: { type: 'object', root: true },
        http: { path: '/deleteuserandprofile', verb: 'post', errorStatus: 400 }
    });

    User.updatePassword = function (userId, data, done) {
        if (!userId) {
            return done(new Error('Bad request'));
        }
        User.findOne({ where: { id: userId } }, (err, user) => {
            if (err || !user) return done(err || new Error("User not found"))
            user.hasPassword(data.oldPassword, (err, isMatch) => {
                if (err) return done(err);
                if (isMatch) {
                    user.updateAttributes({
                        password: data.newPassword
                    }, done)
                } else {
                    return done(new Error("Wrong password"))
                }
            })
        })
    };
    User.remoteMethod('updatePassword', {
        accepts: [
            {
                arg: 'userId',
                type: 'string',
                http: (ctx) => {
                    return ctx.req.get('X-PRINCIPLE');
                }
            }, {
                arg: 'data',
                type: 'object',
                http: (ctx) => {
                    return ctx.req.body;
                }
            }
        ],
        returns: { type: 'object', root: true },
        http: { path: '/updatePassword', verb: 'post', errorStatus: 400 }
    });

    User.updateAccount = function (userId, data, done) {
        if (!userId) {
            return done(new Error('Bad request'));
        }
        User.findOne({ where: { id: userId } }, (err, user) => {
            if (err || !user) return done(err || new Error("User not found"))
            user.updateAttributes({
                username: data.username,
                email: data.email
            }, done);
        })
    };
    User.remoteMethod('updateAccount', {
        accepts: [
            {
                arg: 'userId',
                type: 'string',
                http: (ctx) => {
                    return ctx.req.get('X-PRINCIPLE');
                }
            }, {
                arg: 'data',
                type: 'object',
                http: (ctx) => {
                    return ctx.req.body;
                }
            }
        ],
        returns: { type: 'object', root: true },
        http: { path: '/updateAccount', verb: 'post', errorStatus: 400 }
    });

    User.getUserByPrinciple = function (userId, cb) {
        User.findOne({ where: { id: userId } }, (err, user) => {
            cb(err, user);
        })
    };
    User.remoteMethod('getUserByPrinciple', {
        accepts: {
            arg: 'userId',
            type: 'string',
            http: (ctx) => {
                return ctx.req.get('X-PRINCIPLE');
            }
        },
        returns: { type: 'object', root: true },
        http: { path: '/getUser', verb: 'get', errorStatus: 400 }
    });
};
