const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
const TypedocWebpackPlugin = require('typedoc-webpack-plugin')
const { merge } = require('webpack-merge')

const base = require('./base.config')
const client = require('./client.config')
const outputPath = path.join(__dirname, '../_build/artifacts/rootfs/docs/ts')

module.exports = merge(base, {
  entry: client.entry,
  output: {
    path: outputPath
  },
  plugins: [
    new CleanWebpackPlugin(),
    new TypedocWebpackPlugin({
      mode: 'modules',
      module: 'es6',
      target: 'es6',
      out: './',
      exclude: '**/{node_modules,entry}/**/*.*',
      experimentalDecorators: true,
      excludeExternals: true,
      ignoreCompilerErrors: true,
      moduleResolution: 'node',
      includeDeclarations: false,
      externalPattern: '**/*.d.ts',
      emitDecoratorMetadata: true,
      preserveConstEnums: true,
      stripInternal: true,
      suppressExcessPropertyErrors: true,
      suppressImplicitAnyIndexErrors: true,
      allowSyntheticDefaultImports: true,
      paths: {
        '*': [
          'src/*'
        ]
      }
    }, [
      path.join(__dirname, '../src')
    ])
  ]
})
