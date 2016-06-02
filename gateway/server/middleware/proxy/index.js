"use strict"
const debug = require('debug')('proxy')
    , httpProxy = require('http-proxy')
    , HttpProxyRules = require('http-proxy-rules')
    , GateWayError = require("../../lib/errors").err502
    , registry = require('etcd-registry')
    ;

/**
 * Creates simple reverse proxy according to the config table, finds target 
 * service in etcd key-value storage and maps request to the result. 
 * 
 * @param {Object} options Options
 * @returns {Function} The express middleware handler
 */
module.exports = function (options) {
    const services = registry(`http://${options.etcd_host}:4001`);
    const proxy = httpProxy.createProxyServer({});
    /**
     * For principle propogation's purposes, adds X-PRINCIPLE header to be consumed 
     * by services within perimeter. May be handy, when your target runs outside of 
     * loopback's authentication system. 
     */
    proxy.on('proxyReq', (proxyReq, req, res, options) => {
        if (req.accessToken && req.accessToken.userId) {
            proxyReq.setHeader('X-PRINCIPLE', req.accessToken.userId);
        }
    });

    let proxyRules = {};
    let proxyTable = options.proxyTable || [];
    proxyTable.forEach((rule) => {
        debug(`map path: ${rule.rule} \u2192 /${rule.mapTo}${rule.withPath}`)
    });
    proxyTable.forEach((rule) => {
        proxyRules[rule.rule] = {
            mapTo: rule.mapTo,
            withPath: rule.withPath
        };
    });
    proxyRules = new HttpProxyRules({
        rules: proxyRules
    });
    /**
     * Find service url in etcd
     */
    let _lookupService = (name) => {
        return new Promise((resolve, reject) => {
            services.lookup(name, (err, service) => {
                if (err || !service) {
                    reject(err || new GateWayError(`Service ${name} is not found or unevailable`));
                } else {
                    resolve(service);
                }
            });
        });
    };
    return (req, res, next) => {
        let target = proxyRules.match(req);
        if (target) {
            _lookupService(target.mapTo).then(service => {
                proxy.web(req, res, {
                    target: service.url + (target.withPath || '/'),
                    secure: options.signedSSLOnly || true // get rid of secure in this project
                }, (err) => {
                    return next(err);
                });
                debug(`${req.method}: ${req.originalUrl} \u2192 ${service.url}${target.withPath} (${service.name})`);
            }).catch((err) => {
                return next(err);
            });
        } else {
            return next(new GateWayError("service can't be found"));
        }
    };
};
