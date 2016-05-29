"use strict"
var Client = require('../lib/rabbit');
var async = require('async');
var aws = require('aws-sdk');
module.exports = function (app, done) {
    var microserviceName = app.get('ms_name');
    var rabbit_host = app.get("rabbit_host");

    if (process.env.NODE_ENV != 'test') {

        const s3 = new aws.S3({
            accessKeyId: app.get('aws').accessKeyId,
            secretAccessKey: app.get('aws').secretAccessKey,
            signatureVersion: 'v4'
        });

        const client = new Client({
            host: `amqp://${rabbit_host}`,
            name: microserviceName
        });

        client.open()
            .then((rabbit) => {
                app.rabbit = rabbit;
                rabbit.subscribe((message, callback) => {
                    switch (message.action) {
                        case 'image.delete':
                            console.log("DELETE IMAGES", message.value)
                            let images = message.value || [];
                            async.each(images, (image, clb) => {
                                let params = {
                                    Bucket: 'carmarket',
                                    Key: image.key,
                                };
                                s3.deleteObject(params, (err, data) => {
                                    clb(err, data)
                                });
                            }, (err, res) => {
                                callback({ err: err, result: res });
                            });
                            break;
                        default:
                            callback({ err: "wrong operation" });
                            break;
                    }
                });
            })
            .then(done)
            .catch(done);

        app.close = () => {
            client.close();
        };
    } else {
        done()
    };
};
