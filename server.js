#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const express = require('express')
const acceptLanguageParser = require('accept-language-parser')
const resolve = (file) => path.resolve(__dirname, file)

const renderer = require('vue-server-renderer')
  .createBundleRenderer(require('./vue-ssr-server-bundle.json'), {
    runInNewContext: false,
    template: fs.readFileSync(
      resolve('./index.server.html'), 'utf-8'
    ),
    clientManifest: require('./vue-ssr-client-manifest.json'),
    shouldPrefetch: () => false,
    shouldPreload: () => false
  })

const app = express()

app.use(express.static('./public', {
  index: false
}))

app.get('*', (req, res) => {
  const acceptLanguages = []
  for (const lang of acceptLanguageParser.parse(
    req.headers['accept-language'])
  ) {
    acceptLanguages.push(lang.code)
  }

  res.setHeader('Content-Type', 'text/html')

  const context = { url: req.url, accept_languages: acceptLanguages }

  renderer.renderToString(context, (error, html) => {
    if (error) {
      console.log(error)
      switch (error.code) {
        case 404:
          res.status(404).end('404 | Page Not Found')
          break
        case 500:
          res.status(500).end('500 | Internal Server Error')
          break
        default:
          res.end('Unknown server error')
      }
      console.error(`Error during render "${req.url}": ${error.message}`)
      return
    }

    const { title: _title, meta: _meta } = context.meta.inject()
    const title = _title ? _title.text() : ''
    const meta = _meta ? _meta.text() : ''
    html = html.replace('#{metaInfo}', title + meta)

    res.end(html)
  })
})

const server = app.listen(8080)

const shutdown = () => {
  server.close()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
