import { Jason, RoomHandle } from 'medea-jason';

import { CallManager } from 'utils/CallManager';

import {
    CallStates,
    CallType,
} from 'models/Call';
import {
    CallParticipant,
    CallParticipantStatus,
} from 'models/CallParticipant';
import { MediaCaptureDevice } from 'models/MediaCaptureDevice';


/**
 * Call Vuex state.
 */
export default class CallState {
    /**
     * Call type - audio or video.
     */
    public type: CallType;

    /**
     * Websocket on which user will be notified about new calls.
     */
    public callManager: CallManager;

    /**
     * Call start time.
     */
    public startTime: number;

    /**
     * Websocket responsible for call itself.
     */
    public room: RoomHandle;

    /**
     * Medea client.
     */
    public jason: Jason;

    /**
     * Wasm package.
     */
    public rust;

    /**
     * Id of the currently active room.
     */
    public roomId;

    /**
     * Incoming/awaiting call audio track.
     */
    public ring: HTMLAudioElement;

    /**
     * Incoming/awaiting call ringtone interval.
     */
    public vibrateInterval: number;

    /**
     * Loading timeout.
     */
    public loadingTimeout: number;

    /**
     * List of available audio devices.
     */
    public audioDevices: MediaCaptureDevice[];

    /**
     * List of available video devices.
     */
    public videoDevices: MediaCaptureDevice[];

    /**
     * Indicator whether user has incoming call.
     */
    public hasIncomingCall: boolean;

    /**
     * Indicator whether user has frontal camera.
     */
    public hasFrontalCamera: boolean | null;

    /**
     * Connection quality score.
     */
    public connectionQualityScore: number;

    /**
     * List of call participants excepting current app user.
     */
    public otherParticipants: Array<{
        id: string,
        status: CallParticipantStatus,
    }>;

    /**
     * List of rooms which has ongoing calls.
     */
    public liveRooms: string[];

    /**
     * Participants information.
     */
    public participantsInfo: Record<string, CallParticipant>;

    /**
     * Indicator whether call is minified.
     */
    public isMinified: boolean;

    /**
     * Call state.
     */
    public state: CallStates;

    /**
     * Indicator whether call buttons are blocked by server.
     */
    public areCallButtonsBlocked: boolean;

    /**
     * Indicator whether controls buttons are blocked.
     */
    public areControlsButtonsBlocked: boolean;

    /**
     * Amount of milliseconds for which control buttons will be blocked.
     */
    public readonly CONTROL_BUTTONS_BLOCK_DURATION: number = 1000;

    /**
     * Creates call Vuex module, based on predefined class properties.
     */
    constructor() {
        this.state = CallStates.NONE;
        this.participantsInfo = {};
        this.otherParticipants = [];
        this.loadingTimeout = 300000;
        this.audioDevices = [];
        this.videoDevices = [];
        this.startTime = 0;
        this.type = CallType.Audio;
        this.hasIncomingCall = false;
        this.isMinified = false;
        this.hasFrontalCamera = null;
        this.roomId = '';
        this.liveRooms = [];
        this.areCallButtonsBlocked = false;
        this.areControlsButtonsBlocked = false;
        this.connectionQualityScore = 4;
    }
}
