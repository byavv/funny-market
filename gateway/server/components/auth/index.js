var async = require("async"),
    _ = require("lodash"),
    NotAuthorizedError = require("../../lib/errors").err401,
    URL = require('url')
    ;

var authMiddlewareFactory = (options) => (req, res, next) => {
    if (options.permissions === '*') {
        return next(null);
    } else {
        if (!!req.accessToken && Array.isArray(options.permissions)) {
            var Role = req.app.models.role;
            var ACL = req.app.models.ACL;
            Role.find({
                where: { can: { inq: options.permissions } },
                fields: { 'name': true, 'id': false }
            }, (err, roles) => {
                if (err) throw err;
                if (!roles) return next(new NotAuthorizedError("Permission can't be granted"));
                async.some(roles, (role, callback) => {
                    Role.isInRole(role.name, {
                        principalType: ACL.USER,
                        principalId: req.accessToken.userId
                    }, callback);
                }, (err, result) => {
                    return next((!result || err) ? new NotAuthorizedError("User authorized, but has not permissions") : null);
                });
            });
        } else {
            var url = URL.parse(req.url);
            return next(new NotAuthorizedError(`Not authorized for ${req.method} request on ${url}`));
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
            console.log("secured path: ", regExp, "permissions:", entry.grant);
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



