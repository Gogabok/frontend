#!/usr/bin/env node

const express = require('express')
const bodyParser = require('body-parser')
const { ApolloServer } = require('apollo-server-express')
const { makeExecutableSchema, addMocksToSchema } =
    require('graphql-tools')
const cors = require('cors')
const argv = require('yargs').argv
const { createServer } = require('http')
const { execute, subscribe } = require('graphql')
const { buildClientSchema, printSchema } = require('graphql/utilities')
const { SubscriptionServer } = require('subscriptions-transport-ws')
// eslint-disable-next-line no-unused-vars
const { PubSub, withFilter } = require('graphql-subscriptions')
const Faker = require('faker/locale/ru')
const { GraphQLUpload, graphqlUploadExpress } = require('graphql-upload')
const promisesAll = require('promises-all')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const shortid = require('shortid')
require('./media-server-mock/media-server-mock.js')

const apiSpecsPath = './src/api/graphql'
const port = !argv.port ? 8085 : argv.port
const wsPort = !argv.wsPort ? 8086 : argv.wsPort
const graphQLEndpoint = '/'
const wsEndpoint = '/mock-ws'
const minDelay = 200
const maxDelay = 700
const dir = 'uploads'
const uploadDir = path.join(__dirname, `./out/public/${dir}`)
mkdirp.sync(uploadDir)

const storeFile = async ({ stream, filename }) => {
  const id = shortid.generate()
  const absPath = `${uploadDir}/${id}-${filename}`
  const relPath = `/${dir}/${id}-${filename}`
  return new Promise((resolve, reject) =>
    stream
      .on('error', (error) => {
        if (stream.truncated) {
          fs.unlinkSync(absPath)
        }
        reject(error)
      })
      .pipe(fs.createWriteStream(absPath))
      .on('error', (error) => reject(error))
      .on('finish', () => {
        const stats = fs.statSync(absPath)
        const ext = path.extname(absPath).substring(1)
        return resolve({ id, ext, path: relPath, size: stats.size })
      })
  )
}

const uploadFile = async (file) => {
  const { createReadStream, filename, mimetype } = await file
  const stream = createReadStream()
  let attachment = null

  await storeFile({ stream, filename })
    .then(({ id, ext, path, size }) => {
      let type = ext
      if (/^image\//.test(mimetype)) {
        type = 'photo'
      }
      attachment = {
        src: encodeURI(path),
        id,
        name: filename,
        size,
        type,
        error: null
      }
    })
    .catch((err) => {
      attachment = {
        id: null,
        src: null,
        name: filename,
        size: null,
        type: null,
        error: {
          name: err.name,
          message: err.message
        }
      }
    })
  return attachment
}

const typeDefs =
    printSchema(buildClientSchema(require('./graphql.mock.schema.json').data))

const MockStore = require(`${apiSpecsPath}/mock-store`)
const Mocks = require(`${apiSpecsPath}/mocks`)

// `PubSub` is using for subscriptions implementing.
// More: https://github.com/apollographql/graphql-subscriptions
// eslint-disable-next-line no-unused-vars
const pubsub = new PubSub()

