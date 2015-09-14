var webpack = require('webpack')
  , HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    './run.js'
  ],
  output: {
    path: __dirname + '/public/build',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js?$/, loaders: ['babel'], exclude: /node_modules/ },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin()
  ]
};
