


var webpackMerge = require('webpack-merge'),
    path = require('path'),
    webpack = require('webpack'),
    nodeExternals = require('webpack-node-externals'),
    autoprefixer = require('autoprefixer'),
    precss = require('precss')

module.exports = function (env) {
    return {
        target: 'web',
        entry: {
            vendors: ['./client/vendors.ts']
        },
        output: {
            path: __dirname + '/build/client',
            filename: "[name].js",
            library: "vendors",
            libraryTarget: 'var'
        },

        plugins: [
            new webpack.DllPlugin({
                name: "vendors",
                path: path.join(__dirname, "build/client", "vendors-manifest.json"),
            })
        ]
    };
}