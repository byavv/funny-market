var webpackMerge = require('webpack-merge'),
    path = require('path'),
    webpack = require('webpack'),
    CompressionPlugin = require('compression-webpack-plugin'),
    WebpackMd5Hash = require('webpack-md5-hash')
    ;

var common = {
    externals: [path.join(__dirname, 'node_modules')],
    resolve: {
        extensions: ['', '.ts', '.js', '.json', ".scss", ".css"],
        root: [
            path.join(__dirname, 'node_modules')
        ],
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: "raw" },
            { test: /\.json$/, loader: 'json' },
            { test: /\.(png|jpg)$/, loader: "url?limit=25000" },
            { test: /\.jpe?g$|\.gif$|\.png$|\.wav$|\.mp3$|\.otf$/, loader: "file" },
            { test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file" },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: [
                    /node_modules/
                ],
                query: {
                    ignoreDiagnostics: [
                        2403, // 2403 -> Subsequent variable declarations
                        2300, // 2300 -> Duplicate identifier
                        2374, // 2374 -> Duplicate number index signature
                        2375, // 2375 -> Duplicate string index signature
                        2502  // 2502 -> Referenced directly or indirectly
                    ]
                },
            }
        ],
        postLoaders: []
    },
    plugins: [
    ]
};

module.exports = function (env) {
    env = env || process.env.NODE_ENV || "development";
    var productionTools = {
        debug: false,
        plugins: [
            /*
             * Plugin: UglifyJsPlugin
             * Description: Minimize all JavaScript output of chunks
             * See: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
             */
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                mangle: {
                    screw_ie8: true,
                    keep_fnames: true
                },
                compress: {
                    screw_ie8: true,
                    warnings: false
                },
                comments: false
            }),
            new CompressionPlugin({
                regExp: /\.css$|\.html$|\.js$|\.map$/,
                threshold: 2 * 1024
            }),
            /*
             * Plugin: WebpackMd5Hash
             * Description: Plugin to replace a standard webpack chunkhash with md5.             
             * See: https://www.npmjs.com/package/webpack-md5-hash
             */
            new WebpackMd5Hash(),
            /*
             * Plugin: DedupePlugin
             * Description: Prevents code duplicates
             * See: https://github.com/webpack/docs/wiki/optimization#deduplication
             */
            new webpack.optimize.DedupePlugin(),
            /*
             * Plugin: OccurenceOrderPlugin
             * Description: Varies the distribution of the ids to get the smallest id length
             * for often used ids.
             * See: https://github.com/webpack/docs/wiki/optimization#minimize
             */
            new webpack.optimize.OccurenceOrderPlugin(true),
        ]
    }
    var devTools = {
        devtool: 'source-map',
        debug: true,
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    }

    var client, server, vendors, test;
    if (env === 'development') {
        client = webpackMerge(common, require('./webpack.config.client')(env), devTools);
        server = webpackMerge(common, require('./webpack.config.server')(env), devTools);
    }
    if (env === 'production') {
        client = webpackMerge(common, require('./webpack.config.client')(env), productionTools);
        server = webpackMerge(common, require('./webpack.config.server')(env), {});
    }
    if (env === 'test') {
        test = webpackMerge(common, require('./webpack.config.client')(env));
    }
    return {
        server: server,
        client: client,
        test: test
    }
}
