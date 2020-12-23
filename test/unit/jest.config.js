const path = require('path')

module.exports = {
  browser: true,
  collectCoverage: true,
  coverageDirectory: path.join(__dirname, '../../.coverage/unit'),
  coverageReporters: [
    'text-summary',
    'lcov'
  ],
  rootDir: path.join(__dirname, '../../'),
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/components/**/*.vue',
    '!**/ns/**',
    '!**/pages/**',
    // 'src/store/**/*.ts',
    'src/plugins/**/*.ts',
    'src/Router.ts'
  ],
  moduleNameMapper: {
    '^vue$': 'vue/dist/vue.common.js',
    '^~assets/img/.*': path.join(__dirname, '__mocks__/fileMock.js'),
    '^~assets(/i18n/.*)$': path.join(__dirname, '../../assets$1'),
    '.(css|less)$': path.join(__dirname, '__mocks__/styleMock.js')
  },
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'vue'
  ],
  moduleDirectories: [
    'node_modules',
    'src'
  ],
  modulePathIgnorePatterns: [
    path.join(__dirname, '../../.cache/yarn/')
  ],
  modulePaths: [
    '<rootDir>'
  ],
  testURL: 'http://localhost/',
  globals: {
    TNS_ENV: false,
    'ts-jest': {
      diagnostics: false,
      tsConfig: path.join(__dirname, './tsconfig.jest.json'),
      babelConfig: {
        presets: [
          '@babel/preset-env'
        ],
        plugins: [
          '@babel/plugin-syntax-dynamic-import',
          '@babel/plugin-proposal-object-rest-spread'
        ]
      }
    },
    'vue-jest': {
      babelConfig: {
        configFile: path.join(__dirname, '.babelrc')
      }
    }
  },
  testMatch: [
    '**/test/unit/specs/**/*.spec.ts?(x)'
  ],
  testPathIgnorePatterns: [
    path.join(__dirname, '../../node_modules/')
  ],
  transform: {
    '.*\\.(vue)$': 'vue-jest',
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.d\\.ts?$': 'ts-jest',
    '\\.(gql|graphql)$': 'jest-transform-graphql',
    '^.+\\.(js)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(vue-resize-sensor' +
      '|vue-awesome-swiper' +
    ')/)'
  ],
  verbose: true,
  setupFiles: [
    path.join(__dirname, './rangeMock.js'),
    'jest-canvas-mock',
    'jest-plugin-context/setup'
  ]
}
