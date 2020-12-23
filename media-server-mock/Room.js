const fetch = require('node-fetch')
const {
  CallParticipantStatus,
  sendMessageToClient,
  Participant
} = require('./Participant')
const { SocketMessage } = require('./socket_messages')

const controlUrl = process.env.MEDEA_HOST + '/'

/**
 * Reason why call has been ended.
 */
const CallEndedReason = {
  Busy: 0,
  Ended: 1,
  Declined: 2,
  FailedToConnect: 3,
  NoResponse: 4
}

/**
 * Active room information.
 */
const rooms = {}

/**
 * Default pipeline for public endpoint of the user.
 */
const publicPipelineEndpoint = {
  publish: {
    audio_settings: {
      publish_policy: 'Optional'
    },
    force_relay: false,
    kind: 'WebRtcPublishEndpoint',
    p2p: 'Always',
    video_settings: {
      publish_policy: 'Optional'
    }
  }
}

/**
 * Room states (they can be combined with each other).
 */
const RoomState = {
  /**
   * Room is inactive.
   */
  Inactive: 1,

  /**
   * Room is active and serves live call.
   */
  Active: 2,

  /**
   * Room is trying to reach out all participants, which are not `Active` and
   * did not decline call.
   */
  ReachingOut: 3,

  /**
   * Call has been ended, but room is not fully erased yet.
   */
  BeingDropped: 4,

  /**
   * Call has been initiated but room hasn't been created on media server yet.
   */
  BeingCreated: 5
}

/**
 * Call type.
 */
const CallType = {
  Audio: 'audio',
  Video: 'video'

}

/**
 * Call room class, that provides main call logic.
 */
class Room {
  /**
   * Creates new instance of Room.
   *
   * @param id                          ID of the room.
   * @param participants                List of room participants (same as chat
   *                                    participants)
   */
  constructor ({
    id,
    participants
  } = {}) {
    this.id = id
    this.participants = participants
    this.startTime = 0
    this.awaitTimer = NaN
    this.declines = 0
    this.callType = CallType.Audio
    this.state = Math.pow(2, RoomState.Inactive)
    this.incomingCallTimeout = 30000
  }

  /**
   * Adds specific state to room state.
   *
   * @param state                       State to be added to room state.
   */
  addState (state) {
    this.state = (this.state + Math.pow(2, state))
  }

  /**
   * Removes specific state from room state.
   *
   * @param state                       State to be removed from room state.
   */
  removeState (state) {
    this.state = (this.state - Math.pow(2, state))
  }

  /**
   * Indicator whether room is serving live call.
   */
  get isLive () {
    return Boolean(Math.pow(2, RoomState.Active) & this.state)
  }

  /**
   * Indicator whether room should be calling to all disconnected participants
   * that are not `Active` and did not decline call yet.
   */
  get isReachingOut () {
    return Boolean(Math.pow(2, RoomState.ReachingOut) & this.state)
  }

  /**
   * Indicator whether room is currently being deleted on media server.
   */
  get isBeingDropped () {
    return Boolean(Math.pow(2, RoomState.BeingDropped) & this.state)
  }

  /**
   * Indicator whether room is current being created on media server.
   */
  get isBeingCreated () {
    return Boolean(Math.pow(2, RoomState.BeingCreated) & this.state)
  }

  /**
   * Creates new room on media server.
   */
  create () {
    return new Promise((resolve, reject) => {
      fetch(`${controlUrl}${this.id}`)
        .then(res => {
          if (res.status >= 400) {
            throw { response: res } // eslint-disable-line
          } else if (res.status < 300 && res.status >= 200) {
            resolve()
          }
        })
        .catch(e => {
          if (e.response.status === 400) {
            const pipeline = this.generateEndpoints()

            const body = {
              kind: 'Room',
              pipeline
            }

            fetch(`${controlUrl}${this.id}`, {
              body: JSON.stringify(body),
              headers: {
                'Content-Type': 'application/json'
              },
              method: 'POST'
            })
              .then(res => {
                res.ok
                  ? resolve()
                  : reject(new Error('Could not create the room'))
              })
              .catch(e => {
                reject(e)
              })
          } else {
            reject(new Error('Error on getting room request'))
          }
        })
    })
  }

  /**
   * Generates pipeline of the room, creating endpoints for each participant.
   */
  generateEndpoints () {
    return this.participants.reduce((body, user) => {
      const interlocutorsEndpoints = {
        ...this.participants // eslint-disable-line
          .filter(p => p.id !== user.id)
          .reduce((res, p) => ({
            ...res,
            ['play-' + p.id]: {
              kind: 'WebRtcPlayEndpoint',
              force_relay: false,
              src: `local://${this.id}/${p.id}/publish`
            }
          }), {})
      }

      return {
        ...body,
        [user.id]: {
          credentials: 'test',
          kind: 'Member',
          // on_join: 'grpc://127.0.0.1:9099',
          // on_leave: 'grpc://127.0.0.1:9099',
          pipeline: {
            ...publicPipelineEndpoint,
            ...interlocutorsEndpoints
          }
        }
      }
    }, {})
  }

