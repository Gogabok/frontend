import { MediaTrack, RoomHandle } from 'medea-jason';
import { MutationTree } from 'vuex';

import { CallManager } from 'utils/CallManager';
import { capitalize } from 'utils/strings';

import {
    CallStates,
    CallType,
    DeviceTypeAsString,
    MediaDeviceType,
    MediaKind,
} from 'models/Call';
import {
    CallParticipant,
    CallParticipantStatus,
} from 'models/CallParticipant';

import CallState from 'store/modules/call/state';


/**
 * Name of set call type mutation.
 */
export const SET_CALL_TYPE_MUTATION: string = 'setType';

/**
 * Name of set call state mutation.
 */
export const SET_CALL_STATE_MUTATION: string = 'setState';

/**
 * Name of set call participants info mutation.
 */
export const SET_PARTICIPANTS_INFO: string = 'setParticipantsInfo';

/**
 * Name of add call participant mutation.
 */
export const ADD_CALL_PARTICIPANT_DATA_MUTATION: string =
    'addCallParticipantData';

/**
 * Name of remove call participant mutation.
 */
export const REMOVE_CALL_PARTICIPANT_DATA_MUTATION: string =
    'removeCallParticipantData';

/**
 * Name of add call participant mutation.
 */
export const ADD_CALL_PARTICIPANT_MUTATION: string = 'addCallParticipant';

/**
 * Name of update local stream mutation.
 */
export const UPDATE_LOCAL_TRACKS: string = 'updateLocalTracks';

/**
 * Name of mute user stream mutation.
 */
export const MUTE_USER_STREAM_MUTATION: string = 'muteUserStream';

/**
 * Name of set active device mutation.
 */
export const SET_ACTIVE_DEVICE_MUTATION: string = 'setActiveDevice';

/**
 * Name of has incoming call state mutation.
 */
export const SET_HAS_INCOMING_CALL_STATE: string = 'setHasIncomingCallState';

/**
 * Name of set is minified mutation.
 */
export const SET_IS_MINIFIED_MUTATION: string = 'setIsMinified';

/**
 * Name of add remote track mutation.
 */
export const ADD_USER_TRACK: string = 'addUserTrack';

/**
 * Name of update call participant status.
 */
export const UPDATE_CALL_PARTICIPANT_STATUS: string =
    'updateCallParticipantStatus';

/**
 * Name of add live room mutation.
 */
export const ADD_LIVE_ROOM_MUTATION: string = 'addLiveRoom';

/**
 * Name of remove live room mutation.
 */
export const REMOVE_LIVE_ROOM_MUTATION: string = 'removeLiveRoom';

/**
 * Name of set call start time mutation.
 */
export const SET_CALL_START_TIME_MUTATION: string = 'setCallStartTime';

/**
 * Name of set room ID mutation.
 */
export const SET_ROOM_ID_MUTATION: string = 'setRoomId';

/**
 * Name of remove call participant mutation.
 */
export const REMOVE_CALL_PARTICIPANT_MUTATION: string = 'removeCallParticipant';

/**
 * Name of set devices info mutation.
 */
export const SET_DEVICES_INFO_MUTATION: string = 'setDevicesInfo';

/**
 * Name of set has frontal camera mutation.
 */
export const SET_HAS_FRONTAL_CAMERA_MUTATION: string = 'setHasFrontalCamera';

/**
 * Name of clear tracks mutation.
 */
export const CLEAR_TRACKS_MUTATION: string = 'clearTracks';

/**
 * Name of set `isScreenSharingActive` mutation.
 */
export const SET_IS_SCREEN_SHARING_ACTIVE_MUTATION: string =
    'setIsScreenSharingActive';

/**
 * Name of new jason mutation.
 */
export const NEW_JASON_MUTATION: string = 'newJason';

/**
 * Name of init new call manager mutation.
 */
export const INIT_NEW_CALL_MANAGER: string = 'initCallManager';

/**
 * Name of init new room mutation.
 */
export const INIT_NEW_ROOM: string = 'initNewRoom';

/**
 * Name of set buttons block state mutation.
 */
export const SET_BUTTONS_BLOCK_STATE: string = 'setButtonsBlockState';

/**
 * Name of refresh tracks mutation.
 */
export const REFRESH_TRACKS: string = 'refreshTracks';

