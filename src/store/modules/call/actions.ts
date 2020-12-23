import { MediaTrack } from 'medea-jason';
import { ActionContext, ActionTree } from 'vuex';

import { baseUrl, build_constraints, get_devices_list } from 'utils/jason';
import { capitalize } from 'utils/strings';

import {
    CallStates,
    CallType,
    CameraType,
    DeviceTypeAsString,
    MediaDeviceType,
    MediaKind,
    MediaSourceKind,
} from 'models/Call';
import { CallEndedReason } from 'models/CallManagerTypes';
import {
    CallParticipant,
    CallParticipantStatus,
} from 'models/CallParticipant';
import { MediaCaptureDevice } from 'models/MediaCaptureDevice';

import CallState from 'store/modules/call/state';
import RootState from 'store/root/state';

import UserModule from 'store/modules/user';

import {
    ADD_CALL_PARTICIPANT_DATA_MUTATION,
    ADD_CALL_PARTICIPANT_MUTATION,
    ADD_LIVE_ROOM_MUTATION,
    ADD_USER_TRACK,
    CLEAR_TRACKS_MUTATION,
    INIT_NEW_CALL_MANAGER,
    INIT_NEW_ROOM,
    MUTE_USER_STREAM_MUTATION,
    NEW_JASON_MUTATION,
    REFRESH_TRACKS,
    REMOVE_CALL_PARTICIPANT_DATA_MUTATION,
    REMOVE_CALL_PARTICIPANT_MUTATION,
    REMOVE_LIVE_ROOM_MUTATION,
    SET_ACTIVE_DEVICE_MUTATION,
    SET_BUTTONS_BLOCK_STATE,
    SET_CALL_START_TIME_MUTATION,
    SET_CALL_STATE_MUTATION,
    SET_CALL_TYPE_MUTATION,
    SET_CONTROLS_BUTTONS_BLOCK_STATE_MUTATION,
    SET_DEVICES_INFO_MUTATION,
    SET_HAS_FRONTAL_CAMERA_MUTATION,
    SET_HAS_INCOMING_CALL_STATE,
    SET_IS_MINIFIED_MUTATION,
    SET_IS_SCREEN_SHARING_ACTIVE_MUTATION,
    SET_PARTICIPANTS_INFO,
    SET_ROOM_ID_MUTATION,
    UPDATE_CALL_PARTICIPANT_STATUS,
    UPDATE_CONNECTION_QUALITY_SCORE,
    UPDATE_LOCAL_TRACKS,
    WIPE_CALL_DATA_MUTATION,
} from 'store/modules/call/mutations';
import { GET_USER_DATA } from 'store/modules/user/getters';


const CALL_ENDED_STATE_DURATION: number = 1500;


/**
 * Name of set call state action.
 */
export const SET_CALL_STATE = 'setCallState';

/**
 * Name of accept call action.
 */
export const ACCEPT_CALL = 'acceptCall';

/**
 * Name of decline call action.
 */
export const DECLINE_CALL = 'declineCall';

/**
 * Name of end call action.
 */
export const END_CALL = 'endCall';

/**
 * Name of call to person action.
 */
export const CALL_TO = 'callTo';

/**
 * Name of add call participant action.
 */
export const ADD_CALL_PARTICIPANTS: string = 'addCallParticipants';

/**
 * Name of remove call participant action.
 */
export const REMOVE_CALL_PARTICIPANT: string = 'removeCallParticipant';

/**
 * Name of jason init action.
 */
export const INIT_JASON: string = 'initJason';

/**
 * Name of init local stream action.
 */
export const GENERATE_LOCAL_TRACKS = 'generateLocalTracks';

/**
 * Name of toggle video action.
 */
export const TOGGLE_VIDEO = 'toggleVideo';

/**
 * Name of toggle audio action.
 */
export const TOGGLE_AUDIO = 'toggleAudio';

/**
 * Name of fill media devices action.
 */
export const FILL_MEDIA_DEVICES = 'fillMediaDevices';

/**
 * Name of new room action.
 */
export const NEW_ROOM = 'newRoom';

/**
 * Name of connect to room action.
 */
export const CONNECT_TO_ROOM = 'connectToRoom';

/**
 * Name of toggle screen sharing action.
 */
export const TOGGLE_SCREEN_SHARING = 'toggleScreenSharing';

/**
 * Name of set call type action.
 */
export const SET_CALL_TYPE = 'setCallType';

/**
 * Name of set is minified action.
 */
export const SET_IS_MINIFIED = 'setIsMinified';

/**
 * Name of change audio device action.
 */
export const CHANGE_AUDIO_DEVICE: string = 'changeAudioDevice';

/**
 * Name of change video device action.
 */
export const CHANGE_VIDEO_DEVICE: string = 'changeVideoDevice';

/**
 * Name of setup notification socket action.
 */
export const SETUP_NOTIFICATION_SOCKET: string = 'setupNotificationSocket';

/**
 * Name of join call action.
 */
export const JOIN_CALL: string = 'joinCall';

