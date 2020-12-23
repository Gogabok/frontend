import { CallType } from 'models/Call';
import { CallParticipantStatus } from 'models/CallParticipant';

/**
 * Socket messages, coming from server.
 */
export enum CallSocketEvent {
    IncomingCall = 'IncomingCall',
    CallStarted = 'CallStarted',
    CallEnded = 'CallEnded',
    IncomingCallTimeout = 'IncomingCallTimeout',
    RoomCreated = 'RoomCreated',
    LiveRoomsInfo = 'LiveRoomsInfo',
    LeaveCall = 'LeaveCall',
    ButtonBlock = 'ButtonsBlockState',
    Error = 'Error',
    UserAdded = 'UserAdded',
}

/**
 * Socket messages, which can be sent to server.
 */
export enum UserEventType {
    InviteUser = 'InviteUser',
    Call = 'Call',
    DeclineCall = 'DeclineCall',
    AcceptCall = 'AcceptCall',
    JoinCall = 'JoinCall',
    LeaveCall = 'LeaveCall',
}

/**
 * Reasons why call might have been ended.
 */
export enum CallEndedReason {
    Busy,
    Ended,
    Declined,
    FailedToConnect,
    NoResponse,
}

/**
 * Structure of the socket message.
 */
export interface NotificationSocketData {
    data: { roomId: string } & Record<string, any>; //eslint-disable-line
    method: UserEventType | CallSocketEvent;
}

/**
 * Data, passed on incoming call.
 */
export interface OnIncomingCallData {
    from: string;
    type: CallType;
}

/**
 * Data, passed on call started.
 */
export interface OnCallStartedData {
    participants: Array<{id: string, status: CallParticipantStatus}>;
    startTime: number;
    roomId: string;
}

/**
 * Data, passed on user left.
 */
export interface OnUserLeftData {
    id: string;
    roomId: string;
}

/**
 * Data, passed on live rooms info.
 */
export interface OnLiveRoomsData {
    ids: string[];
    roomId: string;
}

/**
 * Data passed on call ended.
 */
export interface OnCallEndedData {
    roomId: string;
    reason: CallEndedReason;
}

/**
 * Data, passed on room created.
 */
export interface OnRoomCreatedData {
    participants: Array<{
        id: string,
        status: CallParticipantStatus,
    }>;
    roomId: string;
}

export interface OnButtonsBlockData {
    roomId: string;
    areBlocked: boolean;
}

export interface OnErrorData {
    roomId: string;
    message: string;
}

export interface OnUserAddedData {
    userId: string;
    roomId: string;
}
