"use strict"
var rabbit = require('wascally');
var async = require('async');
var aws = require('aws-sdk');

module.exports = function (app, done) {
    const s3 = new aws.S3({
        accessKeyId: app.get('aws').accessKeyId,
        secretAccessKey: app.get('aws').secretAccessKey,
        signatureVersion: 'v4'
    });
    function handle() {
        rabbit.handle('delete', (message) => {
            console.log("DELETE IMAGES", message.body)
            let images = message.body || [];
            async.each(images, (image, clb) => {
                let params = {
                    Bucket: 'carmarket',
                    Key: image.key,
                };
                s3.deleteObject(params, (err, data) => {
                    clb(err, data)
                });
            }, (err, res) => {
                err ? message.reject() : message.reply("OK");
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
            console.log("Rabbit client started");
        })
        .then(done);

    app.close = () => {
        rabbit.closeAll();
    };
}