/**
 * Name of set controls buttons block state mutation.
 */
export const SET_CONTROLS_BUTTONS_BLOCK_STATE_MUTATION: string =
    'setControlButtonsBlockState';

/**
 * Name of update connection quality score mutation.
 */
export const UPDATE_CONNECTION_QUALITY_SCORE: string =
    'updateConnectionQualityScore';

/**
 * Name of wipe call data mutation.
 */
export const WIPE_CALL_DATA_MUTATION: string = 'wipeCallData';

/**
 * Updates connection quality score.
 *
 * @param state                         Vuex Call state.
 * @param payload                       Mutation parameters.
 * @param payload.score                 New connection quality score.
 */
export function updateConnectionQualityScore(
    state: CallState,
    payload: {
        score: number,
    },
): void {
    state.connectionQualityScore = payload.score;
}

/**
 * Sets controls buttons block state.
 *
 * @param state                         Vuex Call State.
 * @param payload                       Mutation parameters.
 * @param payload.areBlocked            Indicator whether controls buttons
 *                                      are blocked.
 */
export function setControlButtonsBlockState(
    state: CallState,
    payload: {
        areBlocked: boolean,
    },
): void {
    state.areControlsButtonsBlocked = payload.areBlocked;
}

/**
 * Refreshes tracks to init component update.
 *
 * @param state                         Call Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.userId                ID of the user whose tracks should be
 *                                      updated.
 * @param payload.type                  Type of tracks to be refreshed
 *                                      ('audio' | 'video').
 */
export function refreshTracks(
    state: CallState,
    payload: {
        userId: string,
        type: MediaDeviceType,
    } = {
        type: MediaDeviceType.All,
        userId: 'self',
    },
): void {
    if(payload.type === MediaDeviceType.All) {
        state.participantsInfo[payload.userId].tracks = {
            ...state.participantsInfo[payload.userId].tracks,
        };
    } else {
        state.participantsInfo[payload.userId].tracks[payload.type] = [
            ...state.participantsInfo[payload.userId].tracks[payload.type],
        ];
    }
}

/**
 * Sets buttons block state.
 *
 * @param state                         Vuex call state.
 * @param payload                       Mutation parameters.
 * @param payload.areBlocked            Indicator whether buttons are blocked.
 */
export function setButtonsBlockState(
    state: CallState,
    payload: {
        areBlocked: boolean,
    },
): void {
    state.areCallButtonsBlocked = payload.areBlocked;
}

/**
 * Creates new instance of Jason.
 *
 * @param state                         Call Vuex state.
 */
export function newJason(
    state: CallState,
): void {
    state.jason = new state.rust.Jason();
}

/**
 * Removes 0 pointer tracks from the list of tracks.
 *
 * @param state                         Call Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.type                  Type of tracks to be cleared
 *                                      ('audio' | 'video' | 'all').
 */
export function clearTracks(
    state: CallState,
    payload: {
        type: MediaDeviceType,
    } = { type: MediaDeviceType.All },
): void {
    const tracks = state.participantsInfo.self.tracks;
    if(payload.type === MediaDeviceType.All) {
        state.participantsInfo = {
            ...state.participantsInfo,
            self: {
                ...state.participantsInfo.self,
                tracks: {
                    // eslint-disable-next-line max-len
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    audio: tracks.audio.filter(track => track.ptr > 0),
                    // eslint-disable-next-line max-len
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    video: tracks.video.filter(track => track.ptr > 0),
                },
            },
        };
    } else {
        state.participantsInfo = {
            ...state.participantsInfo,
            self: {
                ...state.participantsInfo.self,
                tracks: {
                    ...state.participantsInfo.self.tracks,
                    [payload.type]:
                        // eslint-disable-next-line max-len
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        tracks[payload.type].filter(track => track.ptr > 0),
                },
            },
        };
    }
}

/**
 * Sets `hasFrontalCamera` indicator value.
 *
 * @param state                         Call Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.hasFrontalCamera      Indicator whether device has frontal
 *                                      camera.
 */
export function setHasFrontalCamera(
    state: CallState,
    payload: {
        hasFrontalCamera: boolean,
    },
): void {
    state.hasFrontalCamera = payload.hasFrontalCamera;
}

/**
 * Sets devices info.
 *
 * @param state                         Call Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.devices               Available video and audio devices.
 */