/**
 * Name of free tracks action.
 */
export const FREE_TRACKS: string = 'freeTracks';

/**
 * Name of block controls buttons action.
 */
export const BLOCK_CONTROLS_BUTTONS: string = 'blockControlsButtons';

/**
 * Name of reconnect action.
 */
export const RECONNECT_TO_CALL: string = 'reconnect';

/**
 * Blocks controls buttons.
 * Unblocks them in `CONTROL_BUTTONS_BLOCK_DURATION` ms.
 *
 * @param store
 */
export function blockControlsButtons(
    store: ActionContext<CallState, RootState>,
): void {
    store.commit(
        SET_CONTROLS_BUTTONS_BLOCK_STATE_MUTATION,
        { areBlocked: true },
    );

    setTimeout(() => store.commit(
            SET_CONTROLS_BUTTONS_BLOCK_STATE_MUTATION,
            { areBlocked: false },
        ),
        store.state.CONTROL_BUTTONS_BLOCK_DURATION,
    );
}

/**
 * Sets call type.
 *
 * @param store                         Call Vuex module.
 * @param payload                       Action parameters.
 * @param payload.type                  New call type.
 */
export function setCallType(
    store: ActionContext<CallState, RootState>,
    payload: {
        type: CallType,
    },
): void {
    store.commit(SET_CALL_TYPE_MUTATION, { type: payload.type });
}

/**
 * Inits streaming service.
 *
 * @param store                         Call Vuex store.
 */
export async function initJason(
    store: ActionContext<CallState, RootState>,
): Promise<void> {
    const { default: init, ...rust } =
        await import('medea-jason/medea_jason.js');

    await init('/node_modules/medea-jason/medea_jason_bg.wasm');

    store.state.rust = rust;
}

/**
 * Sets up notification socket callbacks.
 *
 * @param store                         Call Vuex store.
 */
