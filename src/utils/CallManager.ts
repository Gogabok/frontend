import { CallType } from 'models/Call';
import {
    CallEndedReason,
    CallSocketEvent,
    NotificationSocketData,
    OnButtonsBlockData,
    OnCallEndedData,
    OnCallStartedData,
    OnErrorData,
    OnIncomingCallData,
    OnLiveRoomsData,
    OnRoomCreatedData,
    OnUserAddedData,
    OnUserLeftData,
    UserEventType,
} from 'models/CallManagerTypes';

import ReconnectingWebsocket from 'utils/ReconnectingWebsocket.ts';


interface ICallManager {
    on_incoming_call:
        (callback: (data: OnIncomingCallData) => void) => void;

    on_incoming_call_timeout: (callback: () => void) => void;

    on_live_rooms_info:
        (callback: (data: OnLiveRoomsData) => void) => void;

    on_buttons_block:
        (callback: (data: OnButtonsBlockData) => void) => void;

    on_room_created:
        (callback: (data: OnRoomCreatedData) => void) => void;

    on_call_started:
        (callback: (data: OnCallStartedData) => void) => void;

    on_call_ended:
        (callback: (data: OnCallEndedData) => void) => void;

    on_user_added:
        (callback: (data: OnUserAddedData) => void) => void;

    on_user_left:
        (callback: (data: OnUserLeftData) => void) => void;

    on_error:
        (callback: (data: OnErrorData) => void) => void;

    on_connection_dropped: (callback: () => void) => void;

    on_connection_restored: (callback: () => void) => void;

    on_connection_lost: (callback: () => void) => void;
}

/**
 * Call manager that connects client and server.
 */
export class CallManager implements ICallManager {
    /**
     * Current app user id.
     */
    private readonly userId: string;

    /**
     * ID of the currently active room.
     */
    private activeRoomId: string = '';

    /**
     * WebSocket connected to backend.
     */
    private systemSocket: ReconnectingWebsocket;

    /**
     * Callback, called on incoming call.
     */
    private _on_incoming_call: (payload: OnIncomingCallData) => void;

    /**
     * Callback, called on call started.
     */
    private _on_call_started: (payload: OnCallStartedData) => void;

    /**
     * Callback, called on call ended.
     */
    private _on_call_ended: (payload: OnCallEndedData) => void;

    /**
     * Callback, called on user leave.
     */
    private _on_user_left: (payload: OnUserLeftData) => void;

    /**
     * Callback, called on incoming call timeout.
     */
    private _on_incoming_call_timeout: () => void;

    /**
     * Callback, called on room created.
     */
    private _on_room_created: (payload: OnRoomCreatedData) => void;

    /**
     * Callback, called on live room information.
     */
    private _on_live_rooms_info: (payload: OnLiveRoomsData) => void;

    /**
     * Callback, called on buttons block by server.
     */
    private _on_buttons_block: (payload: OnButtonsBlockData) => void;

    /**
     * Callback, called on error message from the server.
     */
    private _on_error: (payload: OnErrorData) => void;

    /**
     * Callback, called when new user added to the call.
     */
    private _on_user_added: (payload: OnUserAddedData) => void;

    /**
     * Callback, called when connection to the server was lost, call manager
     * couldn't reconnect to the server and dropped the connection.
     */
    private _on_connection_dropped: () => void;

    /**
     * Callback, called when connection to the server was lost and call manager
     * successfully reconnected to the server.
     */
    private _on_connection_restored: () => void;

    /**
     * Callback, called when connection to the server was lost.
     */
    private _on_connection_lost: () => void;

    /**
     * Creates new call manager instance.
     *
     * @param id                        ID of the current app user.
     */
    constructor(id: string) {
        this.socketServerMessageHandler =
            this.socketServerMessageHandler.bind(this);
        this.send = this.send.bind(this);

        this.userId = id;

        const protocol = location.protocol.includes('s')
            ? 'wss'
            : 'ws';

        const url =
            `${protocol}://${document.location.hostname}/media-ws?id=${this.userId}`;
        this.systemSocket = new ReconnectingWebsocket(url, {
            // backoffIncFunction: (counter: number) =>
            //     0.5 + (counter + 1.5) * Math.pow(2, - 2 * counter),
            initialBackoff: 3000,
            // maxBackoff: 150_000,
            name: 'CallSocket',
        });

        this.systemSocket.onmessage = this.socketServerMessageHandler;
        this.systemSocket.onreconnect = () => {
            if(this._on_connection_restored) this._on_connection_restored();
        };
        this.systemSocket.ondrop = () => {
            if(this._on_connection_dropped) this._on_connection_dropped();
            this._on_call_ended({
                reason: CallEndedReason.FailedToConnect,
                roomId: this.activeRoomId,
            });
        };
        this.systemSocket.onopen = () => {
            this.systemSocket.onclose = () => {
                if(this._on_connection_lost) this._on_connection_lost();
            };
        };
    }

