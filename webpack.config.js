var webpack = require('webpack');
// var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var config = require('./build.configs.js');
module.exports = {
    context: __dirname + '/src',
    watch: false,
    entry: './index.jsx',
    output: {
        path: __dirname + '/' + config.targetDirectory + '/www/js',
        filename: 'bundle.js',
        publicPath: '/',
        chunkFilename: '[chunkhash].js'
    },
    resolve: {
        root: [
            __dirname + '/node_modules/'
        ],
        extensions: ['', '.js', '.jsx'],
        modulesDirectories: ['node_modules'],
        alias: {}
    },
    module: {
        loaders: [
            // { test: /\.scss$/, loaders: ["style","css","sass?sourceMap"] },
            // { test: /\.css$/, loaders: ["style","css"] },
            { test: /\.jsx$/, exclude: /node_modules/, loader: "babel-loader"}
        ],
        noParse: /\.min\.js/
    },
    externals: {
        // "jquery": "jQuery",
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        // new UglifyJsPlugin(),
        // new webpack.HotModuleReplacementPlugin()
    ]
    };
