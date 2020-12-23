import { MediaTrack } from 'medea-jason';
import { GetterTree } from 'vuex';

import { CallStates, CallType } from 'models/Call.ts';
import {
    CallParticipant,
    CallParticipantStatus,
} from 'models/CallParticipant.ts';
import { MediaCaptureDevice } from 'models/MediaCaptureDevice';

import CallState from 'store/modules/call/state';
import RootState from 'store/root/state';


/**
 * Name of call state getter.
 */
export const GET_CALL_STATE: string = 'callState';

/**
 * Name of call type getter.
 */
export const GET_CALL_TYPE: string = 'type';

/**
 * Name of participants info getter.
 */
export const GET_PARTICIPANTS_INFO: string = 'getParticipantsInfo';

/**
 * Name of loading timeout.
 */
export const GET_LOADING_TIMEOUT: string = 'getLoadingTimeout';

/**
 * Name of video devices getter.
 */
export const GET_VIDEO_DEVICES: string = 'getVideoDevices';

/***
 * Name of audio devices getter.
 */
export const GET_AUDIO_DEVICES: string = 'getAudioDevices';

/**
 * Name of start time getter.
 */
export const GET_START_TIME: string = 'getStartTime';

/**
 * Name of `hasIncomingCall` getter
 */
export const HAS_INCOMING_CALL: string = 'hasIncomingCall';

/**
 * Name of room ID getter.
 */
export const GET_ROOM_ID: string = 'getRoomId';

/**
 * Name of is minified getter.
 */
export const GET_IS_MINIFIED: string = 'getIsMinified';

/**
 * Name of `hasFrontalCamera` getter.
 */
export const GET_HAS_FRONTAL_CAMERA: string = 'getHasFrontalCamera';

/**
 * Name of users amount getter.
 */
export const GET_USERS_AMOUNT: string = 'getUsersAmount';

/**
 * Name of participants data by ID getter.
 */
export const GET_PARTICIPANT_DATA_BY_ID: string = 'getParticipantDataById';

/**
 * Name of other call participants getter.
 */
export const GET_OTHER_CALL_PARTICIPANTS: string = 'otherParticipants';

/**
 * Name of live rooms IDs getter.
 */
export const GET_LIVE_ROOMS_IDS: string = 'getLiveRoomsIds';

/**
 * Name of `isScreenSharingActive` getter.
 */
export const GET_IS_SCREEN_SHARING_ACTIVE: string = 'isScreenSharingActive';

/**
 * Name of buttons block state getter.
 */
export const GET_BUTTONS_BLOCK_STATE: string = 'getButtonsBlockState';

/**
 * Name of controls buttons block state getter.
 */
export const GET_ARE_CONTROLS_BUTTONS_BLOCKED: string =
    'areControlButtonsBlocked';

/**
 * Name of get connection quality score.
 */
export const GET_CONNECTION_QUALITY_SCORE: string = 'getConnectionQualityScore';

/**
 * Returns connection quality score.
 *
 * @param state                         Vuex Call state.
 */
export function getConnectionQualityScore(
    state: CallState,
): number {
    return state.connectionQualityScore;
}

/**
 * Returns controls buttons block state.
 *
 * @param state                         Vuex Call state.
 */
export function areControlButtonsBlocked(
    state: CallState,
): boolean {
    return state.areControlsButtonsBlocked;
}

/**
 * Returns call buttons block state.
 *
 * @param state                         Vuex Call state.
 */
export function getButtonsBlockState(
    state: CallState,
): boolean {
    return state.areCallButtonsBlocked;
}

/**
 * Returns list of live rooms IDs.
 *
 * @param state                         Call Vuex state.
 */
export function getLiveRoomsIds(
    state: CallState,
): string[] {
    return state.liveRooms;
}

/**
 * Return audio tracks of user with provided ID.
 *
 * @param state                         Vuex call state.
 */
export function getAudioTracks(
    state: CallState,
): (payload: { id: string }) => MediaTrack[] {
    return (payload: { id: string }) => {
        return state.participantsInfo[payload.id].tracks.audio.filter(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            track => track.ptr > 0,
        );
    };
}


/**
 * Returns video tracks of user with provided ID.
 *
 * @param state                         Vuex call state.
 */
