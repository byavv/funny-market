var multer = require('multer');
var multerS3 = require('multer-s3');
var aws = require('aws-sdk');

var s3 = new aws.S3({
    accessKeyId: 'AKIAJKHY45HRXJI3RXKQ',
    secretAccessKey: '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',
    signatureVersion: 'v4'
})

module.exports = function (options) {
    var upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: options.bucket,
            acl: 'public-read',
            key: function (req, file, cb) {
                var userId = req.get('X-PRINCIPLE');
                if (userId) {
                    cb(null, userId + '/' + Date.now().toString() + file.originalname);
                } else {
                    cb(new Error("Not authorized"));
                }
            }
        })
    });
    return upload.array(options.field, options.maxCount);
};