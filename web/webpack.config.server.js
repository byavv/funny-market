var webpackMerge = require('webpack-merge'),
    path = require('path'),
    webpack = require('webpack'),
    nodeExternals = require('webpack-node-externals'),
    autoprefixer = require('autoprefixer'),
    precss = require('precss')

module.exports = function (env) {
    return {
        target: 'node',
        entry: {
            server: ['./server/server']
        },
        output: {
            path: __dirname + '/build/server',
            filename: "[name].js",
            devtoolModuleFilenameTemplate: '[absolute-resource-path]',
            devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
        },
        externals: [nodeExternals()],
        node: {
            global: true,
            __dirname: true,
            __filename: true,
            process: true,
            Buffer: true
        }
    }
}