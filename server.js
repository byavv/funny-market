var proxyServer = require('./gateway');
var carserver = require('./microservices/cars');
var usertsserver = require('./microservices/profile');

proxyServer.once('loaded', function() {
    proxyServer.start();
});

carserver.once('loaded', function() {
    carserver.start();
});

usertsserver.once('loaded', function() {
    usertsserver.start();
});

//loopback-boot loopback-component-explorer loopback-connector-mongodb loopback-datasource-juggler