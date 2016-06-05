var webpackMerge = require('webpack-merge'),
    path = require('path'),
    webpack = require('webpack'),
    nodeExternals = require('webpack-node-externals'),
    autoprefixer = require('autoprefixer'),
    precss = require('precss'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');
;

module.exports = function (env) {
    var client_for_browser = {
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
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                sourceType: 'var',
                get manifest() {
                    return require(path.join(__dirname, "build/client", "vendors-manifest.json"));
                }
            }),
            new CopyWebpackPlugin([{ from: 'client/assets', to: 'assets' }]),
            new webpack.DefinePlugin({/* just in case */ }),
            new webpack.ProvidePlugin({/* just in case */ })
        ],
        node: {
            global: true,
            __dirname: true,
            __filename: true,
            process: true,
            Buffer: false
        },
    };
    var client_for_test = {
        resolve: {
            cache: false
        },
        devtool: 'inline-source-map',
        module: {
            postLoaders: [
                {
                    test: /\.(js|ts)$/,
                    include: path.join(__dirname, 'client'),
                    loader: 'istanbul-instrumenter-loader',
                    exclude: [
                        /\.e2e\.ts$/,
                        /node_modules/
                    ]
                }
            ],
            noParse: [
                /zone\.js\/dist\/.+/,
                /angular2\/bundles\/.+/
            ]
        },
        stats: { colors: true, reasons: true },
        debug: false,
        // we need this due to problems with es6-shim
        node: {
            global: 'window',
            progress: false,
            crypto: 'empty',
            module: false,
            clearImmediate: false,
            setImmediate: false
        }
    }


    var client_alt = {
        devServer: {
            stats: 'errors-only',
        },
        resolve: {
            extensions: ['', '.ts', '.json', '.js', ".less", ".scss", ".css"]
        },
        module: {
            loaders: [
                // Support for .ts files.
                {
                    test: /\.ts$/,
                    loader: 'ts',
                    query: {
                        'ignoreDiagnostics': [
                            2403, // 2403 -> Subsequent variable declarations
                            2300, // 2300 -> Duplicate identifier
                            2374, // 2374 -> Duplicate number index signature
                            2375, // 2375 -> Duplicate string index signature
                            2502  // 2502 -> Referenced directly or indirectly
                        ]
                    },
                    exclude: [/\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/]
                },

                // copy those assets to output
                { test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/, loader: 'file?name=fonts/[name].[hash].[ext]?' },

                // Support for *.json files.
                { test: /\.json$/, loader: 'json' },


                // all css required files will be merged in js files
                { test: /\.css$/, loader: 'raw!postcss' },


                // all css required in src/app files will be merged in js files
                { test: /\.scss$/, loader: 'raw!postcss!sass' },

                // support for .html as raw text
                // todo: change the loader to something that adds a hash to images
                { test: /\.html$/, loader: 'raw' }
            ],
            postLoaders: [],
            noParse: [/.+zone\.js\/dist\/.+/, /.+angular2\/bundles\/.+/, /angular2-polyfills\.js/]
        },
        postcss: function () {
            return [precss, autoprefixer];
        },
        target: 'web',
        entry: {
            main: [__dirname + '/client/bootstrap.ts']
        },
        output: {
            path: __dirname + '/build/client',
            filename: "[name].js",
            pathinfo: false,
            publicPath: __dirname + '/build/client/',
        },
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                sourceType: 'var',
                get manifest() {
                    return require(path.join(__dirname, "build/client", "vendors-manifest.json"));
                }
            }),
            new CopyWebpackPlugin([{ from: 'client/assets', to: 'assets' }]),
            new webpack.DefinePlugin({/* just in case */ }),
            new webpack.ProvidePlugin({/* just in case */ })
        ],
        node: {
            global: true,
            __dirname: true,
            __filename: true,
            process: true,
            Buffer: false
        },
    }


    return env == 'test' ? client_for_test : client_for_browser;
}