export function setDevicesInfo(
    state: CallState,
    payload: {
        devices: {
            audioDevices: [],
            videoDevices: [],
        },
    },
): void {
    state.audioDevices = payload.devices.audioDevices;
    state.videoDevices = payload.devices.videoDevices;
}


/**
 * Adds call participant.
 *
 * @param state                         Call Vuex state.
 * @param payload                       Mutations parameters.
 * @param payload.id                    ID of the user.
 * @param payload.status                Call participant status.
 */
export function addCallParticipant(
    state: CallState,
    payload: {
        id: string,
        status: CallParticipantStatus,
    },
): void {
    state.otherParticipants.push(payload);
}

/**
 * Removes call participant from the list of other call participants.
 *
 * @param state                         Call Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of the user to be removed.
 * @param payload.all                   Indicator whether all users have to be
 *                                      removed from the participants list.
 */
export function removeCallParticipant(
    state: CallState,
    payload: {
        id?: string,
        all?: boolean,
    },
): void {
    if(payload.all) {
        state.otherParticipants = [];
    } else if(payload.id) {
        state.otherParticipants = state.otherParticipants.filter(
            participant => participant.id !== payload.id,
        );
    }
}

/**
 * Updates call participant status status.
 *
 * @param state                         Call Vuex state
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of the user whose status has to be
 *                                      updated.
 * @param payload.status                Status to be set.
 */
export function updateCallParticipantStatus(
    state: CallState,
    payload: {
        id: string,
        status: CallParticipantStatus,
    },
): void {
    state.otherParticipants = state.otherParticipants.map(user => ({
        id: user.id,
        status: user.id === payload.id
            ? payload.status
            : user.status,
    }));
}

/**
 * Updates current app user's stream.
 *
 * @param state                         Call Vuex state.
 */
function updateLocalTracks(
    state: CallState,
) {
    const user = state.participantsInfo.self;
    const clearTracks = type => {
        const tracks = user.tracks[type].filter(track => track.ptr > 0);
        const hasBeenActivatedName = `has${capitalize(type)}BeenActivated`;
        if(tracks.length === user.tracks[type].length) return;
        user[hasBeenActivatedName] =
            user[hasBeenActivatedName] || !!tracks.length;
        user.tracks[type] = tracks;
    };

    clearTracks('audio');
    clearTracks('video');
}

/**
 * Adds media track to user's tracks.
 *
 * @param state                         Call Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of the user to be modified.
 * @param payload.track                 Track to be added.
 */
function addUserTrack(
    state: CallState,
    payload: {
        id: string,
        track: MediaTrack | MediaTrack[],
    },
): void {
    const user = state.participantsInfo[payload.id];

    const clearTracks = (...types) => types.forEach(type => user.tracks[type] =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        user.tracks[type].filter(track => track.ptr > 0),
    );

    if(Array.isArray(payload.track)) {
        payload.track.every(track => track.kind() === payload.track[0].kind())
            ? clearTracks(DeviceTypeAsString[payload.track[0].kind()])
            : clearTracks(
                DeviceTypeAsString[MediaKind.Audio],
                DeviceTypeAsString[MediaKind.Video],
            );

        const tracks = { audio: [], video: [] };
        payload.track.forEach(
            track => tracks[DeviceTypeAsString[track.kind()]].push(track),
        );
        user.tracks.audio = user.tracks.audio.concat(tracks.audio);
        user.tracks.video = user.tracks.video.concat(tracks.video);
    } else {
        clearTracks(DeviceTypeAsString[payload.track.kind()]);
        user.tracks[DeviceTypeAsString[payload.track.kind()]] = user.tracks[
            DeviceTypeAsString[payload.track.kind()]].concat(payload.track);
    }
}

/**
 * Sets active video device.
 *
 * @param state                         Call Vuex module state.
 * @param payload                       Mutation parameters.
 * @param payload.deviceId              ID of the device to be set active.
 */
export function setActiveDevice(
    state: CallState,
    payload: {
        deviceId: string,
        type: MediaDeviceType,
    },
): void {
    const newActiveDevice = state[`${payload.type}Devices`].find(
        device => device.id === payload.deviceId,
    );
    if(!newActiveDevice) return;

    const prevActiveDevice = state[`${payload.type}Devices`].find(
        device => device.isSelected,
    );
    newActiveDevice.isSelected = true;
    if(!prevActiveDevice || prevActiveDevice.id === newActiveDevice.id) return;
    prevActiveDevice.isSelected = false;

}

