var path = require('path');
var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
require("babel-polyfill");


module.exports = [
    {
        context: __dirname,
        
            entry: ["babel-polyfill", "./src/server.js"],
        output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'server-bundle.js'
        },
        externals: [nodeExternals({modulesFromFile:true})],
        target: 'node',
        module: {
			rules: [{
				test: /\.js$/,
				exclude: ['node_modules', 'dist'],
				use: {
                    loader:'babel-loader',
                    options: {
                        presets: ["env"]
                    }
                }
			}]
		},
    },
];