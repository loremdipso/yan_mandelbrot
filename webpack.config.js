const path = require("path");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
	entry: "./sketch/sketch.ts",

	target: "web",
	mode: "development",

	output: {
		path: path.resolve(__dirname, "docs"),
		filename: 'bundle.[contenthash].js',

		// it's weird why this is necessary, but w/e
		publicPath: "./"
	},

	devServer: {
		compress: true,
		publicPath: "/",

		stats: {
			warnings: false
		},
		port: 9000,

		// uncomment if you want to listen at your IP as well as localhost
		// host: '0.0.0.0'
	},

	resolve: {
		extensions: [".json", ".ts", ".js", ".css", ".scss"],
		plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],
	},

	plugins: [new HtmlWebpackPlugin({
		template: "sketch/public/index.html",
		inject: "head"
	})],

	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				loader: "ts-loader",
			},
			{
				test: /\.(png|svg|ico|jpe?g|gif)$/i,
				use: [
					'file-loader',
				],
			},
			{
				test: /\.worker\.js$/,
				loader: 'worker-loader',
			},
		],
	},
};
