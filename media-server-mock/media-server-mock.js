const express = require('express')
const mediaSocket = express()
const enableWs = require('express-ws')
const { SocketMessage, ClientMessage } = require('./socket_messages')
const chats = require('./chats')
const { CallEndedReason, Room, rooms } = require('./Room')
const {
  CallParticipantStatus,
  Participant, connections,
  usersRooms,
  sendMessageToClient
} = require('./Participant')

enableWs(mediaSocket)
const controlUrl = process.env.MEDEA_HOST + '/'

/**
 * Saves connection to `connections` on key, associated with client id.
 * Also, adds socket message callbacks.
 */
mediaSocket.ws('/media-ws', function (ws, req) {
  const connectionId = req.query.id

  connections[connectionId] = ws
  const roomsUserAppearsIn = Object.values(rooms).filter(
    room => !!room.participants.find(p => p.id === req.query.id)
  )

  roomsUserAppearsIn.forEach(room => {
    const participant = room.participants.find(p => p.id === req.query.id)
    if (room.isReachingOut &&
        participant.status === CallParticipantStatus.AWAITING
    ) {
      ws.send(JSON.stringify({
        method: SocketMessage.IncomingCall,
        data: {
          from: room.id,
          type: room.callType,
          roomId: room.id
        }
      }))
    }
  })

  /**
   * Sends client information about all ongoing calls it can be related to.
   */
  ws.send(JSON.stringify({
    data: {
      ids: roomsUserAppearsIn
        .filter((roomObject) => roomObject.isLive)
        .map(({ id }) => id)
    },
    method: SocketMessage.LiveRoomsInfo
  }))

  /**
   * Changes user's status to `DISCONNECTED` in all room he is participant of.
   */
  ws.on('close', () => {
    delete connections[connectionId]
    if (usersRooms[connectionId]) {
      for (const roomId of usersRooms[connectionId]) {
        if (!(roomId in rooms)) continue
        leaveCall(roomId, req.query.id)
      }
    }
  })

  /**
   * Listens to client socket messages, calls specific callback on each.
   */
  ws.on('message', (msg) => {
    if (msg === 'ping') {
      ws.send('pong')
      return
    }

    const { method, data } = JSON.parse(msg)

    switch (method) {
      case ClientMessage.InitCall:
        addUsersRoom(connectionId, data.roomId)
        // If someone has already initiated call for this chat this user should
        // not create room again and will receive incoming call.
        if (rooms[data.roomId] && rooms[data.roomId].isBeingCreated) return

        // If `InitCall` request came after someone initiated call for this chat
        // and room is trying to reach out to chat participants, create room
        // action should be prevented and user will receive incoming call.
        if (
          rooms[data.roomId] &&
          rooms[data.roomId].isLive &&
          !rooms[data.roomId].isReachingOut
        ) {
          addUsersRoom(connectionId, data.roomId)
          rooms[data.roomId].join(req.query.id)
          return
        }
        initCall(data.roomId, data.type, req.query.id, connectionId)
        break

      case ClientMessage.AcceptCall:
        addUsersRoom(connectionId, data.roomId)
        acceptCall(data.roomId, req.query.id)
        break

      case ClientMessage.DeclineCall:
        declineCall(data.roomId, req.query.id)
        break

      case ClientMessage.LeaveCall:
        leaveCall(data.roomId, req.query.id)
        removeUsersRoom(connectionId, data.roomId)
        break

      case ClientMessage.InviteUser:
        data.ids.forEach(id => {
          try {
            rooms[data.roomId].addParticipant(id)
          } catch (e) {
            sendMessageToClient(connectionId, JSON.stringify({
              method: SocketMessage.Error,
              data: {
                roomId: data.roomId,
                message: e.message
              }
            }))
          }
        })
        break

      case ClientMessage.JoinCall:
        if (!rooms[data.roomId]) return

        addUsersRoom(connectionId, data.roomId)
        rooms[data.roomId].join(req.query.id)
        break
    }
  })
})

/**
 * Adds room to list of user's active rooms.
 *
 * @param connectionId                  Connection ID of the user.
 * @param roomId                        ID of the room to be added.
 */