export function getVideoTracks(
    state: CallState,
): (payload: { id: string }) => MediaTrack[] {
    return (payload: { id: string }) => {
        if(!state.participantsInfo[payload.id]) return [];
        return state.participantsInfo[payload.id].tracks.video.filter(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            track => track.ptr > 0,
        );
    };
}

/**
 * Returns ongoing call users amount.
 *
 * @param state                         Call Vuex state.
 */
export function getUsersAmount(state: CallState): {
    active: number,
    total: number,
} {
    return {
        active: state.otherParticipants.filter(p =>
            p.status === CallParticipantStatus.ACTIVE
            || p.status === CallParticipantStatus.LOADING,
        ).length + 1,
        total: state.otherParticipants.length + 1,
    };
}

/**
 * Returns `true` if device has frontal camera.
 *
 * @param state                         Call Vuex state.
 */
export function getHasFrontalCamera(state: CallState): boolean {
    return !!state.hasFrontalCamera;
}

/**
 * Returns call start time.
 *
 * @param state                         Call Vuex state.
 */
export function getStartTime(state: CallState): number {
    return state.startTime;
}

/**
 * Returns list of all available video devices.
 *
 * @param state                         Call Vuex state.
 */
export function getVideoDevices(state: CallState): MediaCaptureDevice[] {
    return state.videoDevices;
}

/**
 * Returns list of all available audio devices.
 *
 * @param state                         Call Vuex state.
 */
export function getAudioDevices(state: CallState): MediaCaptureDevice[] {
    return state.audioDevices;
}

/**
 * Returns loading timeout duration.
 *
 * @param state                         Call Vuex state,
 */
export function getLoadingTime(state: CallState): number {
    return state.loadingTimeout;
}

/**
 * Returns current call participants info.
 *
 * @param state                         Call Vuex state.
 */
export function getParticipantsInfo(state: CallState): Record<
    string,
    CallParticipant
> {
    return { ...state.participantsInfo };
}

/**
 * Returns active call room ID.
 *
 * @param state                         Call Vuex state.
 */
export function getRoomId(state: CallState): string {
    return state.roomId;
}

/**
 * Returns current call state.
 *
 * @param state                         Call Vuex state.
 */
export function callState(state: CallState): CallStates {
    return state.state;
}

/**
 * Returns `true` if call is minified.
 *
 * @param state                         Call Vuex state.
 */
export function getIsMinified(state: CallState): boolean {
    return state.isMinified;
}

/**
 * Returns list of other non-disconnected call participants.
 *
 * @param state                         Call Vuex state.
 */
export function otherParticipants(
    state: CallState,
): Array<{
    id: string,
    status: CallParticipantStatus,
}> {
    return state.otherParticipants.filter(
        p => p.status !== CallParticipantStatus.DISCONNECTED,
    );
}

/**
 * Returns current call type.
 *
 * @param state                         Call Vuex state.
 */
export function type(state: CallState): CallType | null {
    return state.type;
}

/**
 * Returns `true` if user has incoming call.
 *
 * @param state                         Call Vuex state.
 */
export function hasIncomingCall(state: CallState): boolean {
    return state.hasIncomingCall;
}

/**
 * Returns participant data by ID.
 *
 * @param state                         Call Vuex state.
 */
export function getParticipantDataById(
    state: CallState,
): (payload: {id: string}) => CallParticipant | null {
    return (payload) => {
        return state.participantsInfo[payload.id] || null;
    };
}

/**
 * Returns `true` if screen sharing is active.
 *
 * @param state                         Call Vuex module.
 */
export function isScreenSharingActive(
    state: CallState,
): boolean {
    return state.isScreenSharingActive;
}


export default {
    areControlButtonsBlocked,
    callState,
    getAudioDevices,
    getAudioTracks,
    getConnectionQualityScore,
    getHasFrontalCamera,
    getIsMinified,
    getLiveRoomsIds,
    getParticipantDataById,
    getParticipantsInfo,
    getRoomId,
    getStartTime,
    getUsersAmount,
    getVideoDevices,
    getVideoTracks,
    hasIncomingCall,
    isScreenSharingActive,
    otherParticipants,
    type,
} as GetterTree<CallState, RootState>;
