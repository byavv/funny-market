"use strict"

const rabbit = require('wascally')
    , debug = require('debug')("profile")


module.exports = function (app, done) {
    function handle() {

    }
    if (process.env.NODE_ENV != 'test')
        require('../lib/topology')(rabbit, {
            name: app.get('ms_name'),
            host: app.get("rabbit_host")
        })
            .then(() => {
                app.rabbit = rabbit;
                debug("Rabbit client started");
            })
            .then(handle)
            .then(done);

    app.close = () => {
        rabbit.closeAll();
    };
}