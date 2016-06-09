'use strict';
const webpack = require('webpack'),
    nodeExternals = require('webpack-node-externals');

module.exports = function (env) {
    return {
        target: 'node',
        entry: {
            server: ['./server/server']
        },
        module: {
            loaders: [
                { test: /\.css$/, loader: "raw" },
                { test: /\.scss$/, loader: "raw!sass" }
            ]
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