/**
 * Mutes stream of interlocutor.
 *
 * @param state                         Call Vuex module state.
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of the user to be modified.
 * @param payload.isMuted               Indicator whether stream is muted.
 * @param payload.type                  Type of stream to be muted
 *                                      ('audio' | 'video').
 */
export function muteUserStream(
    state: CallState,
    payload: {
        id: string,
        isMuted: boolean,
        type: MediaDeviceType,
    },
): void {
    const user = state.participantsInfo[payload.id];
    const hasBeenActivatedName = `has${capitalize(payload.type)}BeenActivated`;
    const isMutedFieldName = `is${capitalize(payload.type)}Muted`;

    user[hasBeenActivatedName] = user[hasBeenActivatedName] || !payload.isMuted;
    user[isMutedFieldName] = payload.isMuted;
}

/**
 * Adds participant to call participants list.
 *
 * @param state                         Call Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.participant           New call participant.
 */
export function addCallParticipantData(
    state: CallState,
    payload: {
        participant: CallParticipant,
    },
): void {
    state.participantsInfo = {
        ...state.participantsInfo,
        [payload.participant.id]: {
            ...payload.participant,
        },
    };
}

/**
 * Removes participant call data.
 *
 * @param state                         Call Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of participant data of which should
 *                                      be removed.
 */
export function removeCallParticipantData(
    state: CallState,
    payload: {
        id: string,
    },
): void {
    delete state.participantsInfo[payload.id];
}


/**
 * Sets call participants info.
 *
 * @param state                         Call Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.participants          Call participants information.
 */
export function setParticipantsInfo(
    state: CallState,
    payload: {
        participants: Record<string, CallParticipant>,
    },
): void {
    state.participantsInfo = payload.participants;
}

/**
 * Sets call type.
 *
 * @param state                         Call Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.type                  Call type.
 */
export function setType(
    state: CallState,
    payload: {
        type: CallType,
    },
): void {
    state.type = payload.type;
}

/**
 * Sets call state.
 * Also, enables and disables call ringing on specific call states.
 *
 * @param state                         Call Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.state                 New call state to be set.
 */
export function setState(
    state: CallState,
    payload: {
        state: CallStates,
    },
): void {
    /**
     * Starts phone vibration and call sound.
     */
    function startVibration(): void {
        const vibrationFunction = (): boolean => navigator.vibrate(1000);
        state.vibrateInterval = setInterval(vibrationFunction, 3000);
        state.ring = new Audio('https://bigsoundbank.com/UPLOAD/mp3/1614.mp3');
        state.ring.volume = 0.1;
        state.ring.play();
    }

    /**
     * Stops phone vibration and call sound.
     */
    function stopVibration(): void {
        clearInterval(state.vibrateInterval);
        state.ring.pause();
    }


    if( state.state === CallStates.AWAITING
        && payload.state !== CallStates.AWAITING
    ) {
        stopVibration();
    } else if (
        state.state !== CallStates.AWAITING
        && payload.state === CallStates.AWAITING
    ) {
        startVibration();
    }

    state.state = payload.state;
}

/**
 * Sets `hasIncomingCall` indicator state.
 * Also, toggle incoming call sound and vibration based om new
 * `hasIncomingCall` state.
 *
 * @param state                         Call Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.hasIncomingCall       Indicator, whether user has incoming
 *                                      call.
 */
export function setHasIncomingCallState(
    state: CallState,
    payload: {
        hasIncomingCall: boolean,
    },
): void {
    /**
     * Starts vibration and audio track.
     */
    const startVibration = () => {
        state.vibrateInterval =
            setInterval(() => navigator.vibrate(1000), 3000);
        state.ring = new Audio('https://www.soundjay.com/phone/sounds/telephone-ring-04.mp3');
        state.ring.volume = 0.2;
        state.ring.play();
    };

    /**
     * Stops vibration and audio track.
     */
    const stopVibration = () => {
        clearInterval(state.vibrateInterval);
        if(state.ring) {
            state.ring.pause();
        }
    };

    payload.hasIncomingCall
        ? startVibration()
        : stopVibration();

    state.hasIncomingCall = payload.hasIncomingCall;
}

