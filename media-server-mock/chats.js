const usersData = require('./users_data')

/**
 * Hardcoded chats (will be removed on connection with backed).
 */
const chats = [{
  id: 'uid-verstka',
  participants: [
    'uid-andrey',
    'uid-kirill',
    'uid-alexey',
    'uid-roman'
  ]
}]

/**
 * Creates 1:1 chats for all hardcoded users.
 */
for (let i = 1; i < usersData.length - 1; i++) {
  for (let j = i + 1; j < usersData.length; j++) {
    chats.push({
      id: `chid-${getChatId(usersData[i].id, usersData[j].id)}`,
      participants: [usersData[i].id, usersData[j].id]
    })
  }
}

/**
 * Creates id, based on 2 provided ids.
 *
 * @param id1                           ID of the chat participant.
 * @param id2                           ID of the chat participant.
 */
function getChatId (id1, id2) {
  return (getWeight(id1) + getWeight(id2)).toString().padStart(8, '0')
}

/**
 * Returns the 'hash' for the provided string.
 *
 * @param id                            String to be hashed.
 */
function getWeight (id) {
  return id
    .split('')
    .reduce((sum, letter, index) => sum + letter.charCodeAt(0) + index, 0)
}

module.exports = chats
