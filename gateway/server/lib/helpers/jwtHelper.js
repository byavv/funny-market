var jwt = require("jsonwebtoken");

module.exports = function(options) {
    var secret = options.secret || "abrakadabra";
    var expiresIn = options.expires || 5000;
    return {
        create: function(payload, tokenOptions) {
            return jwt.sign(payload, secret, {
                issuer: tokenOptions.issuer,
                audience: tokenOptions.for,
                expiresIn: expiresIn
            });
        }
    };
};