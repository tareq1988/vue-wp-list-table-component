var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var outputFile = 'vue-wp-list-table'
var globalName = 'ListTable'

var config = require('../package.json')

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      // {
      //   enforce: 'pre',
      //   test: /\.(js|vue)$/,
      //   loader: 'eslint-loader',
      //   exclude: /node_modules/,
      // },
      {
        test: /.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
        options: {
          loaders: {
            css: ExtractTextPlugin.extract('css-loader'),
            less: ExtractTextPlugin.extract('css-loader!less-loader'),
          }
        }
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'VERSION': JSON.stringify(config.version),
    }),
    new ExtractTextPlugin(outputFile + '.css'),
  ],
}