export function setupNotificationSocket(
    store: ActionContext<CallState, RootState>,
): void {

    const userModule = getter => `${UserModule.vuexName}/${getter}`;
    const id = store.rootGetters[userModule(GET_USER_DATA)].id;

    store.commit(INIT_NEW_CALL_MANAGER, { id });

    store.state.callManager.on_incoming_call((data) => {
        store.commit(SET_CALL_TYPE_MUTATION, { type: data.type });
        store.commit(SET_ROOM_ID_MUTATION, { id: data.from });
        store.commit(SET_HAS_INCOMING_CALL_STATE, { hasIncomingCall: true });
    });

    store.state.callManager.on_incoming_call_timeout(() => {
        store.commit(SET_HAS_INCOMING_CALL_STATE, { hasIncomingCall: false });
        store.commit(SET_ROOM_ID_MUTATION, { id: '' });
    });

    store.state.callManager.on_buttons_block((data) => {
        store.commit(SET_BUTTONS_BLOCK_STATE, { areBlocked: data.areBlocked });
    });

    const on_live_rooms_info_default = (data) => {
        store.commit(ADD_LIVE_ROOM_MUTATION, { ids: data.ids });
    };

    const on_live_rooms_info_reconnect = (data) => {
        store.commit(
            SET_CONTROLS_BUTTONS_BLOCK_STATE_MUTATION,
            {
                areBlocked: false,
            },
        );
        store.commit(SET_BUTTONS_BLOCK_STATE, { areBlocked: false });
        on_live_rooms_info_default(data);

        if(store.state.liveRooms.includes(store.state.roomId)) {
            store.dispatch(RECONNECT_TO_CALL);
        } else {
            store.dispatch(CALL_TO, {
                id: store.state.roomId,
                type: store.state.type,
            });
        }
        store.state.callManager.on_live_rooms_info(on_live_rooms_info_default);
    };

    store.state.callManager.on_live_rooms_info(on_live_rooms_info_default);

    store.state.callManager.on_connection_restored(() => {
        if (!store.state.roomId) return;
        store.state.callManager.on_live_rooms_info(
            on_live_rooms_info_reconnect,
        );
    });

    store.state.callManager.on_connection_lost(() => {
        store.commit(
            SET_CALL_STATE_MUTATION,
            {
                state: CallStates.RECONNECTING,
            },
        );
        store.commit(REMOVE_LIVE_ROOM_MUTATION, { all: true });
        store.commit(
            SET_CONTROLS_BUTTONS_BLOCK_STATE_MUTATION,
            {
                areBlocked: true,
            },
        );
        store.commit(SET_BUTTONS_BLOCK_STATE, { areBlocked: true });
    });

    store.state.callManager.on_connection_dropped(() => {
        store.commit(WIPE_CALL_DATA_MUTATION);
        if(store.state.jason) {
            store.state.jason.dispose();
        }
    });

    store.state.callManager.on_room_created(async (data) => {
        data.participants.forEach(participant => {
            if (participant.id === id
                || participant.status === CallParticipantStatus.DISCONNECTED
            ) return;

            store.commit(
                ADD_CALL_PARTICIPANT_MUTATION,
                {
                    id: participant.id,
                    status: participant.status,
                },
            );
        });

        await store.dispatch(CONNECT_TO_ROOM, { id: data.roomId });
        store.commit(SET_CALL_STATE_MUTATION, { state: CallStates.AWAITING });
        if(store.state.type === CallType.Video) {
            await store.dispatch(GENERATE_LOCAL_TRACKS);
        }
    });

    store.state.callManager.on_call_started(async (data) => {
        const { startTime } = data;
        store.commit(ADD_LIVE_ROOM_MUTATION, { id: data.roomId });

        if (store.state.state === CallStates.AWAITING
            || store.state.state === CallStates.LOADING) {
            store.commit(SET_CALL_START_TIME_MUTATION, { startTime });
            store.commit(
                SET_HAS_INCOMING_CALL_STATE,
                { hasIncomingCall: false },
            );

            data.participants.forEach(participant => {
                if (participant.id === id
                    || (participant.status
                        === CallParticipantStatus.DISCONNECTED)
                ) return;

                const doesUserExist = !!store.state.otherParticipants.find(
                    user => user.id === participant.id,
                );
                store.commit(
                    doesUserExist
                        ? UPDATE_CALL_PARTICIPANT_STATUS
                        : ADD_CALL_PARTICIPANT_MUTATION,
                    { id: participant.id, status: participant.status },
                );
            });
            if (store.state.state === CallStates.LOADING) {
                await store.dispatch(CONNECT_TO_ROOM, { id: data.roomId });
            }


            store.commit(SET_CALL_STATE_MUTATION, { state: CallStates.ACTIVE });
        }
    });

    store.state.callManager.on_call_ended((data) => {
        store.commit(SET_HAS_INCOMING_CALL_STATE, { hasIncomingCall: false });
        store.commit(REMOVE_LIVE_ROOM_MUTATION, { id: data.roomId });

        if(store.state.state === CallStates.NONE) return;

        const endedStates: Record<CallEndedReason, CallStates> = {
            [CallEndedReason.Busy]: CallStates.BUSY,
            [CallEndedReason.Ended]: CallStates.ENDED,
            [CallEndedReason.FailedToConnect]: CallStates.FAILED_TO_CONNECT,
            [CallEndedReason.Declined]: CallStates.DECLINED,
            [CallEndedReason.NoResponse]: CallStates.NO_RESPONSE,
        };

        if (!Object.values(endedStates).includes(store.state.state)) {
            store.state.jason.dispose();
        }

        const state: CallStates = endedStates[data.reason];

        store.commit(SET_CALL_STATE_MUTATION, { state });

        setTimeout(() => {
            store.commit(SET_CALL_STATE_MUTATION, { state: CallStates.NONE });
            store.commit(SET_ROOM_ID_MUTATION, { id: '' });
            store.commit(WIPE_CALL_DATA_MUTATION);
        }, CALL_ENDED_STATE_DURATION);
    });

    store.state.callManager.on_user_added((data) => {
        store.commit(ADD_CALL_PARTICIPANT_MUTATION, {
            id: data.userId,
            status: CallParticipantStatus.AWAITING,
        });
    });

    store.state.callManager.on_error((data) => {
        console.error(data.message, data.roomId);
    });

    store.state.callManager.on_user_left((data) => {
        const user =
            store.state.otherParticipants.find(user => user.id === data.id);

        if (!user) return;

        store.commit(
            UPDATE_CALL_PARTICIPANT_STATUS,
            {
                id: user.id,
                status: CallParticipantStatus.DISCONNECTED,
            },
        );

        store.commit(REMOVE_CALL_PARTICIPANT_DATA_MUTATION, { id: data.id });
    });
}

/**
 * Frees tracks of provided type.
 *
 * @param store                         Call Vuex module.
 * @param payload                       Action parameters.
 * @param payload.type                  Indicator which track type should be
 *                                      freed ('audio', 'video', 'all').
 */
export function freeTracks(
    store: ActionContext<CallState, RootState>,
    payload: {
        type: MediaDeviceType,
    },
): void {
    const originalTracks = store.state.participantsInfo.self.tracks;

    const tracks: MediaTrack[] = payload.type === MediaDeviceType.All
        ? Object.values(originalTracks).flat()
        : originalTracks[payload.type];

    for(const track of tracks) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if(track.ptr > 0) track.free();
    }
}

/**
 * Creates new Jason and room object.
 *
 * @param store                         Call Vuex store.
 */
