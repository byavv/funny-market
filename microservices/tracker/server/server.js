"use strtict"
const boot = require('loopback-boot')
    , http = require('http')
    , loopback = require('loopback')
    , app = module.exports = loopback()
    , debug = require('debug')('tracker');

var host = process.env.HTTP_HOST || "0.0.0.0",
    http_port = process.env.HTTP_PORT || 3006,
    etcd_host = process.env.ETCD_PORT || '192.168.99.100',
    rabbit_host = process.env.BROCKER_HOST || '192.168.99.100';

app.set('http_port', http_port);
app.set('etcd_host', etcd_host);
app.set('rabbit_host', rabbit_host);
app.set("ms_name", 'tracker');

boot(app, __dirname, (err) => {
    if (err) throw err;
    app.start = function () {
        var httpServer = http.createServer(app).listen(http_port, () => {            
            app.emit('started');
            app.close = (done) => {
                app.removeAllListeners('started');
                app.removeAllListeners('loaded');
            };
        });
    };
    if (require.main === module)
        app.start();
    app.loaded = true;
    app.emit('loaded');
});
