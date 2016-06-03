var RateLimiter = require('limiter').RateLimiter,
    _ = require("lodash")
    ;

function rateMiddlewareFactory(options) {
    var limiter;
    return (req, res, next) => {
        var limit = options.limit;
        var interval = options.interval;
        if (!limiter) {
            limiter = new RateLimiter(limit, interval);
        }
        limiter.removeTokens(1, (err, remainingRequests) => {            
            if (err) throw err;
            if (remainingRequests < 0) {
                return res.status(429).json({ error: 'Too many requests' });
            } else {
                res.setHeader('X-RateLimit-Limit', limit);
                res.setHeader('X-RateLimit-Remaining', remainingRequests);
                return next();
            }
        });
    };
}

module.exports = function(app, options) {
    options = options || {};
    var rateTable = app.get("rate");
    (rateTable || []).forEach(rate => {
        if (rate.limit && rate.interval && _.isArray(rate.paths) && rate.paths.length > 0) {
            app.middlewareFromConfig(rateMiddlewareFactory, {
                methods: rate.methods,
                phase: 'auth:after',
                paths: rate.paths,
                params: {
                    limit: rate.limit || options.defaultLimit || '150',
                    interval: rate.interval || options.defaultInterval || 'hour'
                }
            });
        } else {
            throw new Error("Wrong rate limiter config");
        }
    });
};