async function newRoom(store: ActionContext<CallState, RootState>) {
    store.commit(INIT_NEW_ROOM, { room: await store.state.jason.init_room() });

    /**
     * Adds/updates call participant information.
     * Also, sets up callbacks for the medea connections.
     */
    store.state.room.on_new_connection((connection) => {
        const id = connection.get_remote_member_id();
        const participant =
            store.state.otherParticipants.find(p => p.id === id);

        store.commit(
            participant
                ? UPDATE_CALL_PARTICIPANT_STATUS
                : ADD_CALL_PARTICIPANT_MUTATION,
            { id, status: CallParticipantStatus.ACTIVE },
        );

        store.commit(
            ADD_CALL_PARTICIPANT_DATA_MUTATION,
            {
                participant: {
                    callStatus: CallParticipantStatus.ACTIVE,
                    hasAudioBeenActivated: false,
                    hasVideoBeenActivated: false,
                    id: connection.get_remote_member_id(),
                    isAudioMuted: true,
                    isScreenSharingActive: false,
                    isVideoMuted: true,
                    srcObject: null,
                    tracks: {
                        audio: [],
                        video:[],
                    },
                },
            },
        );

        /**
         * Adds call participant on new connection.
         */
        connection.on_remote_track_added((track) => {
            const user = store.state.participantsInfo[
                connection.get_remote_member_id()
            ];
            const type = DeviceTypeAsString[track.kind()];
            const fieldDiff = capitalize(type);
            const muteFieldName = `is${fieldDiff}Muted`;
            const hasBeenInitiatedFieldName = `has${fieldDiff}BeenActivated`;

            store.commit(ADD_USER_TRACK, { id, track });

            if (track.kind() === MediaKind.Video
                && track.media_source_kind() === MediaSourceKind.Display) {
                store.commit(
                    SET_IS_SCREEN_SHARING_ACTIVE_MUTATION,
                    {
                        id,
                        isActive: true,
                    },
                );
            } else if(!user[hasBeenInitiatedFieldName] || user[muteFieldName]) {
                store.commit(
                    MUTE_USER_STREAM_MUTATION,
                    {
                        id,
                        isMuted: false,
                        type,
                    },
                );
            }

            /**
             * Sets `isAudioMuted` or `isVideoMuted` indicator (depending on
             * track type) state of call participant with ID = `id` to `false`.
             */
            track.on_enabled(() => {
                if (track.kind() === MediaKind.Video
                    && track.media_source_kind() === MediaSourceKind.Display) {
                    store.commit(
                        SET_IS_SCREEN_SHARING_ACTIVE_MUTATION,
                        {
                            id,
                            isActive: true,
                        },
                    );
                } else if(user[muteFieldName]) {
                    store.commit(
                        MUTE_USER_STREAM_MUTATION,
                        {
                            id,
                            isMuted: false,
                            type,
                        },
                    );
                }
                store.commit(REFRESH_TRACKS, {
                    type: DeviceTypeAsString[track.kind()],
                    userId: id,
                });

            });

            /**
             * Sets `isAudioMuted` or `isVideoMuted` indicator (depending on
             * track type) state of call participant with ID = `id` to `true` if
             * all tracks of that type are inactive.
             */
            track.on_disabled(() => {
                if (track.kind() === MediaKind.Video
                    && track.media_source_kind() === MediaSourceKind.Display) {
                    store.commit(
                        SET_IS_SCREEN_SHARING_ACTIVE_MUTATION,
                        {
                            id,
                            isActive: false,
                        },
                    );
                } else if(!user.tracks[type].find(t => t.enabled()
                    && t.media_source_kind() === MediaSourceKind.Device,
                )) {
                    store.commit(
                        MUTE_USER_STREAM_MUTATION,
                        {
                            id,
                            isMuted: true,
                            type,
                        },
                    );
                }
            });
        });

        /**
         * Removes call participant on disconnect message.
         * Also, ends call if there is no participants left.
         */
        connection.on_close(() => {
            store.commit(REMOVE_CALL_PARTICIPANT_MUTATION, { id });
            store.commit(REMOVE_CALL_PARTICIPANT_DATA_MUTATION, { id });
        });

        /**
         * Updates connection quality score.
         */
        connection.on_quality_score_update((score) => {
            store.commit(UPDATE_CONNECTION_QUALITY_SCORE, { score });
        });
    });

    /**
     * Frees user media devices on end call.
     */
    store.state.room.on_close(() => {
        store.dispatch(FREE_TRACKS, { type: MediaDeviceType.All });
    });

    /**
     * Adds local track to 'self' participant data.
     */
    store.state.room.on_local_track(async (track) => {
        await store.commit(ADD_USER_TRACK, { id: 'self', track });

        const user = store.state.participantsInfo.self;
        const hasBeenInitiatedFieldName = `has${
            capitalize(DeviceTypeAsString[track.kind()].toString())
        }BeenActivated`;

        if( track.media_source_kind() !== MediaSourceKind.Display
            && !user[hasBeenInitiatedFieldName]
        ) {
            store.commit(
                MUTE_USER_STREAM_MUTATION, {
                    id: 'self',
                    isMuted: false,
                    type: DeviceTypeAsString[track.kind()],
                },
            );
        }
    });

    /**
     * TODO: Add user-friendly message.
     */
    store.state.room.on_failed_local_media((e) => {
        console.error(e);
        console.error(
            `Join to room failed: Error[name:[${e.name}],`,
            `[msg:${e.message}], [source,${e.source}]]`,
        );
        console.error(e.trace());

    });

    /**
     * Tries to reconnect to server.
     */
    store.state.room.on_connection_loss(async (reconnectHandle) => {
        store.commit(
            SET_CALL_STATE_MUTATION,
            { state: CallStates.RECONNECTING },
        );

        try {
            await reconnectHandle.reconnect_with_backoff(3000, 2.0, 10000);

            store.commit(SET_CALL_STATE_MUTATION, { state: CallStates.ACTIVE });
        } catch(e) {
            console.error(
                'Error on reconnection with backoff:\n',
                e,
                e.message(),
            );
        }
    });
}

