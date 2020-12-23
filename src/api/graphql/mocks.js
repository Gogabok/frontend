const Faker = require('faker/locale/ru')

const MockStore = require('./mock-store')

const contactFactory = () => {
  const firstName = Faker.random.boolean() ? Faker.name.firstName() : ''
  const lastName = Faker.random.boolean() ? Faker.name.lastName() : ''

  const name = (firstName + ' ' + lastName).trim()
  const login = (name !== '')
    ? (Faker.random.boolean() ? Faker.internet.userName() : '')
    : Faker.internet.userName()

  const alias = name || login
  return {
    alias,
    name,
    followers: () => 0,
    num: Faker.random.uuid(),
    isFavourite: Faker.random.boolean(),
    isFollowedByMe: () => false,
    login,
    photo: Faker.internet.avatar(),
    status: () =>
      Faker.random.arrayElement(['online', 'offline', 'away']),
    unreadCount: Faker.random.number(20),
    isBlockedByMe: false,
    isMeBlocked: false,
    lastMessage: Faker.lorem.sentence(),
    sortId: -1
  }
}

const messageAttachmentFactory = () => ({
  src: () => Faker.image.imageUrl(),
  id: Faker.random.uuid,
  name: () => Faker.system.commonFileName(
    Faker.system.commonFileExt(),
    Faker.system.commonFileType()),
  size: () => Faker.random.number(1024) * Math.pow(
    10,
    Faker.random.number(6)
  ),
  type: Faker.system.commonFileExt
})

const messageFactory = (conversationId, senderId, isStatus) => {
  const user = MockStore.auth.user || MockStore.authorizedContact
  const sender = MockStore.contacts.find(({ num }) => num === senderId) || user
  const message = {
    attachment: null,
    deletable: true,
    deleted: false,
    deletedAt: null,
    conversationId,
    id: Faker.random.uuid(),
    isNotification: false,
    isStatus: false,
    mine: sender.num === user.num,
    sender,
    sentAt: Faker.date.recent(Math.random() > 0.8 ? 0.01 : 100).toISOString(),
    status: sender.num === user.num ? 'sent' : 'new',
    text: null,
    transferedFrom: Math.random() < 0.2
      ? Faker.random.arrayElement(MockStore.contacts)
      : null
  }
  if (isStatus) {
    message.transferedFrom = null
    message.deletable = false
    message.isStatus = true
    message.text = Faker.lorem.sentence()
    return message
  }
  if (Math.random() < 0.2) {
    message.attachment = {
      id: Faker.random.uuid(),
      src: Faker.random.arrayElement([
        'https://placeimg.com/1280/720/any',
        'https://placeimg.com/720/1280/any',
        'https://placeimg.com/200/500/any',
        'https://placeimg.com/640/480/any',
        'https://placeimg.com/480/640/any',
        'https://placeimg.com/960/480/any',
        'https://placeimg.com/480/960/any',
        'http://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg'
      ]),
      type: 'photo'
    }
  } else if (Math.random() < 0.3) {
    message.attachment = messageAttachmentFactory()
  } else if (Math.random() < 0.2) {
    message.sender = null
    message.mine = false
    message.deletable = false
    message.isNotification = true
    message.text = Faker.lorem.sentence()
    message.transferedFrom = null
  } else {
    message.text = Faker.lorem.sentence()
  }
  return message
}

const messageListFactory = (min, max) => {
  const messages = []
  const user = MockStore.auth.user || MockStore.authorizedContact
  MockStore.conversations.forEach((conversation) => {
    for (let i = 1; i <= Faker.random.number({ min, max }); i++) {
      const sender = conversation.participants.find(
        ({ num }) => num !== user.num
      )
      messages.push(
        messageFactory(conversation.id, sender.num)
      )
      messages.push(
        messageFactory(conversation.id, false)
      )
    }
  })
  return messages
}

