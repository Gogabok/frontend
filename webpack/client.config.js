const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
const BundleAnalyzerPlugin =
    require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { merge } = require('webpack-merge')

const base = require('./base.config')
const isProd = (process.env.NODE_ENV === 'production')

module.exports = merge(base, {
  devtool: (process.env.NODE_ENV === 'production')
    ? undefined
    : 'inline-cheap-source-map',
  entry: [
    './src/entry/client.ts'
  ],
  devServer: {
    stats: 'errors-only',
    contentBase: `${base.output.path}/public`,
    port: 3000,
    proxy: {
      '/api': 'http://localhost:80',
      '/mock-api': 'http://localhost:80',
      '/media-ws': 'http://localhost:80'
    },
    historyApiFallback: true,
    hot: true
  },
  output: {
    path: `${base.output.path}/public`
  },
  optimization: {
    minimize: isProd,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        exclude: /node_modules/
      })
    ],
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          minSize: 30000,
          chunks: 'async',
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          reuseExistingChunk: true
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new VueSSRClientPlugin({
      filename: '../vue-ssr-client-manifest.json'
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        (process.env.IS_DEV_SERVER ? '!' : '') + '**/*',
        '!uploads',
        '!uploads/*'
      ]
    }),
    new webpack.DefinePlugin({
      'process.env': {
        IS_DEV_SERVER: process.env.IS_DEV_SERVER ? true : undefined,
        VUE_ENV: '"client"'
      }
    }),
    new HtmlWebpackPlugin({
      template: 'src/templates/index.html',
      hash: true,
      minify: isProd
        ? {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
          }
        : undefined
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'assets/img/favicon.ico' },
        { from: 'assets/i18n', to: 'i18n' },
        { from: 'node_modules/medea-jason', to: 'node_modules/medea-jason' }
      ]
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
})

if (!isProd && !process.env.IS_DEV_SERVER) {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: '../client.report.html'
    })
  ])
}

if (!process.env.IS_DEV_SERVER) {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.ExtendedAPIPlugin()
  ])
}
