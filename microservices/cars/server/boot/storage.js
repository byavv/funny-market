var path = require('path');
var loopback = require("loopback");
module.exports = function (app) {
    var ds = loopback.createDataSource({
        connector: require('loopback-component-storage'),
        provider: 'amazon',
        key: "ARkQdku4sreqXdcz4+8j5TxLriNzNbBPWKINHTbw",
        keyId: "AKIAJKHY45HRXJI3RXKQ",
        bucket: "carmarket2",
        acl: 'public-read',
        allowedContentTypes: ['image/png', 'image/jpeg']
    });
    var container = ds.createModel('container');
    app.model(container);
};