  /**
   * List of active call participants.
   */
  get activeParticipants () {
    return this.participants.filter(p => p.status === CallParticipantStatus.ACTIVE)
  }

  /**
   * Creates new room member.
   *
   * @param memberId                    ID of the user to be added.
   */
  createRoomMember (memberId) {
    return new Promise((resolve, reject) => {
      fetch(`${controlUrl}${this.id}/${memberId}`)
        .then(async res => {
          if (res.status === 400) {
            createRoomMember.bind(this)(memberId).then(resolve).catch(reject)
          }
        })
        .catch(e => {
          reject(e)
        })
    })

    /**
     * Creates member on media server.
     */
    function createRoomMember (memberId) {
      return new Promise((resolve, reject) => {
        fetch(`${controlUrl}${this.id}`)
          .then(res => res.json())
          .then(async (controlRoom) => {
            const anotherMembers = Object.values(controlRoom.element.pipeline)
            const pipeline = { ...publicPipelineEndpoint }
            const memberIds = []

            for (const anotherMember of anotherMembers) {
              const memberId = anotherMember.id
              memberIds.push(memberId)
              if (anotherMember.pipeline.hasOwnProperty('publish')) { //eslint-disable-line
                pipeline[`play-${memberId}`] = {
                  force_relay: false,
                  kind: 'WebRtcPlayEndpoint',
                  src: `local://${this.id}/${memberId}/publish`
                }
              }
            }

            const resp = await fetch(`${controlUrl}${this.id}/${memberId}`, {
              body: JSON.stringify({
                credentials: 'test',
                kind: 'Member',
                on_join: 'grpc://127.0.0.1:9099',
                on_leave: 'grpc://127.0.0.1:9099',
                pipeline
              }),
              headers: {
                'Content-Type': 'application/json'
              },
              method: 'POST'
            }).then(res => res.json())

            try {
              for (const id of memberIds) {
                await fetch(`${controlUrl}${this.id}/${id}/play-${memberId}`, {
                  body: JSON.stringify({
                    force_relay: false,
                    kind: 'WebRtcPlayEndpoint',
                    src: `local://${this.id}/${memberId}/publish`
                  }),
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  method: 'POST'
                }).then(res => res.json())
                resolve()
              }
            } catch (e) {
              reject(e)
            }

            return resp.sids[memberId]
          })
      })
    }
  }

  /**
   * Sends socket message to active call participants.
   *
   * @param message                     Message to be sent.
   */
  notifyActive (message) {
    this.activeParticipants.forEach(p => p.notify(message))
  }

  /**
   * Send socket message to all room (chat) participant.
   *
   * @param message                     Message to be sent.
   */
  notify (message) {
    this.participants.forEach(p => p.notify(message))
  }

  /**
   * Sends socket message to all call participants, excepting user
   * with id = `byId`.
   *
   * @param byId                        ID of the user, who initiated broadcast.
   * @param message                     Message to be sent.
   */
  broadcast (byId, message) {
    this.participants.forEach(p => {
      if (p.id !== byId) {
        p.notify(message)
      }
    })
  }

  /**
   * Sets timeout for `incomingCallTimeout`ms that will end call if nobody
   * accepted the call. Otherwise, it will set all non-active user's status to
   * 'disconnected'.
   */
  initAwaitTimer () {
    this.awaitTimer = setTimeout(() => {
      this.removeState(RoomState.ReachingOut)
      if (this.activeParticipants.length === 1) {
        this.notify({
          method: SocketMessage.CallEnded,
          data: {
            roomId: this.id,
            reason: CallEndedReason.NoResponse
          }
        })
      } else {
        const disconnectedUsers = this.participants.filter(
          user => user.status === CallParticipantStatus.AWAITING
        )

        disconnectedUsers.forEach(user => {
          user.status = CallParticipantStatus.DISCONNECTED
          this.notifyActive({
            data: {
              roomId: this.id,
              id: user.id
            },
            method: SocketMessage.LeaveCall
          })

          user.notify({
            data: {
              roomId: this.id
            },
            method: SocketMessage.IncomingCallTimeout
          })
        })
      }
    }, this.incomingCallTimeout)
  }

