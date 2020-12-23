/**
 * Webpack config that is used by nativescript-dev-webpack for building
 * native app for IOS and Android.
 */
const { relative, resolve, sep } = require('path')
const path = require('path')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const combineLoaders = require('webpack-combine-loaders')

const NsVueTemplateCompiler = require('nativescript-vue-template-compiler')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const nsWebpack = require('nativescript-dev-webpack')
const nativescriptTarget = require('nativescript-dev-webpack/nativescript-target')
const { NativeScriptWorkerPlugin } = require('nativescript-worker-loader/NativeScriptWorkerPlugin')

const babelOptions = {
  presets: ['@babel/preset-env'],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-object-rest-spread'
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
      onlyCompileBundledFiles: true,
      transpileOnly: true,
      configFile: 'tsconfig.tns.json'
    }
  }
])

module.exports = env => {
  // Add your custom Activities, Services and other android app components here.
  const appComponents = [
    'tns-core-modules/ui/frame',
    'tns-core-modules/ui/frame/activity'
  ]
  const platform = env && ((env.android && 'android') || (env.ios && 'ios'))
  if (!platform) {
    throw new Error('You need to provide a target platform!')
  }

  const platforms = ['ios', 'android']
  const projectRoot = __dirname

  // Default destination inside platforms/<platform>/...
  const dist = resolve(projectRoot, nsWebpack.getAppPath(platform, projectRoot))
  const appResourcesPlatformDir = platform === 'android' ? 'Android' : 'iOS'

  const {
    // The 'appPath' and 'appResourcesPath' values are fetched from
    // the nsconfig.json configuration file
    // when bundling with `tns run android|ios --bundle`.
    appPath = 'src',
    appResourcesPath = 'src/native/resources',

    // You can provide the following flags when running 'tns run android|ios'
    snapshot, // --env.snapshot
    production, // --env.production
    report, // --env.report
    hmr // --env.hmr
  } = env

  const externals = (env.externals || []).map((e) => { // --env.externals
    return new RegExp(e + '.*')
  })

  const mode = production ? 'production' : 'development'

  const appFullPath = resolve(projectRoot, appPath)
  const appResourcesFullPath = resolve(projectRoot, appResourcesPath)

  const entryModule = nsWebpack.getEntryModule(appFullPath)
  const entryPath = `.${sep}${entryModule}.ts`
  console.log(`Bundling application for entryPath ${entryPath}...`)

  const config = {
    mode: mode,
    context: appFullPath,
    externals: [...externals, 'bufferutil', 'utf-8-validate'],
    watchOptions: {
      ignored: [
        appResourcesFullPath,
        // Don't watch hidden files
        '**/.*'
      ]
    },
    target: nativescriptTarget,
    // target: nativeScriptVueTarget,
    entry: {
      bundle: entryPath
    },
    output: {
      pathinfo: false,
      // path: path.join(__dirname, './out/native'),
      path: dist,
      libraryTarget: 'commonjs2',
      filename: '[name].js',
      globalObject: 'global'
    },
    resolve: {
      aliasFields: ['browser'],
      extensions: ['.vue', '.js', '.ts', '.scss', '.css', '.styl'],
      // Resolve {N} system modules from tns-core-modules.
      modules: [
        resolve(__dirname, 'node_modules/tns-core-modules'),
        resolve(__dirname, 'node_modules'),
        'node_modules/tns-core-modules',
        'node_modules',
        'src'
      ],
      alias: {
        '~': appFullPath,
        '@': appFullPath,
        vue$: 'nativescript-vue',
        vue: 'nativescript-vue',
        assets: path.join(__dirname, 'assets'),
        '~assets': path.join(__dirname, 'assets'),
        node_modules: path.join(__dirname, 'node_modules'),
        '~node_modules': path.join(__dirname, 'node_modules'),
        modernizr$: path.resolve(__dirname, '.modernizrrc'),
        'babel-loader': path.resolve(__dirname, 'node_modules/babel-loader')
      },
      // don't resolve symlinks to symlinked modules.
      symlinks: false
    },
    resolveLoader: {
      // don't resolve symlinks to symlinked loaders.
      symlinks: false
    },
    node: {
      // Disable node shims that conflict with NativeScript.
      http: false,
      timers: false,
      setImmediate: false,
      fs: 'empty',
      console: true,
      __dirname: false,
      net: 'empty',
      tls: 'empty'
    },
    devtool: 'none',
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: (module) => {
              const moduleName = module.nameForCondition ? module.nameForCondition() : ''
              return /[\\/]node_modules[\\/]/.test(moduleName) ||
                     appComponents.some(comp => comp === moduleName)
            },
            enforce: true
          }
        }
      },
      minimize: Boolean(production),
      minimizer: [
        new TerserPlugin({
          parallel: true,
          cache: true,
          terserOptions: {
            output: {
              comments: false
            },
            compress: {
              // The Android SBG has problems parsing the output
              // when these options are enabled.
              collapse_vars: platform !== 'android',
              sequences: platform !== 'android'
            },
            safari10: platform === 'ios',
            keep_fnames: true
          }
        })
      ]
    },
    module: {
      // noParse: [/ws/, /debug/],
      rules: [{
        test: new RegExp(entryPath),
        use: [
          // Require all Android app components.
          platform === 'android' && {
            loader: 'nativescript-dev-webpack/android-app-components-loader',
            options: { modules: appComponents }
          },

          {
            loader: 'nativescript-dev-webpack/bundle-config-loader',
            options: {
              registerPages: true, // applicable only for non-angular apps
              loadCss: !snapshot // load the application css if in debug mode,
              // registerModules: [],
            }
          }
        ].filter(loader => Boolean(loader))
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
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'nativescript-dev-webpack/style-hot-loader',
          'nativescript-dev-webpack/apply-css-loader.js',
          'css-loader'
        ]
      },
      {
        test: /\.styl$/,
        use: [
          'nativescript-dev-webpack/style-hot-loader',
          'nativescript-dev-webpack/apply-css-loader.js',
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.ts$/,
        exclude: /node_modules|vue\/src/,
        loader: typeScriptWithBabelLoader
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: babelOptions
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compiler: NsVueTemplateCompiler,
          esModule: true,
          preserveWhitespace: false,
          loaders: {
            ts: typeScriptWithBabelLoader
          }
        }
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 3 * 10240,
          prefix: 'img',
          name: 'img/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader?name=fonts/[name].[ext]?[hash]'
      },
      {
        test: /\.mp4$/,
        loader: 'file-loader?name=mocks/videos/[name].[ext]'
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      }
      ]
    },
    plugins: [
      // Vue Loader plugin omitted
      // make sure to include the plugin!
      new VueLoaderPlugin(),
      // Define useful constants like TNS_WEBPACK.
      // Use TNS_CONF_API_URL = http://10.0.2.2/mock-api for
      // Android emulator instead localhost.
      new webpack.DefinePlugin({
        TNS_CONF_API_URL: env.TNS_CONF_API_URL
          ? JSON.stringify(env.TNS_CONF_API_URL)
          : JSON.stringify('http://10.0.2.2/mock-api'),
        'global.TNS_WEBPACK': 'true',
        TNS_ENV: JSON.stringify(mode)
      }),
      // Remove all files from the out dir.
      new CleanWebpackPlugin(),
      // Copy native app resources to out dir.
      new CopyWebpackPlugin({
        patterns: [{
          from: `${appResourcesFullPath}/${appResourcesPlatformDir}`,
          to: `${dist}/App_Resources/${appResourcesPlatformDir}`,
          context: projectRoot
        }]
      }),
      // Copy assets to out dir. Add your own globs as needed.
      new CopyWebpackPlugin([
        { from: 'fonts/**' },
        { from: '**/*.+(jpg|png|svg)' },
        { from: path.join(__dirname, 'assets') }
      ], { ignore: [`${relative(appPath, appResourcesFullPath)}/**`] }),
      // Generate a bundle starter script and activate it in package.json.
      new nsWebpack.GenerateBundleStarterPlugin([
        './bundle',
        './vendor'
      ]),
      // For instructions on how to set up workers with webpack
      // check out https://github.com/nativescript/worker-loader
      new NativeScriptWorkerPlugin(),
      new nsWebpack.PlatformFSPlugin({
        platform,
        platforms
      }),
      // Does IPC communication with the {N} CLI to notify events when running in watch mode.
      new nsWebpack.WatchStateLoggerPlugin(),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.modernizrrc$/
      })
    ]
  }

  if (report) {
    // Generate report files for bundles content.
    config.plugins.push(new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      generateStatsFile: true,
      reportFilename: resolve(projectRoot, 'report', 'report.html'),
      statsFilename: resolve(projectRoot, 'report', 'stats.json')
    }))
  }

  if (snapshot) {
    config.plugins.push(new nsWebpack.NativeScriptSnapshotPlugin({
      chunk: 'vendor',
      requireModules: [
        'tns-core-modules/bundle-entry-points'
      ],
      projectRoot,
      webpackConfig: config
    }))
  }

  if (hmr) {
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  return config
}