    /**
     * Sens websocket message to server.
     *
     * @param data                      Data to be sent to the server.
     */
    private send(data: NotificationSocketData): void {
        this.systemSocket.send(JSON.stringify(data));
    }

    /**
     * Server message handler. Calls specific action on each message coming
     * from the server.
     *
     * @param event                     Websocket event.
     */
    private socketServerMessageHandler(event): void {
        if(event.data === 'pong') return;
        const{
            data,
            method,
        }: NotificationSocketData = JSON.parse(event.data);

        switch(method) {
            case CallSocketEvent.IncomingCall:
                this._on_incoming_call({
                    from: data.roomId,
                    type: data.type,
                });
                break;
            case CallSocketEvent.LiveRoomsInfo:
                this._on_live_rooms_info({
                    ids: data.ids,
                    roomId: data.roomId,
                });
                break;
            case CallSocketEvent.CallStarted:
                this._on_call_started({
                    participants: data.participants,
                    roomId: data.roomId,
                    startTime: data.startTime,
                });
                break;
            case CallSocketEvent.CallEnded:
                if (this.activeRoomId === data.roomId) {
                    this.activeRoomId = '';
                }
                this._on_call_ended({
                    reason: data.reason,
                    roomId: data.roomId,
                });
                break;
            case CallSocketEvent.LeaveCall:
                this._on_user_left({
                    id: data.id,
                    roomId: data.roomId,
                });
                break;
            case CallSocketEvent.IncomingCallTimeout:
                this._on_incoming_call_timeout();
                break;
            case CallSocketEvent.RoomCreated:
                this._on_room_created({
                    participants: data.participants,
                    roomId: data.roomId,
                });
                break;
            case CallSocketEvent.ButtonBlock:
                this._on_buttons_block({
                    areBlocked: data.areBlocked,
                    roomId: data.roomId,
                });
                break;
            case CallSocketEvent.Error:
                this._on_error({
                    message: data.message,
                    roomId: data.roomId,
                });
                break;
            case CallSocketEvent.UserAdded:
                this._on_user_added({
                    roomId: data.roomId,
                    userId: data.userId,
                });
        }
    }

    /**
     * Sets callback, called on incoming call.
     *
     * @param callback                  Function to be called on incoming call.
     */
    public on_incoming_call(
        callback: (payload: OnIncomingCallData) => void,
    ): void {
        this._on_incoming_call = callback;
    }

    /**
     * Sets callback, called on incoming call timeout.
     *
     * @param callback                  Function to be called on incoming call
     *                                  timeout.
     */
    public on_incoming_call_timeout(
        callback: () => void,
    ): void {
        this._on_incoming_call_timeout = callback;
    }

    /**
     * Sets callback, called on call started.
     *
     * @param callback                  Function to be called on call started.
     */
    public on_call_started(
        callback: (payload: OnCallStartedData) => void,
    ): void {
        this._on_call_started = callback;
    }

    /**
     * Sets callback, called on call ended.
     *
     * @param callback                  Function to be called on call ended.
     */
    public on_call_ended(callback: (data: OnCallEndedData) => void): void {
        this._on_call_ended = callback;
    }

    /**
     * Sets callback, called on error message from the server.
     *
     * @param callback                  Function to be called on error message
     *                                  from the server.
     */
    public on_error(callback: (data: OnErrorData) => void): void {
        this._on_error = callback;
    }

    /**
     * Sets callback, called on user leave.
     *
     * @param callback                  Function to be called on user leave.
     */
    public on_user_left(
        callback: (payload: OnUserLeftData) => void,
    ): void {
        this._on_user_left = callback;
    }

    /**
     * Sets callback, called on room created.
     *
     * @param callback                  Function to be called on room created.
     */
    public on_room_created(
        callback: (payload: OnRoomCreatedData) => void,
    ): void {
        this._on_room_created = callback;
    }

    /**
     * Sets callback, called on lives room info socket message.
     *
     * @param callback                  Function to be called on live rooms info
     *                                  socket message.
     */
    public on_live_rooms_info(
        callback: (payload: OnLiveRoomsData) => void,
    ): void {
        this._on_live_rooms_info = callback;
    }