  /**
   * Creates room on the media server, notifies caller, that room has been
   * created and others about incoming call.
   *
   * @param connectionId                Connection ID of the caller.
   * @param id                          ID of the user.
   * @param type                        Call type.
   */
  initCall (connectionId, id, type) {
    this.addState(RoomState.BeingCreated)
    this.create(id)
      .then(() => {
        this.participants.forEach(user => {
          user.status = id !== user.id
            ? CallParticipantStatus.AWAITING
            : CallParticipantStatus.ACTIVE
        })

        this.callType = type
        this.addState(RoomState.ReachingOut)
        this.broadcast(id, {
          method: SocketMessage.IncomingCall,
          data: {
            from: this.id,
            type,
            roomId: this.id
          }
        })

        const user = this.participants.find(user => user.id === id)

        if (!user) {
          const ok = sendMessageToClient(
            connectionId,
            JSON.stringify({
              data: {
                roomId: this.id,
                participants: this.participants.map(p => p.serialize())
              },
              method: SocketMessage.RoomCreated
            })
          )

          if (!ok) this.endCall(CallEndedReason.FailedToConnect)
        } else {
          user.notify({
            data: {
              roomId: this.id,
              participants: this.participants.map(p => p.serialize())
            },
            method: SocketMessage.RoomCreated
          })
        }

        this.initAwaitTimer()
      })
      .catch((error) => {
        sendMessageToClient(
          connectionId,
          JSON.stringify({
            method: 'Error',
            data: {
              message: 'Error on creating room',
              error
            }
          })
        )
      })
      .finally(() => this.removeState(RoomState.BeingCreated))
  }

  /**
   * Creates user on the room instance.
   *
   * @param participantId               ID of the participant to be added.
   *
   * @returns `true` if user was created and notified about call successfully,
   * `false` otherwise.
   */
  addParticipant (participantId) {
    this.createRoomMember(this.id, participantId)
      .then(() => {
        const participant = new Participant({
          id: participantId,
          connectionId: participantId,
          status: CallParticipantStatus.AWAITING
        })
        this.participants.push(participant)
        const isOk = sendMessageToClient(participant.connectionId, JSON.stringify({
          method: SocketMessage.IncomingCall,
          data: {
            from: this.id,
            type: 'audio',
            roomId: this.id
          }
        }))
        if (!isOk) {
          participant.status = CallParticipantStatus.DISCONNECTED
          throw new Error('User if offline')
        }

        this.notifyActive({
          method: SocketMessage.UserAdded,
          data: {
            userId: participantId,
            status: participant.status,
            roomId: this.id
          }
        })
      })
      .catch(e => {
        throw new Error('Could not create user')
      })
  }

  /**
   * Destroys room on media server, removes it from `rooms` object and notifies
   * all users, that call ended.
   */
  endCall (reason) {
    this.notify({
      data: {
        roomId: this.id,
        reason
      },
      method: SocketMessage.CallEnded
    })
    this.declines = 0
    this.removeState(RoomState.Active)
    this.addState(RoomState.Inactive)
    if (this.awaitTimer) clearTimeout(this.awaitTimer)
    this.activeParticipants.forEach(p => {
      if (p.activeRoomId === this.id) p.id = ''
    })
    this.destroy().finally(() => delete rooms[this.id])
  }

  /**
   * Sets room live state to `true`, set call start timestamp and notifies all
   * room (chat) participants, that this room now has ongoing call.
   */
  startCall () {
    this.removeState(RoomState.Inactive)
    this.addState(RoomState.Active)
    this.startTime = new Date().getTime()
    this.declines = 0

    this.notify({
      data: {
        participants: this.participants.map(p => p.serialize()),
        startTime: this.startTime,
        roomId: this.id
      },
      method: SocketMessage.CallStarted
    })
  }

  /**
   * Join ongoing call of this room.
   *
   * @param id                          ID of the user that wants to join the
   *                                    room.
   */
  join (id) {
    const user = this.participants.find(p => p.id === id)
    if (user) {
      user.status = CallParticipantStatus.ACTIVE
    } else {
      const user = new Participant({ id, status: CallParticipantStatus.ACTIVE })
      this.participants.push(user)
    }

    user.activeRoomId = this.id

    user.notify({
      data: {
        participants: this.participants.map(user => user.serialize()),
        startTime: this.startTime,
        roomId: this.id
      },
      method: SocketMessage.CallStarted
    })
  }

  /**
   * Removes room instance on media server.
   */
  destroy () {
    return new Promise((resolve, reject) => {
      this.addState(RoomState.BeingDropped)
      this.notify({
        method: SocketMessage.ButtonsBlockState,
        data: {
          roomId: this.id,
          areBlocked: true
        }
      })

      fetch(`${controlUrl}${this.id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(res => {
          resolve(JSON.stringify(res.data, null, 4))
        })
        .catch(e => reject(e))
        .finally(() => {
          this.removeState(RoomState.BeingDropped)
          this.notify({
            method: SocketMessage.ButtonsBlockState,
            data: {
              roomId: this.id,
              areBlocked: false
            }
          })
        })
    })
  }
}

module.exports = {
  CallEndedReason,
  Room,
  rooms,
  CallType
}