/**
 * Inits local stream.
 * Notifies user about inability to build audio/video constraints.
 *
 * @param store                         Call Vuex store.
 */
async function generateLocalTracks(
    store: ActionContext<CallState, RootState>,
) {
    const self = store.state.participantsInfo.self;

    const [videoDevices, audioDevices] = [
        self.isVideoMuted ? null : store.state.videoDevices,
        self.isAudioMuted ? null : store.state.audioDevices,
    ];

    let constraints = await build_constraints(
        store.state.rust,
        audioDevices,
        videoDevices,
        {
            ignoreScreenSharing: true,
        },
    );

    await store.state.room.set_local_media_settings(constraints);
    await store.state.room.disable_video(MediaSourceKind.Display);

    const get_tracks = async () => await store.state.jason
            .media_manager()
            .init_local_tracks(constraints);

    try {
        store.commit(ADD_USER_TRACK, { id: 'self', track: await get_tracks() });
        store.commit(UPDATE_LOCAL_TRACKS);
    } catch (e) {
        const origError = e.source;
        if(!origError) throw e;

        const name = origError.name;

        const constraintsSettings: {
            audioDevices: null | MediaCaptureDevice[],
            videoDevices: null | MediaCaptureDevice[],
        } = {
            audioDevices: null,
            videoDevices: null,
        };

        const message = {
            audioDevices: 'unable to get audio, will try to enter ' +
                'room with video only',
            videoDevices: 'unable to get video, will try' +
                ' to enter room with audio only',
        };

        if ( name === 'NotReadableError' || name === 'AbortError') {
            if (origError.message.includes('audio')) {
                constraintsSettings.videoDevices = videoDevices;
            } else if (origError.message.includes('video')) {
                constraintsSettings.audioDevices = audioDevices;
            } else {
                throw e;
            }

            let messageToPrintKey = Object.keys(constraintsSettings).find(
                (key) => constraintsSettings[key] === null,
            );

            if(!messageToPrintKey) {
                return;
            } else {
                messageToPrintKey = messageToPrintKey[1];
            }

            // TODO: Add user friendly message.
            alert(message[messageToPrintKey]);

            constraints = await build_constraints(
                store.state.rust,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ...constraintsSettings,
            );

            store.commit(
                ADD_USER_TRACK,
                {
                    id: 'self',
                    track: await get_tracks(),
                },
            );
            store.commit(UPDATE_LOCAL_TRACKS);
        } else {
            throw e;
        }
    }


    return constraints;
}

/**
 * Detects all video and audio devices and adds them to store containers.
 *
 * @param store                         Call Vuex store.
 */
async function fillMediaDevices(store) {
    const devices: {
        audioDevices: MediaCaptureDevice[],
        videoDevices: MediaCaptureDevice[],
    } = await get_devices_list(store.state.jason);

    const hasFrontalCamera = !!devices.videoDevices.find(
        device => device.id === CameraType.Front,
    );

    store.commit(SET_HAS_FRONTAL_CAMERA_MUTATION, { hasFrontalCamera });
    store.commit(SET_DEVICES_INFO_MUTATION, { devices });
}

/**
 * Toggles video stream.
 *
 * @param store                         Call Vuex store.
 */
export async function toggleVideo(
    store: ActionContext<CallState, RootState>,
): Promise<void> {
    try {
        const data = isMuted => ({
            id: 'self',
            isMuted,
            type: MediaDeviceType.Video,
        });

        if (store.state.participantsInfo.self.isVideoMuted) {
            await store.state.room.enable_video(MediaSourceKind.Device);
            if (!store.state.participantsInfo.self.hasVideoBeenActivated) {
                const constraints = await build_constraints(
                    store.state.rust,
                    store.state.audioDevices,
                    store.state.videoDevices,
                );
                await store.state.room.set_local_media_settings(constraints);
            }
            store.commit(MUTE_USER_STREAM_MUTATION, data(false));
        } else {
            await store.state.room.disable_video(MediaSourceKind.Device);
            store.commit(MUTE_USER_STREAM_MUTATION, data(true));

            await store.dispatch(
                FREE_TRACKS,
                { type: MediaDeviceType.Video },
            );
            store.commit(
                CLEAR_TRACKS_MUTATION,
                { type: MediaDeviceType.Video },
            );
        }
        store.dispatch(BLOCK_CONTROLS_BUTTONS);
        store.commit(UPDATE_LOCAL_TRACKS);
    } catch (e) {
        console.error(e);
    }
}

