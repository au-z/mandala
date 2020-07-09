const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const resolve = (rel) => path.resolve(__dirname, '..', rel)

const load = (test, ...use) => ({test, use, exclude: /node_modules/})

module.exports = (env) => ({
	mode: env.prod ? 'production' : 'development',
	devtool: env.prod ? 'cheap-eval-source-map' : 'source-map',
	entry: resolve('src/main.js'),
	output: {
		path: resolve('build/out'),
		filename: env.prod ? 'app.min.js' : 'app.js',
		library: 'app',
		libraryTarget: 'umd',
		umdNamedDefine: true,
	},
	module: {
		rules: [
			load(/\.(j|t)s?$/, 'babel-loader'),
			load(/\.styl(us)?$/, 'css-loader', 'stylus-loader'),
			{
				...load(/\.css$/, 'css-loader'),
				exclude: /node_modules\/(?!(highlight\.js))/,
			},
		]
	},
	resolve: {
		extensions: ['.ts', '.js', '.json', '.styl', '.css'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'src': resolve('src'),
			'style': resolve('src/style'),
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: resolve('build/template.html'),
			inject: 'head',
		}),
		new CopyWebpackPlugin([
			{from: resolve('static'), to: 'static'},
		]),
	],
	devServer: {
		port: 3414,
		historyApiFallback: true,
	},
})
