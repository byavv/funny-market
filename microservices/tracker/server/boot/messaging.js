var rabbit = require('wascally');

module.exports = function (app, done) {
    var Track = app.models.track;

    function handle() {
        rabbit.handle('track', (message) => {
            console.log("TRACK CAR", message.body)
            Track.create(message.body, (err, track) => {
                err ? message.reject() : message.reply(track);
            })
        });
        rabbit.handle('update', (message) => {
            if (message.body && message.body.carId)
                Track.findOne({ where: { carId: message.body.carId } }, (err, track) => {
                    if (err || !track) {
                        message.reject();
                    } else {
                        track.updateAttributes({
                            image: message.body.image,
                            description: message.body.description ? message.body.description : track.description
                        }, (err, tr) => {
                            err ? message.reject() : message.reply(tr);
                        })
                    }
                })
        });
        rabbit.handle('delete', (message) => {
            console.log("DELETE FROM TRACKING", message.body)
            if (message.body && message.body.carId)
                Track.destroyAll({ carId: message.body.carId }, (err, info) => {
                    err ? message.reject() : message.reply(info);
                })
        });
    }

    require('../lib/topology')(rabbit, {
        name: app.get('ms_name'),
        host: app.get("rabbit_host")
    })
        .then(() => {
            app.rabbit = rabbit;
            console.log("Rabbit client started")
        })
        .then(handle)
        .then(done);

    app.close = () => {
        rabbit.closeAll();
    };
}