function addUsersRoom (connectionId, roomId) {
  if (!(connectionId in usersRooms) ||
      !Array.isArray(usersRooms[connectionId])
  ) {
    usersRooms[connectionId] = [roomId]
  } else {
    usersRooms[connectionId].push(roomId)
  }
}

/**
 * Removes room from list of user's active rooms.
 *
 * @param connectionId                  Connection ID of the user.
 * @param roomId                        ID of the room to be removed.
 */
function removeUsersRoom (connectionId, roomId) {
  if (connectionId in usersRooms &&
      Array.isArray(usersRooms[connectionId])
  ) {
    usersRooms[connectionId] = usersRooms[connectionId].filter(
      id => id !== roomId
    )
  }
}

/**
 * Creates new room, fills it with participants and initiates call.
 *
 * @param roomId                        ID of the room to take action with.
 * @param callType                      Type of call to initiate.
 * @param userId                        ID of the user, that initiated the call.
 * @param connectionId                  ID of the connection of the user.
 */
function initCall (roomId, callType, userId, connectionId) {
  const chat = chats.find(chat => chat.id === roomId)
  if (!chat) {
    connections[connectionId].send(JSON.stringify({
      method: SocketMessage.CallEnded,
      data: {
        roomId: roomId,
        reason: CallEndedReason.FailedToConnect
      }
    }))
    return
  }
  rooms[roomId] = new Room({
    id: roomId,
    participants: (chat ? chat.participants : [userId])
      .map(id => new Participant({
        id,
        connectionId: id,
        status: CallParticipantStatus.DISCONNECTED
      }))
  })

  rooms[roomId].initCall(connectionId, userId, callType)
}

/**
 * Declines the call.
 * If all participants declined the call, ends call.
 *
 * @param roomId                        ID of the room to take action with.
 * @param userId                        ID of the user who declined the call.
 */
function declineCall (roomId, userId) {
  if (!rooms[roomId]) return

  const pp = rooms[roomId].participants.find(p => p.id === userId)
  pp.status = CallParticipantStatus.DISCONNECTED
  if (rooms[roomId].activeParticipants.length === 1) {
    if (++rooms[roomId].declines >= rooms[roomId].participants.length - 1) {
      rooms[roomId].endCall(CallEndedReason.Declined)
      return
    }
  }

  rooms[roomId].notifyActive({
    method: SocketMessage.LeaveCall,
    data: {
      roomId: roomId,
      id: userId
    }
  })
}

/**
 * Accepts the call.
 * If it's first accept - starts the call.
 *
 * @param roomId                        ID of the room to take action with.
 * @param userId                        ID of the user who accepted the call.
 */
function acceptCall (roomId, userId) {
  const room = rooms[roomId]
  const participant = room.participants.find(p => p.id === userId)
  if (!participant) return

  participant.status = CallParticipantStatus.ACTIVE
  participant.activeRoomId = roomId

  if (!room.isLive) {
    room.startCall()
  } else {
    participant.notify({
      data: {
        participants: room.participants.map(p => p.serialize()),
        startTime: room.startTime,
        roomId: roomId
      },
      method: SocketMessage.CallStarted
    })
  }
}

/**
 * Leaves the call.
 *
 * @param roomId                        ID of the room to take action with.
 * @param userId                        ID of the user, that left the call.
 */
function leaveCall (roomId, userId) {
  if (!rooms[roomId]) return
  const user = rooms[roomId].participants.find(user => user.id === userId)
  if (!user) return
  user.status = CallParticipantStatus.DISCONNECTED
  if (rooms[roomId].activeParticipants.length <= 1) {
    rooms[roomId].endCall(CallEndedReason.Ended)
  } else {
    rooms[roomId].notifyActive({
      data: {
        id: userId,
        roomId: roomId
      },
      method: SocketMessage.LeaveCall
    })
  }
}

/**
 * Runs server.
 */
mediaSocket.listen(1100, () => {
  console.log('Media socket server is listening on port 1100')
  console.log('Media socket will send room requests to ', controlUrl)
})
