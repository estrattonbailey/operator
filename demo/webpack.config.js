const webpack = require('webpack')
const path = require('path')
const p = process.env.NODE_ENV === 'production'

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: path.join(__dirname, 'app/index.js'),
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'index.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js?$/,
        loader: 'standard-loader',
        exclude: /node_modules/,
        options: {
          parser: 'babel-eslint'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.join(__dirname, 'app'),
        loaders: ['babel-loader']
      },
    ]
  },
  resolve: {
    alias: {}
  },
  plugins: p ? [] : [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    hot: true,
    contentBase: path.join(__dirname, 'public'),
    publicPath: '/',
    compress: true
  }
}
