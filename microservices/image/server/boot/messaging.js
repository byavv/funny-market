"use strict"
const rabbit = require('wascally')
    , async = require('async')
    , aws = require('aws-sdk')
    , debug = require('debug')('image');

module.exports = function (app, done) {
    const s3 = new aws.S3({
        accessKeyId: app.get('aws').accessKeyId,
        secretAccessKey: app.get('aws').secretAccessKey,
        signatureVersion: 'v4'
    });
    function handle() {
        rabbit.handle('delete', (message) => {
            const images = message.body || [];
            async.each(images, (image, callback) => {
                let params = {
                    Bucket: 'carmarket',
                    Key: image.key,
                };
                s3.deleteObject(params, (err, data) => {
                    callback(err, data)
                });
            }, (err, res) => {
                err ? message.nack() : message.ack();
            });
        });
    }
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