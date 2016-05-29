module.exports = function(server) {
    var router = server.loopback.Router();
    router.get('/', server.loopback.status());
};
