var path = require('path');
var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
require("babel-polyfill");


module.exports = [
    {
        context: __dirname,

        entry: {
            server: [
                "babel-polyfill",
                "./src/server.js",
                "./src/utils/cacheUtils.js"
            ]
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'server-bundle.js'
        },
        externals: [nodeExternals({ modulesFromFile: true })],
        target: 'node',
        watch: true,
        module: {
            rules: [{
                test: /\.js$/,
                exclude: ['node_modules', 'dist'],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["env"]
                    }
                }
            }]
        },
    },
];