/**
 * Toggles audio stream.
 *
 * @param store                         Call Vuex store.
 */
export async function toggleAudio(
    store: ActionContext<CallState, RootState>,
): Promise<void> {
    try {
        const data = isMuted => ({
            id: 'self',
            isMuted,
            type: MediaDeviceType.Audio,
        });
        if (store.state.participantsInfo.self.isAudioMuted) {
            await store.state.room.enable_audio();
            store.commit(MUTE_USER_STREAM_MUTATION, data(false));
            if (!store.state.participantsInfo.self.hasAudioBeenActivated) {
                await store.dispatch(GENERATE_LOCAL_TRACKS);
            }
        } else {
            await store.state.room.disable_audio();
            store.commit(MUTE_USER_STREAM_MUTATION,data(true));
            await store.dispatch(FREE_TRACKS, { type: MediaDeviceType.Audio });
        }
        store.commit(UPDATE_LOCAL_TRACKS);
    } catch (e) {
        console.error('Error while togging audio: ', e);
    }
}


/**
 * Removes call participant.
 *
 * @param store                         Call Vuex store.
 * @param participant                   Person to be removed.
 */
export function removeCallParticipant(
    store: ActionContext<CallState, RootState>,
    participant: CallParticipant,
): void {
    // TODO: Move this to websocket message callback.
    store.commit(REMOVE_CALL_PARTICIPANT_DATA_MUTATION, { id: participant });
}

/**
 * Adds call participant.
 *
 * @param store                         Call Vuex store.
 * @param payload                       Action parameters.
 * @param payload.ids                   IDs of the users to be added.
 */
export function addCallParticipants(
    store: ActionContext<CallState, RootState>,
    payload: {
        ids: string[],
    },
): void {
    store.state.callManager.invite({
        ids: payload.ids,
        roomId: store.state.roomId,
    });
}


/**
 * Starts call with chosen contact.
 *
 * @param store                         Call Vuex store.
 * @param payload                       Action parameters.
 * @param payload.id                    ID of the chat to call to.
 * @param payload.type                  Call type ('audio' or 'video').
 */
export async function callTo(
    store: ActionContext<CallState, RootState>,
    payload: {
        id: string,
        type: CallType,
    },
): Promise<void> {
    store.commit(NEW_JASON_MUTATION);
    store.commit(WIPE_CALL_DATA_MUTATION);
    store.commit(SET_ROOM_ID_MUTATION, { id: payload.id });
    store.commit(SET_CALL_TYPE_MUTATION, { type: payload.type });

    store.commit(SET_PARTICIPANTS_INFO, {
        participants: {
            self: {
                callStatus: CallParticipantStatus.ACTIVE,
                id: 'self',
                isAudioMuted: false,
                isScreenSharingActive: false,
                isVideoMuted: payload.type === CallType.Audio,
                srcObject: null,
                tracks: {
                    audio: [],
                    video: [],
                },
            },
        },
    });


    store.state.callManager.init_call({
        target: payload.id,
        type: payload.type,
    });
}

/**
 * Connects to the room.
 *
 * @param store                         Call Vuex store.
 * @param payload                       Action parameters.
 * @param payload.id                    ID of the room to connect to.
 */
async function connectToRoom(
    store: ActionContext<CallState, RootState>,
    payload: {
        id: string,
    },
) {
    await store.dispatch(NEW_ROOM);
    const userModule = getter => `${UserModule.vuexName}/${getter}`;
    const userData = store.rootGetters[userModule(GET_USER_DATA)];

    try {
        await store.dispatch(FILL_MEDIA_DEVICES);
        const constraints = await build_constraints(
            store.state.rust,
            store.state.audioDevices,
            store.state.type === CallType.Video
                ? store.state.videoDevices
                : null,
        );
        await store.state.room.set_local_media_settings(constraints);
        await store.state.room.disable_video(MediaSourceKind.Display);
    } catch (e) {
        console.error('Error while settings up pre-join data.', e);
    }

    try {
        const roomLink = `${baseUrl}${payload.id}/${userData.id}/test`;
        await store.state.room.join(roomLink);
    } catch (e) {
        console.error(`Join to room failed: Error[name:[${e.name()}],`);
        console.error(
            `[msg:${e.message()}], [source,${e.source()}]]`,
        );
        console.error(e.trace());
    }
}

/**
 * Closes call session.
 * Also, disposes used media streams, deletes room if there is no participants
 * left.
 *
 * @param store                         Call Vuex store.
 */
