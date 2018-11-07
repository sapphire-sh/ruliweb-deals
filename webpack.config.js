const path = require('path');

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const config = require('./config');

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
	'entry': path.resolve(__dirname, 'src', 'index.ts'),
	'output': {
		'path': path.resolve(__dirname, 'dist'),
		'filename': 'main.js',
	},
	'module': {
		'rules': [
			{
				'test': /\.tsx?$/,
				'use': [
					'ts-loader',
				],
			},
		],
	},
	'devtool': 'source-map',
	'resolve': {
		'extensions': [
			'.ts',
			'.js',
			'.json',
		],
	},
	'plugins': [
		new webpack.DefinePlugin({
			'__test': false,
			'__config': JSON.stringify(config),
		}),
		new webpack.DefinePlugin({
			'__dev': process.env.NODE_ENV === 'development',
			'__test': process.env.NODE_ENV === 'test',
		}),
		new webpack.ProgressPlugin(),
	],
	'target': 'node',
	'node': {
		'__dirname': true,
	},
	'externals': [
		nodeExternals(),
	],
	'mode': env,
};
