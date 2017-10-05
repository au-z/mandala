const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin

const libraryName = 'Mandala'
const outputFile = libraryName.toLowerCase() + ((process.env.NODE_ENV === 'production') ? '.min.js' : '.js')

module.exports = {
  context: path.resolve(__dirname),
  entry: path.join(__dirname, 'js/index.js'),
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [], // important
  devServer: {
    contentBase: path.join(__dirname, '/dist'),
    compress: true,
    port: 3414,
    historyApiFallback: true,
    noInfo: true
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins).concat([
    new webpack.DefinePlugin({'process.env': {NODE_ENV: '"production"'}}),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {warnings: false}
    }),
    new webpack.LoaderOptionsPlugin({minimize: true}),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/dist/index.html'),
      inject: 'head',
    }),
  ])
} else {
  module.exports.plugins = (module.exports.plugins).concat([
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/dist/index.html'),
      inject: 'head',
    }),
  ])
}
