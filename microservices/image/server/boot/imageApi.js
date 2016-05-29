var aws = require('aws-sdk');
module.exports = function (server) {
  var s3 = new aws.S3({
    accessKeyId: server.get('aws').accessKeyId,
    secretAccessKey: server.get('aws').secretAccessKey,
    signatureVersion: 'v4'
  });

  var router = server.loopback.Router();
  router.get('/', server.loopback.status());

  router.post('/api/remove', (req, res) => {
    var params = {
      Bucket: 'carmarket',
      Key: req.body.key,
    };
    s3.deleteObject(params, function (err, data) {
      if (err) throw err;
      console.log("Try to delete image", req.body.carId, req.body.key)
      if (server.rabbit) {
        server.rabbit.publish('cars', { action: 'cars.delete.image', value: { carId: req.body.carId, key: req.body.key } }, (err, result) => {
          if (err) return res.sendStatus(500);
          return res.status(200).send({ message: "delete success" });
        });
      }
    });
  })
  router.post('/api/upload/:carId', (req, res) => {
    console.log("UPLOAD IMAGES", req.params.carId);
    console.log("FILES", req.files);
    var files = req.files;
    var carId = req.params.carId;
    if (!carId) return res.sendStatus(400);
    server.rabbit.publish('cars', { action: 'cars.update.images', value: { carId: carId, files: files } }, (err, result) => {
      if (err) return res.sendStatus(500);
      return res.status(200).send({ message: "upload success" });
    });
  });
  server.use(router);
};