const resolvers = {
  Upload: GraphQLUpload,
  MutationRoot: {
    transferConversationMessage: (root, {
      messageId,
      conversationIds
    }, context) => {
      const originalMessage =
        MockStore.messages.find(({ id }) => id === messageId)
      if (originalMessage === undefined) {
        return []
      }
      return conversationIds.map((conversationId) => {
        const message = {
          ...originalMessage,
          conversationId,
          id: Faker.random.uuid(),
          mine: true,
          sender: MockStore.auth.user,
          sentAt: new Date().toISOString(),
          status: 'sent',
          deletable: true,
          deleted: false,
          isStatus: false,
          transferedFrom: originalMessage.transferedFrom ||
            (originalMessage ? originalMessage.sender : false) ||
            MockStore.auth.user
        }
        MockStore.messages.push(message)
        return message
      })
    },
    deleteConversationMessage: (root, { messageId }, context) => {
      const messageIndex =
        MockStore.messages.findIndex(({ id }) => messageId === id)
      if (messageIndex === -1) {
        return null
      }
      const deletedAt = new Date().toISOString()
      MockStore.messages[messageIndex] = {
        ...MockStore.messages[messageIndex],
        deleted: true,
        deletedAt
      }
      setTimeout(() => {
        MockStore.messages = MockStore.messages.filter((message) => {
          return !(messageId === message.id && message.deleted &&
                   message.deletedAt === deletedAt)
        })
      }, 60 * 1000)
      return deletedAt
    },
    restoreConversationMessage: (root, { messageId }, context) => {
      const messageIndex =
        MockStore.messages.findIndex(({ id }) => messageId === id)
      const allowedTime = Date.now() - 60 * 1000
      if ((messageIndex === -1) ||
        (Date.parse(MockStore.messages[messageIndex].deletedAt) < allowedTime)
      ) {
        return false
      }
      MockStore.messages[messageIndex] = {
        ...MockStore.messages[messageIndex],
        deleted: false,
        deletedAt: null
      }
      return true
    },
    deleteAllConversationMessages: (root, {
      conversationId,
      lastMessageId
    }, context) => {
      let reachLast = false
      const deletedAt = new Date().toISOString()
      MockStore.messages = MockStore.messages
        .sort((a, b) => (a.sentAt.localeCompare(b.sentAt)))
        .map((msg) => {
          if (msg.deleted ||
            reachLast ||
            msg.conversationId !== conversationId
          ) {
            return msg
          }
          reachLast = reachLast || msg.id === lastMessageId
          return {
            ...msg,
            deleted: true,
            deletedAt
          }
        })
      return deletedAt
    },
    restoreAllConversationMessages: (root, { conversationId }, context) => {
      const allowedTime = Date.now() - 60 * 1000
      MockStore.messages = MockStore.messages
        .map((msg) => (msg.conversationId === conversationId) &&
          (Date.parse(msg.deletedAt) > allowedTime)
          ? { ...msg, deleted: false, deletedAt: null }
          : msg
        )
      return new Date(allowedTime).toISOString()
    },
    refreshConversationStartDate: (root, { conversationId }, context) => {
      const dates = MockStore.messages
        .filter((item) => (item.conversationId === conversationId) &&
                          !item.deleted)
        .map((item) => item.sentAt)
      const messagesFrom = (dates.length > 0)
        ? dates.reduce((a, b) => a < b ? a : b)
        : null
      const index = MockStore.conversations.findIndex(
        ({ id }) => id === conversationId
      )
      if (index < 0) {
        return
      }
      MockStore.conversations[index].messagesFrom = messagesFrom
      return MockStore.conversations[index]
    },
    sendConversationMessage: async (root, { message, files }, context) => {
      const status = Math.random() > 0.65
        ? 'read'
        : (Math.random() > 0.5 ? 'delivered' : 'sent')
      const messageTemplate = {
        attachment: null,
        deletable: true,
        deleted: false,
        conversationId: message.conversationId,
        isNotification: false,
        isStatus: false,
        mine: true,
        sender: null,
        sentAt: new Date().toISOString(),
        status,
        text: null,
        translate: false,
        transferedFrom: null
      }

      const messageText = {
        ...messageTemplate,
        id: Faker.random.uuid(),
        text: message.text,
        translate: message.translate
      }

      const messages = []
      if (message.text !== '') {
        messages.push(messageText)
      }

      if (Array.isArray(files) && files.length) {
        const { resolve } = await promisesAll.all(
          files.map(async (file) => uploadFile(file))
        )
        resolve.forEach((attachment) => {
          messages.push({
            ...messageTemplate,
            id: Faker.random.uuid(),
            attachment,
            status: attachment.error ? 'fail' : status
          })
        })
      }
      const validMessages = messages.filter(({ status }) => (status !== 'fail'))
      MockStore.messages.push(...validMessages)

      // eslint-disable-next-line max-len
      // pubsub.publish('conversationMessageAdded', {conversationMessageAdded: message});
      return messages
    },
    translateConversationMessages: () => true,
    restorePassword: (_, { login }) => {
      const result = (login !== 'tmp-login')
      const feedbackType = result
        ? (Math.random() > 0.5 ? 'email' : 'phone')
        : null
      const reason = result ? null : 'default'
      return { result, feedbackType, reason }
    },
    signUp: (root, args, context) => {
      Mocks.SetAuth('123', MockStore.emptyUser)

      return {
        accessToken: MockStore.auth.accessToken,
        expireIn: MockStore.auth.expireIn,
        gapopaId: MockStore.auth.user.gapopaId
      }
    },
    setEmail: (_, { email }) => {
      const validateEmail = (email) => {
        // eslint-disable-next-line no-useless-escape
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(email).toLowerCase())
      }
      if (!validateEmail(email)) {
        return {
          reason: 'invalid',
          result: false
        }
      }
      if (email.startsWith('a')) {
        return {
          reason: 'already-used',
          result: false
        }
      }
      if (MockStore.auth.user !== undefined) {
        if (MockStore.auth.user.emails.find((item) => item === email) !== undefined) {
          return {
            reason: 'already-used',
            result: false
          }
        }
        MockStore.auth.user.emails.push(email)
      }
      return {
        reason: null,
        result: true
      }
    },
    removeEmail: (_, { email }) => {
      const index = MockStore.auth.user.emails.findIndex((item) => item === email)
      if (index === -1) {
        return {
          reason: 'not-exist',
          result: false
        }
      }
      MockStore.auth.user.emails.splice(index, 1)
      return {
        reason: null,
        result: true
      }
    },
    setName: (_, { name }) => {
      const validateName = (name) => {
        return /^[\p{L}0-9][\p{L}0-9 ]*$/u.test(String(name))
      }
      if (name.length > 50) {
        return {
          reason: 'exceeds-max-length',
          result: false
        }
      }
      if (!validateName(name)) {
        return {
          reason: 'invalid',
          result: false
        }
      }
      if (MockStore.auth.user !== undefined) {
        MockStore.auth.user.name = name
      }
      return {
        reason: null,
        result: true
      }
    },
    setLogin: (root, { login }, context) => {
      if (!/^[a-z0-9][a-z0-9\-_.]*$/i.test(login) || login.length > 30 || login.length < 3) {
        return {
          reason: null,
          result: false
        }
      }
      if (login.startsWith('1')) {
        return {
          reason: 'already-exist',
          result: false
        }
      }
      if (MockStore.auth.user !== undefined) {
        MockStore.auth.user.login = login
      }
      return {
        reason: null,
        result: true
      }
    },
    setAvatar: async (root, { avatar }, context) => {
      const { createReadStream, filename, mimetype } = await avatar
      if (typeof createReadStream !== 'function') {
        return {
          src: '',
          reason: 'cant-load-file',
          result: false
        }
      }
      const stream = createReadStream()

      if (!/^image\//.test(mimetype)) {
        return {
          src: '',
          reason: 'unexpected-type',
          result: false
        }
      }
      const { path } = await storeFile({ stream, filename })

      const src = encodeURI(path)
      if (MockStore.auth.user !== undefined) {
        MockStore.auth.user.photo = src
      }
      return {
        src,
        reason: null,
        result: true
      }
    },
    setPassword: (root, { password }, context) => {
      if (password.length < 6) {
        return {
          reason: null,
          result: false
        }
      }
      if (MockStore.auth.user !== undefined) {
        MockStore.auth.user.isPasswordSet = true
      }
      return {
        reason: null,
        result: true
      }
    },
    replacePassword: (root, { oldPassword, password }, context) => {
      if (password.length < 6) {
        return {
          reason: null,
          result: false
        }
      }
      if (oldPassword === '1') {
        return {
          reason: 'wrong-password',
          result: false
        }
      }
      return {
        reason: null,
        result: true
      }
    },
    changeDefaultId: (root, { defaultId, defaultIdType }, context) => {
      if (MockStore.auth.user !== undefined) {
        MockStore.auth.user.defaultId = defaultId
        MockStore.auth.user.defaultIdType = defaultIdType
      }

      return {
        reason: null,
        result: true
      }
    }
  },
  QueryRoot: {
    auth: (_, { login, password, accessToken }) => {
      if (accessToken !== undefined) {
        if ((accessToken === '123') && (accessToken !== MockStore.auth.accessToken)) {
          Mocks.SetAuth(accessToken, MockStore.emptyUser)
        }
        return MockStore.auth.accessToken === accessToken
          ? {
              ...MockStore.auth,
              authMessage: 'Auth applied'
            }
          : {
              accessToken: null,
              expireIn: null,
              user: null,
              authMessage: 'Invalid token'
            }
      }

      // Mock
      if (password === '1') {
        return {
          accessToken: null,
          expireIn: null,
          user: null,
          authMessage: 'Invalid token'
        }
      }

      const newUser = ((login === `${MockStore.authorizedContact.gapopaId}`) ||
                       (login === MockStore.authorizedContact.nickname))
        ? MockStore.authorizedContact
        : {
            ...MockStore.authorizedContact,
            gapopaId: login,
            nickname: Faker.internet.userName(),
            name: Faker.name.firstName() + ' ' + Faker.name.lastName(),
            photo: Faker.image.avatar(),
            emails: []
          }
      Mocks.SetAuth('123', newUser, true)
      return {
        ...MockStore.auth,
        authMessage: 'Welcome!!!'
      }
    },
    checkLogin: (_, { login }) => {
      // Mock
      if (login === '2') {
        return {
          result: false,
          reason: 'removed'
        }
      }
      if (login.startsWith('1')) {
        return { result: true }
      }

      const result = (login === `${MockStore.authorizedContact.gapopaId}`) ||
             (login === MockStore.authorizedContact.login)
      // todo: test other contact data too(phone/email if exists)
      return { result }
    },
    logout: (_) => {
      Mocks.SetAuth()
      return true
    }
  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers })
