var registry = require('etcd-registry');
/**
 * Service discovering
 */
module.exports = function (app) {
    if (process.env.NODE_ENV != 'test') {
        var etcd_host = app.get('etcd_host');
        console.log("ETCD", etcd_host)
        var http_port = app.get('http_port');
        var microserviceName = app.get('ms_name');

        var services;
        app.once('started', function () {
            services = registry(`${etcd_host}:4001`);
            services.join(microserviceName, { port: http_port });
            setTimeout(() => {
                services.lookup(microserviceName, (err, service) => {
                    console.log(err)
                    if (service) {
                        console.log(`Service on ${service.url} registered as ${microserviceName}`);
                    } else {
                        console.log(`Service on ${microserviceName} registration failed`);
                    }
                });
            }, 3000);
        });

        app.close = () => {
            services.leave(microserviceName);
            console.log(`Service ${microserviceName} stopped`);
        };
    }
};
