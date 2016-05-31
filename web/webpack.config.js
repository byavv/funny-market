var webpackMerge = require('webpack-merge'),
    path = require('path'),
    webpack = require('webpack'),
    nodeExternals = require('webpack-node-externals')
    ;
var CopyWebpackPlugin = require('copy-webpack-plugin');

var common = {
    devServer: {
        stats: 'errors-only',
    },
    resolve: {
        extensions: ['', '.ts', '.json', '.js', ".less", ".sass"]
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: "raw" },
            { test: /\.json$/, loader: 'json' },
            { test: /\.css$/, loader: "raw" },
            { test: /\.less$/, loader: "raw!less" },
            { test: /\.scss$/, loader: "raw!sass" },
            { test: /\.(png|jpg)$/, loader: "url?limit=25000" },
            { test: /\.jpe?g$|\.gif$|\.png$|\.wav$|\.mp3$|\.otf$/, loader: "file" },
            { test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file" },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: ['node_modules'],
                query: {
                    ignoreDiagnostics: [
                        2403, // 2403 -> Subsequent variable declarations
                        2300, // 2300 -> Duplicate identifier
                        2374, // 2374 -> Duplicate number index signature
                        2375, // 2375 -> Duplicate string index signature
                    ]
                },
            },          
            {
                test: /\.js$|\.css$/,
                include: /node_modules/,
                loaders: ['strip-sourcemap-loader']
            }
        ],
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(true)
    ]
};

var client_in_browser_ui_config = {
    target: 'web',
    entry: {
        main: ['./client/bootstrap.ts']
    },
    output: {
        path: __dirname + '/build/client',
        filename: "[name].js",
        pathinfo: false,
        publicPath: '/build/client/',
    },
    node: {
        global: true,
        __dirname: true,
        __filename: true,
        process: true,
        Buffer: false
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            sourceType: 'var',
            get manifest() {
                return require(path.join(__dirname, "build/client", "vendors-manifest.json"));
            }
        }),
        new webpack.DefinePlugin({

        }),
        new webpack.ProvidePlugin({
            _: "lodash"
        }),
        new CopyWebpackPlugin([{ from: 'client/assets', to: 'assets' }]),
    ]
};


var vendors_config = {
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

var server_config = {
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
};


module.exports = function (env) {
    var environment = env || process.env.NODE_ENV || "development";
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

    var client, server, vendors;
    if (environment === 'development') {
        client = webpackMerge(common, client_in_browser_ui_config, devTools);
        server = webpackMerge(common, server_config, devTools);
        vendors = webpackMerge(common, vendors_config, {/*dev specific config */ });
    }
    if (environment === 'production') {
        client = webpackMerge(common, client_in_browser_ui_config, Object.assign({}, productionTools));
        server = webpackMerge(common, server_config, {/*production specific config */ });
        vendors = webpackMerge(common, vendors_config, Object.assign({}, productionTools));
    }

    return {
        server: server,
        client: client,
        vendors: vendors
    }
}
