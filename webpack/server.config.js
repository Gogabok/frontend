const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const VueSSRPlugin = require('vue-server-renderer/server-plugin')

const base = require('./base.config')
const isProd = (process.env.NODE_ENV === 'production')

module.exports = merge(base, {
  target: 'node',
  entry: './src/entry/server.ts',
  output: {
    libraryTarget: 'commonjs2'
  },
  externals: nodeExternals({}),
  plugins: [
    new VueSSRPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        VUE_ENV: '"server"',
        MEDEA_HOST: process.env.MEDEA_HOST
      }
    }),
    new HtmlWebpackPlugin({
      template: 'src/templates/index.server.html',
      filename: 'index.server.html',
      inject: false,
      minify: isProd
        ? {
            removeComments: false,
            collapseWhitespace: true,
            removeAttributeQuotes: true
          }
        : undefined
    })
  ]
})

if (isProd) {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ])
}
