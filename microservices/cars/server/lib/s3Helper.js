module.exports = function (options) {

    var s3 = new aws.S3({
        accessKeyId: 'AKIAJKHY45HRXJI3RXKQ',
        secretAccessKey: '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',
        signatureVersion: 'v4'
    })


    function removeObject(key, callback) {
        if (key) {
            var params = {
                Bucket: options.bucket,
                Key: key,
            };
            s3.deleteObject(params, (err, data) => {
                callback(err, data)
            })
        }
    }
    return {
        removeObject: removeObject
    }
};
