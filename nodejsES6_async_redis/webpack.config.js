var path = require('path');
var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');


module.exports = [
    {
        context: __dirname,
        entry: {
			server_bundle: './src/'
        },
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