export async function endCall(
    store: ActionContext<CallState, RootState>,
): Promise<void> {
    store.commit(SET_CALL_STATE_MUTATION, { state: CallStates.ENDED });
    setTimeout(() => {
        store.commit(SET_CALL_STATE_MUTATION, { state: CallStates.NONE });
        store.commit(WIPE_CALL_DATA_MUTATION);
    }, CALL_ENDED_STATE_DURATION);
    store.commit(
        MUTE_USER_STREAM_MUTATION,
        {
            id: 'self',
            isMuted: true,
            type: MediaDeviceType.Audio,
        });
    store.commit(
        MUTE_USER_STREAM_MUTATION,
        {
            id: 'self',
            isMuted: true,
            type: MediaDeviceType.Video,
        });
    store.commit(
        SET_IS_SCREEN_SHARING_ACTIVE_MUTATION,
        {
            id: 'self',
            isActive: false,
        },
    );

    store.state.callManager.leave_call({ roomId: store.state.roomId });
    await store.state.jason.dispose();
}

/**
 * Declines incoming call.
 *
 * @param store                         Call Vuex store.
 */
export function declineCall(
    store: ActionContext<CallState, RootState>,
): void {
    store.commit(SET_HAS_INCOMING_CALL_STATE, { hasIncomingCall: false });
    store.commit(SET_CALL_STATE_MUTATION, { state: CallStates.NONE });
    store.state.callManager.decline_call({ roomId: store.state.roomId });
}

/**
 * Accepts incoming call by setting call state active.
 *
 * @param store                         Call Vuex store.
 */
export function acceptCall(
    store: ActionContext<CallState, RootState>,
): void {
    store.commit(NEW_JASON_MUTATION);
    store.commit(SET_CALL_STATE_MUTATION, { state: CallStates.LOADING });

    store.commit(SET_PARTICIPANTS_INFO, {
        participants: {
            self: {
                callStatus: CallParticipantStatus.ACTIVE,
                id: 'self',
                isAudioMuted: false,
                isVideoMuted: store.state.type === CallType.Audio,
                tracks: {
                    audio: [],
                    video: [],
                },
            },
        },
    });
    store.state.callManager.accept_call({
        isAudioMuted: false,
        isVideoMuted: store.state.type === CallType.Audio,
        roomId: store.state.roomId,
    });
}

/**
 * Sets call state.
 *
 * @param store                         Call Vuex store.
 * @param callState                     Active camera ID.
 */
export function setCallState(
    store: ActionContext<CallState, RootState>,
    callState: CallStates,
): void {
    store.commit(SET_CALL_STATE_MUTATION, { state: callState });
}

/**
 * Changes active video device.
 *
 * @param store                         Call Vuex state.
 * @param payload                       Action parameters.
 * @param payload.id                    ID of the device to be set active.
 */
export async function changeVideoDevice(
    store: ActionContext<CallState, RootState>,
    payload: {
        id: string,
    },
): Promise<void> {
    const device = store.state.videoDevices.find(
        device => device.id === payload.id,
    );
    const activeDevice = store.state.videoDevices.find(
        device => device.isSelected,
    );
    if(!device) return;

    store.commit(SET_ACTIVE_DEVICE_MUTATION, {
        deviceId: payload.id,
        type: MediaDeviceType.Video,
    });

    try {
        const constraints = await build_constraints(
            store.state.rust,
            store.state.audioDevices,
            store.state.videoDevices,
        );

        await store.dispatch(FREE_TRACKS, { type: MediaDeviceType.Video });
        await store.commit(
            CLEAR_TRACKS_MUTATION,
            { type: MediaDeviceType.Video },
        );

        if (activeDevice && device.id === activeDevice.id
            || store.state.participantsInfo.self.hasVideoBeenActivated
        ) {
            await store.state.room.enable_video(MediaSourceKind.Device);
        }
        await store.state.room.set_local_media_settings(constraints);

        store.commit(UPDATE_LOCAL_TRACKS);
    } catch (e) {
        console.error(`Changing video source failed: ${e.message}`);
    }

}

/**
 * Changes active audio device.
 *
 * @param store                         Call Vuex module.
 * @param payload                       Action parameters.
 * @param payload.id                    ID of the device to be set active.
 */
export async function changeAudioDevice(
    store: ActionContext<CallState, RootState>,
    payload: {
        id: string,
    },
): Promise<void> {
    const device = store.state.audioDevices.find(
        device => device.id === payload.id,
    );
    if(!device) return;

    store.commit(
        SET_ACTIVE_DEVICE_MUTATION,
        {
            deviceId: payload.id,
            type: MediaDeviceType.Audio,
        },
    );

    try {
        const [videoDevices, audioDevices] = [
            store.state.videoDevices,
            store.state.audioDevices,
        ];
        let constraints = await build_constraints(
            store.state.rust,
            audioDevices,
            videoDevices,
        );

        store.dispatch(FREE_TRACKS, { type: MediaDeviceType.Audio });

        if(!store.state.participantsInfo.self.isScreenSharingActive) {
            await store.state.room.disable_video(MediaSourceKind.Display);
        }

        if (!store.state.participantsInfo.self.isAudioMuted) {
            constraints = await store.dispatch(GENERATE_LOCAL_TRACKS);
        }
        await store.state.room.set_local_media_settings(constraints);
    } catch (e) {
        console.error(`Changing video source failed: ${e.message}`);
    }
}

