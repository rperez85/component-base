var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: [
		'./src/less/index.less',
		'./src/js/index.js'		
	],
	output: {
		path: path.resolve(__dirname, 'build'),
	 	filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
		         test: /\.js$/,
		         loader: 'babel-loader',
		         query: {
		             presets: ['es2015']
		         }
	     	},
	     	{ 
	        	test: /\.less$/,
	        	loader: ["style-loader", "css-loader","less-loader"],
	      	}
		]
	},
	stats: {
	 colors: true
	},
	devtool: 'source-map'
};