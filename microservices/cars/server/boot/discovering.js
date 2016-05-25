var registry = require('etcd-registry');
/**
 * Service discovering
 */
module.exports = function (app) {

    var etcd_host = app.get('etcd_host');
    var http_port = app.get('http_port');
    var microserviceName = app.get('ms_name');

    var services;
    app.once('started', function () {
        services = registry(`${etcd_host}:4001`);
        services.join(microserviceName, { port: http_port });
        setTimeout(() => {
            services.lookup(microserviceName, function (err, service) {
                 if (service) {
                    console.log(`Service on ${service.url} registered as ${microserviceName}`);
                } else {
                    console.log(`Service on ${microserviceName} registration failed`);
                }
            });
        }, 1000);
    });

    app.close = (done) => {
        services.leave(microserviceName);
        console.log(`Service ${microserviceName} stopped`);
    };
};
