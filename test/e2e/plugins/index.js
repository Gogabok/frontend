const webpack = require('@cypress/webpack-preprocessor')

module.exports = (on, config) => {
  on('file:preprocessor', webpack({
    webpackOptions: require('../../../webpack/base.config.js')
  }))

  /**
   * Need to prevent chrome crash in Gitlab CI.
   *
   * More info: {@link https://github.com/cypress-io/cypress/issues/350#issuecomment-503231128}
   */
  on('before:browser:launch', (browser = {}, launchOptions = { args: [] }) => {
    if (browser.name === 'chrome') {
      launchOptions.args.push('--disable-dev-shm-usage')
      return launchOptions
    }

    return launchOptions
  })
}