    /**
     * Sets callback, called on buttons block socket message.
     *
     * @param callback                  Function to be called on block buttons
     *                                  socket message.
     */
    public on_buttons_block(
        callback: (payload: OnButtonsBlockData) => void,
    ): void {
        this._on_buttons_block = callback;
    }

    /**
     * Sets callback, called when connection to the server was lost and call
     * manager couldn't reconnect to it.
     *
     * @param callback                  Callback, called when connection to the
     *                                  server was lost and call manager
     *                                  couldn't reconnect to it.
     */
    public on_connection_dropped(
        callback: () => void,
    ): void {
        this._on_connection_dropped = callback;
    }

    /**
     * Sets callback, called when connection to the server was lost.
     *
     * @param callback                  Callback, called when connection to the
     *                                  server was lost.
     */
    public on_connection_lost(
        callback: () => void,
    ): void {
        this._on_connection_lost = callback;
    }

    /**
     * Sets callback, called when connection to the server was lost and call
     * manager successfully reconnected to it.
     *
     * @param callback                  Callback, called when connection to the
     *                                  server was lost and call manager
     *                                  successfully reconnected to it.
     */
    public on_connection_restored(
        callback: () => void,
    ): void {
        this._on_connection_restored = callback;
    }

    /**
     * Sets callback, called when new user added to the call.
     *
     * @param callback                  Function to be called when new user
     *                                  added to the call.
     */
    public on_user_added(
        callback: (payload: OnUserAddedData) => void,
    ): void {
        this._on_user_added = callback;
    }

    /**
     * Initiates new call, creates new call room for chat with ID = `target`.
     *
     * @param payload                   Method parameters.
     * @param payload.target            ID of the room to init call in.
     */
    public init_call(payload: {
        target: string,
        type: CallType,
    }): void {
        this.activeRoomId = payload.target;
        this.send({
            data: {
                id: this.userId,
                roomId: payload.target,
                type: payload.type,
            },
            method: UserEventType.Call,
        });
    }

    /**
     * Adds new user to the call.
     *
     * @param payload                   Method parameters.
     * @param payload.ids               List of users' IDs to be added.
     * @param payload.roomId            ID of the room to add participants to.
     */
    public invite(payload: {
        ids: string[],
        roomId: string,
    }): void {
        this.send({
            data: {
                ids: payload.ids,
                roomId: payload.roomId,
            },
            method: UserEventType.InviteUser,
        });
    }

    /**
     * Accepts incoming call.
     *
     * @param payload                   Method parameters.
     * @param payload.roomId            ID of the room to accept call from.
     * @param payload.isVideoMuted      Indicator, whether video is muted.
     * @param payload.isAudioMuted      Indicator, whether audio is muted.
     */
    public accept_call(payload: {
        roomId: string,
        isVideoMuted: boolean,
        isAudioMuted: boolean,
    }): void {
        this.activeRoomId = payload.roomId;
        this.send({
            data: {
                id: this.userId,
                isAudioMuted: payload.isAudioMuted,
                isVideoMuted: payload.isVideoMuted,
                roomId: payload.roomId,
            },
            method: UserEventType.AcceptCall,
        });
    }

    /**
     * Declines incoming call.
     *
     * @param payload                   Method parameters.
     * @param payload.roomId            ID of the room to decline call from.
     */
    public decline_call(payload: { roomId: string }): void {
        this.send({
            data: {
                id: this.userId,
                roomId: payload.roomId,
            },
            method: UserEventType.DeclineCall,
        });
    }

    /**
     * Joins the ongoing call.
     *
     * @param payload                   Method parameters.
     * @param payload.roomId            ID of the room (chat) to join.
     */
    public join_call(payload: {
        roomId: string,
        isAudioMuted: boolean,
        isVideoMuted: boolean,
    }): void {
        this.activeRoomId = payload.roomId;

        this.send({
            data: {
                id: this.userId,
                isAudioMuted: payload.isAudioMuted,
                isVideoMuted: payload.isVideoMuted,
                roomId: payload.roomId,
            },
            method: UserEventType.JoinCall,
        });
    }

    /**
     * Leaves ongoing call.
     *
     * @param payload                   ID of the room (chat) to leave.
     */
    public leave_call(payload: { roomId: string }): void {
        this.activeRoomId = '';
        this.send({
            data: {
                id: this.userId,
                roomId: payload.roomId,
            },
            method: UserEventType.LeaveCall,
        });
    }
}
