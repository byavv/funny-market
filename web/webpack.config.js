var webpackMerge = require('webpack-merge'),
    path = require('path'),
    webpack = require('webpack'),
    nodeExternals = require('webpack-node-externals'),
    autoprefixer = require('autoprefixer'),
    precss = require('precss')
    ;

var common = {
    devServer: {
        stats: 'errors-only',
    },
    resolve: {
        extensions: ['', '.ts', '.json', '.js', ".scss", ".css"]
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: "raw" },
            { test: /\.json$/, loader: 'json' },
            { test: /\.css$/, loader: "raw!postcss" },
            { test: /\.scss$/, loader: "raw!postcss!sass" },
            { test: /\.(png|jpg)$/, loader: "url?limit=25000" },
            { test: /\.jpe?g$|\.gif$|\.png$|\.wav$|\.mp3$|\.otf$/, loader: "file" },
            { test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file" },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: [/node_modules/],
                query: {
                    ignoreDiagnostics: [
                        2403, // 2403 -> Subsequent variable declarations
                        2300, // 2300 -> Duplicate identifier
                        2374, // 2374 -> Duplicate number index signature
                        2375, // 2375 -> Duplicate string index signature
                        2502  // 2502 -> Referenced directly or indirectly
                    ]
                },
            },
            {
                test: /\.js$|\.css$/,
                include: /node_modules/,
                loaders: ['strip-sourcemap-loader']
            }
        ],
        postLoaders: [],
        noParse: [/.+zone\.js\/dist\/.+/, /.+@angular2\/.+/, /angular2-polyfills\.js/]
    },
    postcss: function () {
        return [
            autoprefixer({ browsers: ['last 2 versions'] }),
            precss
        ];
    },
    plugins: [
        /*
        * Plugin: OccurenceOrderPlugin
        * Description: Varies the distribution of the ids to get the smallest id length
        * for often used ids.
        *
        * See: https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
        * See: https://github.com/webpack/docs/wiki/optimization#minimize
        */
        new webpack.optimize.OccurenceOrderPlugin(true)
    ]
};

module.exports = function (env) {
    env = env || process.env.NODE_ENV || "development";
    var productionTools = {
        plugins: [
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
                mangle: false,
                compress: {
                    warnings: false
                }
            })
        ]
    }
    var devTools = {
        devtool: "source-map",
        debug: true,
        plugins: [new webpack.HotModuleReplacementPlugin()]
    }

    var client, server, vendors, test;
    if (env === 'development') {
        client = webpackMerge(common, require('./webpack.config.client')(env), devTools);
        server = webpackMerge(common, require('./webpack.config.server')(env), devTools);
        vendors = webpackMerge(common, require('./webpack.config.vendors')(env), {/*dev specific config */ });
    }
    if (env === 'production') {
        client = webpackMerge(common, require('./webpack.config.client')(env), productionTools, {/*production specific config */ });
        server = webpackMerge(common, require('./webpack.config.server')(env), {/*production specific config */ });
        vendors = webpackMerge(common, require('./webpack.config.vendors')(env), productionTools, {/*production specific config */ });
    }
    if (env === 'test') {
        test = webpackMerge(common, require('./webpack.config.client')(env));
    }

    return {
        server: server,
        client: client,
        test: test,
        vendors: vendors
    }
}