addMocksToSchema({
  mocks: require(`${apiSpecsPath}/mocks.js`),
  preserveResolvers: true,
  schema
})

const server = new ApolloServer({
  context: ({ req }) => {
    if (!MockStore.auth.user) {
      Mocks.SetAuth('123', MockStore.emptyUser)
    }
    return {
      user: ((req.headers['access-token'] === MockStore.auth.accessToken) &&
        (MockStore.auth.expireIn > 0)
      )
        ? MockStore.auth.user
        : undefined
    }
  },
  schema,
  uploads: false
})

const app = express()

app.use((req, res, next) => {
  const delay = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay
  setTimeout(next, delay)
})
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(
  graphqlUploadExpress({
    maxFileSize: 10000000, // 10 MB
    maxFiles: 10
  })
)
server.applyMiddleware({
  app,
  path: graphQLEndpoint,
  cors: true
})

const graphQlServer = app.listen(port, () => {
  // eslint-disable-next-line
    console.info(`GraphQL API server is listening on ${port} port at ${graphQLEndpoint} endpoint.`);
})

const wsServer = createServer(app)

wsServer.listen(wsPort, () => {
  // eslint-disable-next-line
    console.log(`GraphQL API subscriptions server is listening on ${wsPort} at ${wsEndpoint} endpoint.`);
})

SubscriptionServer.create({
  schema,
  execute,
  subscribe
}, {
  server: wsServer,
  path: wsEndpoint
})

const shutdown = () => {
  graphQlServer.close()
  wsServer.close()

  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
