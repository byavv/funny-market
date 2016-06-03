/*jslint node: true */
"use strict";
var boot = require('loopback-boot'),
    http = require('http'),
    loopback = require('loopback'),
    path = require('path'),
    YAML = require("yamljs"),
    debug = require('debug')('proxy')
    ;

const app = module.exports = loopback();
const http_port = process.env.HTTP_PORT || 3001,
    etcd_host = process.env.ETCD_HOST || "192.168.99.100",
    mongo_host = process.env.DBSOURCE_HOST || '127.0.0.1',
    config = configure();

app.set("mongo_host", mongo_host);
app.set("etcd_host", etcd_host);
app.set('port', http_port);
app.set('access', config.access || []);
app.set('proxyTable', config.proxy || []);
app.set('rate', config.rate || []);
app.set('x-powered-by', false);

boot(app, __dirname, (err) => {
    if (err) throw err;
    app.start = () => {
        const httpServer = http.createServer(app).listen(http_port, () => {
            app.emit('started');
            app.close = function (cb) {
                app.removeAllListeners('started');
                app.removeAllListeners('loaded');
                httpServer.close(cb);
            };
            console.log(`Proxy sever started on port ${http_port}`);
        });
    };
    if (require.main === module)
        app.start();
    app.loaded = true;
    app.emit('loaded');
});


function configure() {   
    const filename = process.env.NODE_ENV ? `gateway.config.${process.env.NODE_ENV}.yml` : `gateway.config.yml`;
    try {
        return YAML.load(path.join(__dirname, '../', filename));
    } catch (err) {
        throw err;
    }
}