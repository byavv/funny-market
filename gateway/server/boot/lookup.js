/*jslint node: true */
const registry = require('etcd-registry'),
    GateWayError = require("../lib/errors").err502
    ;

module.exports = (app) => {
    const services = registry(`http://${app.get('etcd_host')}:4001`);
    app.lookup = (name) => new Promise((resolve, reject) => {
        services.lookup(name, (err, service) => {
            if (err || !service) {
                reject(err || new GateWayError(`Service ${name} is not found or unevailable`));
            } else {
                resolve(service);
            }
        });
    });
};