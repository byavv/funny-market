var debug = require('debug')('proxy');
var httpProxy = require('http-proxy');
var HttpProxyRules = require('http-proxy-rules');
var GateWayError = require("../../lib/errors").err502;
var registry = require('etcd-registry')('http://192.168.99.100:4001');

/**
 * Creates simple reverse proxy according to the config table, finds target 
 * service in etcd key-value storage and maps request to the result.
 * For principle propogation's purposes, adds X-PRINCIPLE header to be consumed 
 * by services within perimeter.
 * 
 * @param {Object} options Options
 * @returns {Function} The express middleware handler
 */
module.exports = function (options) {
    var proxy = httpProxy.createProxyServer({});
    proxy.on('proxyReq', function (proxyReq, req, res, options) {
        if (req.accessToken && req.accessToken.userId) {
            proxyReq.setHeader('X-PRINCIPLE', req.accessToken.userId);
        }
    });
    var proxyRules = {};
    proxyTable = options.proxyTable || [];
    proxyTable.forEach((rule) => {
        proxyRules[rule.rule] = {
            mapTo: rule.mapTo,
            withPath: rule.withPath
        };
    });
    proxyRules = new HttpProxyRules({
        rules: proxyRules
    });
    return (req, res, next) => {
        var target = proxyRules.match(req);
        if (target) {
            _lookupService(target.mapTo).then(service => {
                proxy.web(req, res, {
                    target: service.url + (target.withPath || '/'),
                    secure: options.signedSSLOnly || true // get rid of secure in this project
                }, (err) => {
                    return next(err);
                });
                console.log(`Request proxied to: ${service.name} microservice, on url:`, `${service.url}${target.withPath}`);
            }).catch((err) => {
                return next(err);
            });
        } else {
            return next(new GateWayError("service can't be found"));
        }
    };
};

var _lookupService = (name) => {
    return new Promise((resolve, reject) => {
        registry.lookup(name, (err, service) => {
            if (err || !service) {
                reject(err || new GateWayError(`Service ${name} is not found or unevailable`));
            } else {
                resolve(service);
            }
        });
    });
};