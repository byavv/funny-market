module.exports = function (Profile) {
    Profile.getProfile = function (userId, cb) {
        Profile.findOne({ where: { userId: userId } }, (err, profile) => {
            cb(err, profile);
        })
    };
    Profile.remoteMethod('getProfile', {
        accepts: {
            arg: 'userId',
            type: 'string',
            http: (ctx) => {
                return ctx.req.get('X-PRINCIPLE');
            }
        },
        returns: { type: 'object', root: true },
        http: { path: '/getProfile', verb: 'get', errorStatus: 400 }
    });

    Profile.updateProfile = function (profile, userId, cb) {
        Profile.updateAll({ userId: userId }, profile, cb)
    };
    Profile.remoteMethod('updateProfile', {
        accepts: [
            {
                arg: 'profile',
                type: 'object',
                http: (ctx) => {
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
        returns: { type: 'object', root: true },
        http: { path: '/updateProfile', verb: 'post', errorStatus: 400 }
    });
};