const conversationListFactory = () => {
  const conversations = []

  for (const [, contact] of MockStore.contacts.entries()) {
    const participants = []
    participants.push(contact)
    participants.push(MockStore.auth.user)

    conversations.push({
      id: contact.num,
      unreadCount: contact.unreadCount,
      isFavourite: contact.isFavourite,
      title: contact.alias,
      description: contact.lastMessage,
      status: contact.status,
      photo: contact.photo,
      messages: [],
      hasMoreMessages: true,
      participants,
      sortId: -1,
      photoAttachments: [],
      photoAttachmentsCount: () => {
        return MockStore.messages
          .filter((item) => item.conversationId === contact.num)
          .filter(({ attachment: a }) => (a !== null) && (a.type === 'photo')).length
      }
    })
  }
  return conversations
}

const setAuth = (accessToken, user, generateConversations) => {
  MockStore.auth = accessToken !== undefined && user !== undefined ? { accessToken, expireIn: 1234, user } : {}

  if (!generateConversations || MockStore.auth.user === undefined) {
    MockStore.conversations = []
    MockStore.messages = []
    return
  }

  MockStore.conversations = conversationListFactory()
  MockStore.messages = messageListFactory(110, 250)

  MockStore.conversations.forEach((conversation, index) => {
    const dates = MockStore.messages
      .filter((item) => (item.conversationId === conversation.id) &&
                        !item.deleted)
      .map((item) => item.sentAt)
    MockStore.conversations[index].messagesFrom = (dates.length > 0)
      ? dates.reduce((a, b) => a < b ? a : b)
      : null
  })
}

const fakeUser = {
  name: () => (Faker.random.boolean() ? Faker.name.firstName() : '') +
    ' ' +
    (Faker.random.boolean() ? Faker.name.lastName() : ''),
  followers: () => 0,
  num: () => Faker.random.uuid(),
  slogan: () => (Faker.random.boolean() ? Faker.lorem.sentence(5, 10) : ''),
  isFollowedByMe: () => false,
  login: () => (Faker.random.boolean() ? Faker.internet.userName() : ''),
  photo: () => Faker.image.avatar(),
  status: () =>
    Faker.random.arrayElement(['online', 'offline', 'away']),
  birth: () => (Faker.random.boolean()
    ? Faker.date.past(40, '1999-01-01').toISOString()
    : ''
  ),
  language: () =>
    Faker.random.arrayElement(['', 'english', 'russian', 'spain']),
  maritalStatus: () =>
    Faker.random.arrayElement(['', 'complicated', 'single', 'married']),
  location: () => (Faker.random.boolean() ? Faker.address.country() : ''),
  education: () => Faker.random.arrayElement([
    'University of New York',
    'Binghamton University',
    'Stony Brook University']),
  job: () => (Faker.random.boolean() ? Faker.name.jobTitle() : ''),
  gender: () => Faker.random.arrayElement(['male', 'female'])
}

const photoAmount = Faker.random.number(99)
let isImagesLoaded = false

for (let i = 1; i <= Faker.random.number({ min: 30, max: 60 }); i++) {
  const contact = contactFactory()
  if (i === 5) {
    contact.isBlockedByMe = true
  } else if (i === 6) {
    contact.isMeBlocked = true
  }

  MockStore.contacts.push(contact)
}

setAuth('123', MockStore.authorizedContact)

