const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const babelpolyfill = require("babel-polyfill");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = env => {
    const PROD = env.NODE_ENV; // set env
    return {
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
            filename: PROD ? 'server-bundle.min.js' : 'server-bundle.js'    
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
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                output: {
                    comments: false,
                },
            })
        ]
    }

}