/**
 * Toggles screen sharing function.
 *
 * @param store                         Call Vuex module store.
 */
export async function toggleScreenSharing(
    store: ActionContext<CallState, RootState>,
): Promise<void> {
    const screenOption = store.state.videoDevices.find(
        device => device.id === 'screen',
    );

    if(!screenOption) return;

    if(store.state.participantsInfo.self.isScreenSharingActive) {
        await store.state.room.disable_video(MediaSourceKind.Display);
        store.commit(
            SET_IS_SCREEN_SHARING_ACTIVE_MUTATION,
            {
                id: 'self',
                isActive: false,
            },
        );
        // await store.dispatch(FREE_TRACKS, { type: MediaDeviceType.Video });
        store.state.participantsInfo.self.tracks.video.forEach(track => {
            if(track.media_source_kind() === MediaSourceKind.Display) {
                track.free();
            }
        });
        await store.commit(
            CLEAR_TRACKS_MUTATION,
            { type: MediaDeviceType.Video },
        );
        store.commit(UPDATE_LOCAL_TRACKS);
    } else {
        await store.state.room.enable_video(MediaSourceKind.Display);
        if(!store.state.participantsInfo.self.hasVideoBeenActivated) {
            await store.state.room.disable_video(MediaSourceKind.Device);
            const constraints = await build_constraints(
                store.state.rust,
                store.state.audioDevices,
                store.state.videoDevices.map(device => ({
                    ...device,
                    isSelected: false,
                })),
            );

            await store.state.room.set_local_media_settings(constraints);
        }

        store.commit(
            SET_IS_SCREEN_SHARING_ACTIVE_MUTATION,
            {
                id: 'self',
                isActive: true,
            },
        );
        store.commit(UPDATE_LOCAL_TRACKS);
    }
    store.dispatch(BLOCK_CONTROLS_BUTTONS);


}

/**
 * Sets `isMinified` indicator state.
 *
 * @param store                         Call Vuex module.
 * @param payload                       Action parameters.
 * @param payload.isMinified            Indicator whether call is minified.
 */
export async function setIsMinified(
    store: ActionContext<CallState, RootState>,
    payload: {
        isMinified: boolean,
    },
): Promise<void> {
    store.commit(SET_IS_MINIFIED_MUTATION, { isMinified: payload.isMinified });
}

/**
 * Joins the call room.
 *
 * @param store                         Call Vuex module.
 * @param payload                       Action parameters.
 * @param payload.roomId                ID of the room to connect to.
 * @param payload.isAudioMuted          Indicator, whether audio is muted.
 * @param payload.isVideoMuted          Indicator, whether video is muted.
 */
export async function joinCall(
    store: ActionContext<CallState, RootState>,
    payload: {
        isAudioMuted: boolean,
        isScreenSharingActive: boolean,
        isVideoMuted: boolean,
        roomId: string,
    },
): Promise<void> {
    store.commit(NEW_JASON_MUTATION);
    store.commit(WIPE_CALL_DATA_MUTATION);
    store.state.roomId = payload.roomId;

    store.commit(SET_PARTICIPANTS_INFO, {
        participants: {
            self: {
                callStatus: CallParticipantStatus.ACTIVE,
                id: 'self',
                isAudioMuted: payload.isAudioMuted,
                isScreenSharingActive: payload.isScreenSharingActive,
                isVideoMuted: payload.isVideoMuted,
                srcObject: null,
                tracks: {
                    audio: [],
                    video: [],
                },
            },
        },
    });

    store.commit(SET_CALL_TYPE_MUTATION, { type: CallType.Audio });

    store.commit(SET_CALL_STATE_MUTATION, { state: CallStates.LOADING });

    store.state.callManager.join_call({
        isAudioMuted: payload.isAudioMuted,
        isVideoMuted: payload.isVideoMuted,
        roomId: payload.roomId,
    });
}

/**
 * Reconnects to the ongoing call.
 *
 * @param store                         Call Vuex module.
 */
export function reconnect(
    store: ActionContext<CallState, RootState>,
): void {
    store.commit(SET_CALL_STATE_MUTATION, { state: CallStates.LOADING });

    store.state.callManager.join_call({
        isAudioMuted: store.state.participantsInfo.self.isAudioMuted,
        isVideoMuted: store.state.participantsInfo.self.isVideoMuted,
        roomId: store.state.roomId,
    });

}

export default {
    acceptCall,
    addCallParticipants,
    blockControlsButtons,
    callTo,
    changeAudioDevice,
    changeVideoDevice,
    connectToRoom,
    declineCall,
    endCall,
    fillMediaDevices,
    freeTracks,
    generateLocalTracks,
    initJason,
    joinCall,
    newRoom,
    reconnect,
    removeCallParticipant,
    setCallState,
    setCallType,
    setIsMinified,
    setupNotificationSocket,
    toggleAudio,
    toggleScreenSharing,
    toggleVideo,
} as ActionTree<CallState, RootState>;
