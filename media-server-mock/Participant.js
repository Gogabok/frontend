/**
 * All established connections, stored by ID as a key.
 */
const connections = {}

/**
 * All connected users, stored by ID as a key and list of rooms IDs they are
 * connected to.
 */
const usersRooms = {}

/**
 * Checks if there is connection with provided it. If it exists, sends message
 * to the client.
 *
 * @param connectionId                  ID of the connection to send message to.
 * @param message                       Message to be sent.
 *
 * @returns                             `true` message has been sent and `false`
 *                                      otherwise.
 */
function sendMessageToClient (connectionId, message) {
  if (connections[connectionId]) {
    connections[connectionId].send(message)
    return true
  } else {
    return false
  }
}

/**
 * All possible call participant statuses.
 */
const CallParticipantStatus = {
  DISCONNECTED: 0,
  AWAITING: 1,
  LOADING: 2,
  ACTIVE: 3
}

/**
 * Call participant.
 */
class Participant {
  /**
   * Creates new instance of Participant.
   *
   * @param id                          ID of the participant.
   * @param connectionId                ID of the connection related to this
   *                                    user.
   * @param status                      Call participant status.
   */
  constructor ({ id, connectionId, status } = {}) {
    this.id = id
    this.connectionId = connectionId
    this._status = status
    this.activeRoomId = ''
  }

  /**
   * Returns status of the participant.
   */
  get status () {
    return this._status
  }

  /**
   * Sets new participant status.
   * @param status
   */
  set status (status) {
    this._status = status
  }

  /**
   * Returns JSON, that provides information, needed to client.
   */
  serialize () {
    return {
      id: this.id,
      status: this._status
    }
  }

  /**
   * Sends socket message to this user.
   *
   * @param data                        Message to be sent.
   */
  notify (data) {
    if (typeof data !== 'string') {
      data = JSON.stringify(data)
    }
    sendMessageToClient(this.connectionId, data)
  }
}

module.exports = {
  Participant,
  CallParticipantStatus,
  connections,
  sendMessageToClient,
  usersRooms
}