/**
 * Sets `isMinified` indicator state.
 *
 * @param state                         Call Vuex State.
 * @param payload                       Mutation parameters.
 * @param payload.isMinified            Indicator whether call is minified.
 */
export function setIsMinified(
    state: CallState,
    payload: {
        isMinified: boolean,
    },
): void {
    state.isMinified = payload.isMinified;
}

/**
 * Adds room to list of live rooms.
 *
 * @param state                         Call Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of the room to be added to the list
 *                                      of live rooms.
 * @param payload.ids                   List of live rooms IDs to be added.
 */
export function addLiveRoom(
    state: CallState,
    payload: {
        id: string,
        ids: string,
    },
): void {
    if(payload.ids && payload.ids.length) {
        state.liveRooms = state.liveRooms.concat(payload.ids);
    } else if(payload.id) {
        state.liveRooms.push(payload.id);
    }
}

/**
 * Removes room from the list of live rooms.
 *
 * @param state                         Call Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of the room to be removed
 *                                      from list of live rooms.
 * @param payload.all                   Indicator whether live rooms list should
 *                                      be erased.
 */
export function removeLiveRoom(
    state: CallState,
    payload: {
        id: string,
        all?: boolean,
    },
): void {
    if (payload.all === true) {
        state.liveRooms = [];
        return;
    }

    state.liveRooms = state.liveRooms.filter(roomId => roomId !== payload.id);
}

/**
 * Sets call start time.
 *
 * @param state                         Call Vuex Module.
 * @param payload                       Mutation parameters.
 * @param payload.startTime             Call start time to be set.
 */
export function setCallStartTime(
    state: CallState,
    payload: {
        startTime: number,
    },
): void {
    state.startTime = payload.startTime;
}

/**
 * Sets current call room ID.
 *
 * @param state                         Call Vuex state.
 * @param payload                       Mutation parameters.
 * @param.id                            ID of the room to be set.
 */
export function setRoomId(
    state: CallState,
    payload: {
        id: string,
    },
): void {
    state.roomId = payload.id;
}

/**
 * Sets `isScreenSharingActive` indicator state.
 *
 * @param state                         Call Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.isActive              Indicator whether current app user's
 *                                      screen is being shared.
 * @param payload.id                    ID of the user to change screen sharing
 *                                      state.
 */
export function setIsScreenSharingActive(
    state: CallState,
    payload: {
        isActive: boolean,
        id: string,
    } = {
        id: 'self',
        isActive: false,
    },
): void {
    state.participantsInfo[payload.id] = {
        ...state.participantsInfo[payload.id],
        isScreenSharingActive: payload.isActive,
    };
}

/**
 * Initiates new instance of call manager.
 *
 * @param state                         Call Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of the current app user.
 */
export function initCallManager(
    state: CallState,
    payload: {
        id: string,
    },
): void {
    state.callManager = new CallManager(payload.id);
}

/**
 * Initiates new instance of room.
 *
 * @param state                         Call Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.room                  New room instance.
 */
export function initNewRoom(
    state: CallState,
    payload: {
        room: RoomHandle,
    },
): void {
    state.room = payload.room;
}

/**
 * Wipes call data.
 *
 * @param state                         Call Vuex state.
 */
export function wipeCallData(
    state: CallState,
): void {
    state.roomId = '';
    state.otherParticipants = [];
    state.participantsInfo = {};
    state.state = CallStates.NONE;
    state.areControlsButtonsBlocked = false;
    state.areCallButtonsBlocked = false;
}

export default {
    addCallParticipant,
    addCallParticipantData,
    addLiveRoom,
    addUserTrack,
    clearTracks,
    initCallManager,
    initNewRoom,
    muteUserStream,
    newJason,
    refreshTracks,
    removeCallParticipant,
    removeCallParticipantData,
    removeLiveRoom,
    setActiveDevice,
    setButtonsBlockState,
    setCallStartTime,
    setControlButtonsBlockState,
    setDevicesInfo,
    setHasFrontalCamera,
    setHasIncomingCallState,
    setIsMinified,
    setIsScreenSharingActive,
    setParticipantsInfo,
    setRoomId,
    setState,
    setType,
    updateCallParticipantStatus,
    updateConnectionQualityScore,
    updateLocalTracks,
    wipeCallData,
} as MutationTree<CallState>;
