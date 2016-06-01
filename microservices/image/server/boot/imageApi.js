"use strict"
const aws = require('aws-sdk')
  , debug = require('debug')('image');
module.exports = function (server) {
  var s3 = new aws.S3({
    accessKeyId: server.get('aws').accessKeyId,
    secretAccessKey: server.get('aws').secretAccessKey,
    signatureVersion: 'v4'
  });

  var router = server.loopback.Router();
  router.get('/', server.loopback.status());

  router.post('/api/remove', (req, res) => {
    if (req.body && req.body.key) {
      var params = {
        Bucket: 'carmarket',
        Key: req.body.key,
      };
      s3.deleteObject(params, function (err, data) {
        if (err) throw err;
        if (server.rabbit) {
          server.rabbit.publish('ms.1', {
            type: 'delete.image',
            routingKey: "cars",
            body: { carId: req.body.carId, key: req.body.key }
          }).then(() => {
            debug(`DELETED ${req.body.key} IMAGE`);
            return res.status(200).send({ message: "delete success" });
          });
        }
      });
    } else {
      return res.status(400).send({ message: "Format error, key not found" });
    }

  })
  router.post('/api/upload/:carId', (req, res) => {
    debug(`UPLOAD ${req.files ? req.files.length : 'ERR'} IMAGES FOR USER: ${req.params.carId}`);
    var files = req.files;
    var carId = req.params.carId;
    if (!carId) return res.sendStatus(400);

    server.rabbit.publish('ms.1', {
      type: 'update.images',
      routingKey: "cars",
      body: { carId: carId, files: files }
    }).then(() => {
      return res.status(200).send({ message: "upload success" });
    });

  });
  server.use(router);
};
