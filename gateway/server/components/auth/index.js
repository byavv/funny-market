"use strict"
const async = require("async")
    , NotAuthorizedError = require("../../lib/errors").err401
    , URL = require('url')
    , debug = require("debug")("proxy")
    ;

var authMiddlewareFactory = (options) => (req, res, next) => {
    if (options.permissions === '*') {
        return next(null);
    } else {
        if (!!req.accessToken && Array.isArray(options.permissions)) {
            let Role = req.app.models.role;
            let ACL = req.app.models.ACL;
            Role.find({
                where: { can: { inq: options.permissions } },
                fields: { 'name': true, 'id': false }
            }, (err, roles) => {
                if (err) throw err;
                if (!roles) return res.status(401).send("Permission can't be granted")
                async.some(roles, (role, callback) => {
                    Role.isInRole(role.name, {
                        principalType: ACL.USER,
                        principalId: req.accessToken.userId
                    }, callback);
                }, (err, result) => {
                    if (err) throw err;
                    return !result // user is not in any appropriate role, which contains required permisison
                        ? res.status(401).send("User authorized, but doesn't have required permissions. Verify that sufficient permissions have been granted")
                        : next();
                });
            });
        } else {
            let url = URL.parse(req.url);
            debug(`Authorization failed for ${req.method} request on ${url.path}`);
            return res.status(401).send(`Not authorized`);
        }
    }
};

var auth = module.exports = (app, componentOptions) => {
    var accessTable = app.get("access");
    var User = app.models.user;
    User.settings.ttl = componentOptions.access_expired || 1209600;
    accessTable.forEach((entry) => {
        var regExp = new RegExp(entry.url);
        if (componentOptions.debug) {
            debug(`secured path: ${regExp} [${entry.grant}]`);
        }
        app.middlewareFromConfig(authMiddlewareFactory, {
            methods: (entry.methods != '*') ? entry.methods : null,
            phase: 'auth',
            paths: regExp,
            params: {
                permissions: entry.grant || "*"
            }
        });
    });
};



