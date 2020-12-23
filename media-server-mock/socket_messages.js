/**
 * Socket messages send to the client.
 */
const SocketMessage = {
  Subscribe: 'Subscribe',
  IncomingCall: 'IncomingCall',
  CallStarted: 'CallStarted',
  CallEnded: 'CallEnded',
  RoomLocked: 'RoomLocked',
  RoomUnlocked: 'RoomUnlocked',
  IncomingCallTimeout: 'IncomingCallTimeout',
  RoomCreated: 'RoomCreated',
  LiveRoomsInfo: 'LiveRoomsInfo',
  LeaveCall: 'LeaveCall',
  ButtonsBlockState: 'ButtonsBlockState',
  Error: 'Error',
  UserAdded: 'UserAdded'
}

/**
 * Socket message coming from client.
 */
const ClientMessage = {
  InviteUser: 'InviteUser',
  InitCall: 'Call',
  AcceptCall: 'AcceptCall',
  JoinCall: 'JoinCall',
  DeclineCall: 'DeclineCall',
  LeaveCall: 'LeaveCall'
}

module.exports = { SocketMessage, ClientMessage }
