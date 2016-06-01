var rabbit = require('wascally');

module.exports = function (app, done) {
    function handle() {
        rabbit.handle('update', (message) => {
            message.reply(track);
        });
    }
    require('../lib/topology')(rabbit, {
        name: app.get('ms_name'),
        host: app.get("rabbit_host")
    })
        .then(() => {
            app.rabbit = rabbit;
            console.log("Rabbit client started");
        })
        .then(handle)
        .then(done);

    app.close = () => {
        rabbit.closeAll();
    };
}