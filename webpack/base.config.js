const autoprefixer = require('autoprefixer-stylus')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const path = require('path')
const rupture = require('rupture')
const combineLoaders = require('webpack-combine-loaders')
const webpack = require('webpack')

const isProd = (process.env.NODE_ENV === 'production')
const babelOptions = {
  presets: ['@babel/preset-env'],
  plugins: [
    '@babel/plugin-syntax-import-meta',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-regenerator'
  ]
}
const typeScriptWithBabelLoader = combineLoaders([
  {
    loader: 'babel-loader',
    query: babelOptions
  },
  {
    loader: 'ts-loader',
    query: {
      transpileOnly: true
    }
  }
])

module.exports = {
  context: path.join(__dirname, '../'),
  mode: isProd ? 'production' : 'development',
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, '../out'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        type: 'javascript/auto',
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.js$/,
        loader: require.resolve('@open-wc/webpack-import-meta-loader')
      },
      {
        test: /\.modernizrrc.js$/,
        use: ['modernizr-loader']
      },
      {
        test: /\.modernizrrc?$/,
        use: ['modernizr-loader', 'json-loader']
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
        loader: 'babel-loader',
        query: babelOptions
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: babelOptions
      },
      { // vuejs-datepicker and @tweenjs/tween.js containes es6 code.
        test: /\.js$/,
        include: /node_modules\/(vuejs-datepicker|@tweenjs\/tween.js)/,
        loader: 'babel-loader',
        query: babelOptions
      },
      {
        test: /\.ts(x?)$/,
        loader: typeScriptWithBabelLoader
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              esModule: true,
              preserveWhitespace: false,
              loaders: {
                ts: typeScriptWithBabelLoader
              }
            }
          }
        ]
      },
      {
        test: /\.pug$/,
        oneOf: [
          {
            resourceQuery: /^\?vue/,
            use: ['pug-plain-loader']
          },
          {
            use: ['raw-loader', 'pug-plain-loader']
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          esModule: false,
          limit: isProd ? 10240 : (3 * 10240),
          prefix: 'img',
          name: 'img/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          esModule: false,
          name: 'fonts/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.mp4$/,
        loader: 'file-loader',
        options: {
          esModule: false,
          name: 'mocks/videos/[name].[ext]'
        }
      },
      {
        test: /\.styl(us)?$/,
        use: [
          'vue-style-loader',
          // isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              esModule: false
            }
          },
          {
            loader: 'stylus-loader',
            options: {
              stylusOptions: {
                default: {
                  use: [rupture(), autoprefixer()],
                  import: ['rupture', 'autoprefixer-stylus', path.resolve(__dirname, '../src/themes/_variables.styl')]
                }
              },
              webpackImporter: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              esModule: false
            }
          }
        ]
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      }
    ]
  },
  resolve: {
    modules: [
      path.join(__dirname, '../src'),
      'node_modules'
    ],
    alias: {
      assets: path.join(__dirname, '../assets'),
      '@': path.resolve(__dirname, '../src'),
      '~themes': path.resolve(__dirname, '../src/themes'),
      '~assets': path.join(__dirname, '../assets'),
      node_modules: path.join(__dirname, '../node_modules'),
      '~node_modules': path.join(__dirname, '../node_modules'),
      modernizr$: path.resolve(__dirname, '../.modernizrrc')
    },
    extensions: ['.ts', '.mjs', '.js']
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      TNS_ENV: false
    }),
    new webpack.LoaderOptionsPlugin({
      test: /.styl$/,
      options: {
        stylusOptions: {
          use: [rupture(), autoprefixer()],
          import: ['rupture', autoprefixer, path.resolve(__dirname, '../src/themes/_variables.styl')]
        }
      }
    })
  ]
}

if (isProd) {
  delete module.exports.recordsOutputPath
  module.exports.optimization = Object.assign((module.exports.optimization || {}), {
    minimizer: [new OptimizeCSSAssetsPlugin({})]
  })
  module.exports.plugins = (module.exports.plugins || []).concat([
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ])
}