module.exports = {
  Contact: contactFactory,
  Message: messageFactory,
  MessageList: messageListFactory,
  ConversationList: conversationListFactory,
  SetAuth: setAuth,
  MessageAttachment: messageAttachmentFactory,
  User: () => ({ ...fakeUser }),
  UserPhotos: () => ({
    total: photoAmount + 1
  }),
  Photo: () => ({
    id: () => Faker.random.uuid(),
    sizes: () => ({
      smallHeight: `https://placeimg.com/${Math.floor(Math.random() * (280 - 200) + 200)}/120/any`
    })
  }),
  MutationRoot: () => ({
    changeUserStatus: (_, { status }, context) => {
      if (context.user === undefined) {
        return false
      }
      MockStore.auth.user.status = status
      return true
    },
    changeUserSlogan: (_, { slogan }, context) => {
      if (context.user === undefined) {
        return false
      }
      MockStore.auth.user.slogan = slogan
      return true
    },
    blockContact: (_, { contact }) => {
      const index = MockStore.contacts.findIndex(
        (item) => (item.num === contact.num)
      )
      if (index >= 0) {
        MockStore.contacts[index].isBlockedByMe = true
        return true
      } else {
        return false
      }
    },
    unblockContact: (_, { contact }) => {
      const index = MockStore.contacts.findIndex(
        (item) => (item.num === contact.num)
      )
      if (index >= 0) {
        MockStore.contacts[index].isBlockedByMe = false
        return true
      } else {
        return false
      }
    },
    removeContact: (_, { contact }) => {
      const index = MockStore.conversations.findIndex(
        ({ id }) => (contact.num === id)
      )
      if (index >= 0) {
        MockStore.conversations.splice(index, 1)
        return true
      } else {
        return false
      }
    },
    toggleRememberContact: (_, { contact }) => {
      const index = MockStore.conversations.findIndex(
        ({ id }) => (contact.num === id)
      )
      if (index >= 0) {
        MockStore.conversations[index].isFavourite = !MockStore.conversations[index].isFavourite

        const max = MockStore.conversations.reduce((prev, next) => {
          return { sortId: Math.max(prev.sortId, next.sortId) }
        })

        if (MockStore.conversations[index].isFavourite) {
          MockStore.conversations[index].sortId = max.sortId + 1
        } else {
          MockStore.conversations[index].sortId = -1
        }
        return true
      } else {
        return false
      }
    },
    renameContact: (_, { contact }) => {
      let findedContact = null
      MockStore.contacts.forEach((item, index) => {
        if (item.num === contact.num) {
          MockStore.contacts[index].alias = (contact.alias !== '')
            ? contact.alias
            : (item.name.trim() || item.login)
          findedContact = MockStore.contacts[index]
        }
      })
      const index = MockStore.conversations.findIndex(
        ({ id }) => (contact.num === id)
      )
      if (index !== -1) {
        MockStore.conversations[index].title = contact.alias
      }
      if (findedContact !== null) {
        return true
      }
      return false
    },
    changeConversationsOrder: (_, args) => {
      args.conversations.forEach((inputConversation, inputIndex) => {
        const index = MockStore.conversations.findIndex(
          ({ id }) => (inputConversation.id === id)
        )
        if (index >= 0) {
          MockStore.conversations[index].sortId =
                        args.conversations.length - 1 - inputIndex
        }
      })
      return true
    },
    followUser: (_, { followerUserId, targetUserId, isFollow }) => ({
      num: targetUserId,
      followers: (isFollow ? 1 : 0),
      isFollowedByMe: isFollow
    }),
    updateUserData: (_, { user }) =>
      ((user.login === '123') ? new Error('422:login') : true),
    updateLinkVisits: () => true,
    shareContact: (_, { conversationId, link }, context) => {
      const wrongChars = /[^a-z0-9_.]/i
      const result = {
        alreadyExist: null,
        exceedsMaxLength: null,
        isEmpty: null,
        link: null,
        notValid: null,
        success: null
      }
      if (MockStore.sharedLinksByOthers.find((sl) => link === sl) !== undefined) {
        return { ...result, alreadyExist: true }
      }
      if (MockStore.sharedLinks.find((sl) => link === sl) !== undefined) {
        result.alreadyExist = true
      }
      if (link.includes(`p/${MockStore.auth.user.num}/u/${conversationId}`)) {
        MockStore.sharedLinks.push(link)
        return {
          ...result,
          success: true,
          link: link
        }
      }
      if (link.trim() === '' || link.length === 0) {
        return { ...result, isEmpty: true }
      }
      if (link.length > 256) {
        return { ...result, exceedsMaxLength: true }
      }
      if (wrongChars.test(link)) {
        return { ...result, notValid: true }
      }
      MockStore.sharedLinks.push(link)
      return {
        ...result,
        success: true,
        link: 'http://localhost/go_to/' + link
      }
    },
    supportContact: (_, {
      conversationId,
      amount,
      message,
      translate
    }, context) => {
      const result = {
        emptyDonation: null,
        lessThanAllowed: null,
        outOfFunds: null,
        success: null
      }
      if (amount === 0) {
        result.emptyDonation = true
        return result
      }
      if (amount < 0) {
        result.lessThanAllowed = true
        return result
      }
      if (translate) {
        amount += 3.26
      }
      if (MockStore.auth.user.funds < amount) {
        result.outOfFunds = true
        return result
      }
      MockStore.auth.user.funds -= amount
      return {
        ...result,
        success: true
      }
    }
  }),
  QueryRoot: () => ({
    contacts: (_, { type }) => {
      return (type === 'favourites')
        ? MockStore.contacts
            .filter((contact) => contact.isFavourite)
            .sort((prev, next) => (next.sortId - prev.sortId))
        : MockStore.contacts
    },
    conversations: (_, { offset, limit, type }) => {
      const conversations = MockStore.conversations.filter((conversation) => {
        const participant = conversation.participants.find((contact) => {
          return contact.num !== MockStore.auth.user.num
        })
        return !participant.isBlockedByMe
      })
      if (type === 'all') {
        return {
          conversations: conversations.slice(offset, offset + limit),
          hasMore: ((offset + limit) < conversations.length)
        }
      } else {
        return {
          conversations: conversations
            .filter(c => c.isFavourite)
            .sort((prev, next) => (next.sortId - prev.sortId))
            .slice(offset, offset + limit),
          hasMore: (offset + limit) < conversations
            .filter(c => c.isFavourite)
            .length
        }
      }
    },
    conversationMessages: (_, { conversationId, lastMessageId, count, onlyPhoto, reverseFetch }) => {
      const allowedTime = Date.now() - 60 * 1000
      let iterableCount = count
      let reachLast = !lastMessageId
      let prevDeleted = true
      let hasMore = true
      let notDeletedCount = 0
      let messages = MockStore.messages
        .filter((item) => (item.conversationId === conversationId) &&
          (!onlyPhoto || (item.attachment !== null && item.attachment.type === 'photo'))
        )
        .sort((a, b) => (a.sentAt.localeCompare(b.sentAt)))
      if (reverseFetch) {
        messages = messages.reverse()
      }
      messages = messages
        .filter((item) => {
          if ((prevDeleted && item.deleted) ||
            (item.deletedAt && Date.parse(item.deletedAt) < allowedTime)
          ) {
            return false
          }
          prevDeleted = false
          notDeletedCount++
          return true
        })
      const totalCount = notDeletedCount
      messages = messages
        .reverse()
        .filter((item) => {
          if (iterableCount <= 0) {
            return false
          }
          if (reachLast) {
            iterableCount--
            return true
          }
          notDeletedCount--
          reachLast = item.id === lastMessageId || reachLast
          return false
        })
        .reverse()
      if (!lastMessageId && !onlyPhoto) {
        const conversation = MockStore.conversations
          .find(({ id }) => id === conversationId)
        const sender = conversation
          ? conversation.participants.find(
              ({ num }) => num !== MockStore.auth.user.num
            )
          : {}
        messages.push(messageFactory(conversationId, sender.num, true))
      }
      if (notDeletedCount <= count) {
        hasMore = false
      }
      return {
        messages,
        hasMore,
        totalCount
      }
    },
    originalPath: (_, { id }) => {
      if (id === '23cb8') {
        return '/im'
      }
      return '/profile'
    },
    userPhotos: (_, { userId, offset, limit }) => {
      if (isImagesLoaded) {
        setTimeout(() => {
          isImagesLoaded = false
        }, 5000)
        return { photos: [] }
      }

      if (photoAmount < limit) {
        isImagesLoaded = true
        return { photos: Array(photoAmount).fill({}) }
      }

      if (offset + limit > photoAmount) {
        isImagesLoaded = true
        return { photos: Array(photoAmount - offset).fill({}) }
      }

      return { photos: Array(limit).fill({}) }
    },
    userLastPhoto: () => ({
      sizes: {
        mediumHeight: `https://placeimg.com/${Math.floor(Math.random() * (500 - 370) + 370)}/240/any`
      }
    }),
    photoAmount: () => photoAmount,
    user: (_, { userId }) => ({ num: userId }),
    maritalStatuses: () => ['complicated', 'single', 'married'],
    languages: () => ['english', 'russian', 'spain', 'italian']
  })
}
