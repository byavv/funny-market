const rabbit = require('wascally')
    , debug = require("debug")("tracker");

module.exports = function (app, done) {
    var Track = app.models.track;

    function handle() {
        rabbit.handle('tracker.track', (message) => {
            debug("TRACK CAR", message.body)
            Track.create(message.body, (err, track) => {
                err ? message.reject() : message.ack();
            })
        });
        rabbit.handle('tracker.update', (message) => {
            debug("UPDATE TRACKING", message.body)
            if (message.body && message.body.carId)
                Track.findOne({ where: { carId: message.body.carId } }, (err, track) => {
                    if (err || !track) {
                        message.reject();
                    } else {
                        track.updateAttributes({
                            image: message.body.image,
                            description: message.body.description ? message.body.description : track.description
                        }, (err, tr) => {
                            err ? message.reject() : message.ack();
                        })
                    }
                })
        });
        rabbit.handle('tracker.delete', (message) => {
            debug("DELETE FROM TRACKING", message.body)
            if (message.body && message.body.carId)
                Track.destroyAll({ carId: message.body.carId }, (err, info) => {
                    err ? message.reject() : message.ack();
                })
        });
    }
    if (process.env.NODE_ENV != 'test')
        require('../lib/topology')(rabbit, {
            name: app.get('ms_name'),
            host: app.get("rabbit_host")
        })
            .then(handle)
            .then(() => {
                app.rabbit = rabbit;
                debug("Rabbit client started");
            })
            .then(done);

    app.close = () => {
        rabbit.closeAll();
    };
}