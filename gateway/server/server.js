var boot = require('loopback-boot'),
    http = require('http'),
    loopback = require('loopback'),
    path = require('path'),
    YAML = require("yamljs")
    ;

var app = module.exports = loopback();
var host = process.env.HTTP_HOST || "0.0.0.0",
    http_port = process.env.HTTP_PORT || 3001,
    mongo_host = process.env.DBSOURCE_HOST || '127.0.0.1',
    config = getGatewayConfig();

app.set("mongo_host", mongo_host);
app.set('port', http_port);
app.set('url', `https://${host}:${http_port}`);
app.set('access', config.access || []);
app.set('proxyTable', config.proxy || []);
app.set('rate', config.rate || []);
app.set('secret', "mysupersecret");
app.set('x-powered-by', false);

boot(app, __dirname, (err) => {
    if (err) throw err;
    app.start = function () {
        http.createServer(app).listen(http_port, host, () => {
            console.log('PROXY is listening on', `http://${host}:${http_port}`);
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

function getGatewayConfig() {
    try {
        var config = YAML.load(path.join(__dirname, '../gateway.config.yml'));
        return config;
    } catch (err) {
        throw err;
    }
}

