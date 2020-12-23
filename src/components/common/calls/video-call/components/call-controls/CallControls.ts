import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import {
    CallParticipant,
    CallParticipantStatus,
} from 'models/CallParticipant.ts';
import { MediaCaptureDevice } from 'models/MediaCaptureDevice';

import CallModule from 'store/modules/call';
import GeneralParameters from 'store/modules/general-parameters';

import {
   TOGGLE_AUDIO,
    TOGGLE_SCREEN_SHARING,
    TOGGLE_VIDEO,
} from 'store/modules/call/actions';
import {
    GET_ARE_CONTROLS_BUTTONS_BLOCKED,
    GET_AUDIO_DEVICES,
    GET_HAS_FRONTAL_CAMERA,
    GET_PARTICIPANT_DATA_BY_ID,
    GET_PARTICIPANTS_INFO,
    GET_VIDEO_DEVICES,
} from 'store/modules/call/getters';
import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';

import CallIcon from 'components/icons/CallIcon.vue';
import MicrophoneIcon from 'components/icons/MicrophoneIcon.vue';
import RotateIcon from 'components/icons/RotateIcon.vue';
import ScreenSharingIcon from 'components/icons/ScreenSharingIcon.vue';
import VideoCameraIcon from 'components/icons/VideoCameraIcon.vue';


const callModule = namespace(CallModule.vuexName);
const generalParameters = namespace(GeneralParameters.vuexName);

/**
 * Component allowing user to control his audio and video devices mute states.
 */
@Component({
    components: {
        'call-icon': CallIcon,
        'microphone-icon': MicrophoneIcon,
        'rotate-icon': RotateIcon,
        'screen-sharing-icon': ScreenSharingIcon,
        'video-camera-icon': VideoCameraIcon,
    },
})
export default class CallControls extends Vue {
    /**
     * Indicator whether call is in loading state.
     */
    @Prop({ required: true }) isLoading: boolean;

    /**
     * Indicator whether fullscreen is enabled.
     */
    @Prop({ required: true }) isFullscreenEnabled: boolean;

    /**
     * Indicator whether mobile mode is active.
     */
    @generalParameters.Getter(IS_MOBILE_MODE)
    public isNativeMobileMode: boolean;

    /**
     * Indicator whether force mobile mode is active.
     */
    @generalParameters.Getter(IS_FORCE_MOBILE_MODE)
    public isForceMobileMode: boolean;

    /**
     * Indicator whether user's device has frontal camera.
     */
    @callModule.Getter(GET_HAS_FRONTAL_CAMERA)
    public hasFrontalCamera: boolean;

    /**
     * Gets participant call-data by id.
     */
    @callModule.Getter(GET_PARTICIPANT_DATA_BY_ID)
    public getParticipantDataById: (payload: {id: string}) => CallParticipant;

    /**
     * User's video devices available.
     */
    @callModule.Getter(GET_VIDEO_DEVICES)
    public videoDevices: MediaCaptureDevice[];

    /**
     * User's audio devices available.
     */
    @callModule.Getter(GET_AUDIO_DEVICES)
    public audioDevices: MediaCaptureDevice[];

    /**
     * Indicator whether block buttons are blocked.
     */
    @callModule.Getter(GET_ARE_CONTROLS_BUTTONS_BLOCKED)
    public areButtonsBlocked: boolean;

    /**
     * Call participants info.
     */
    @callModule.Getter(GET_PARTICIPANTS_INFO)
    public participantsInfo: Record<string, CallParticipant>;

    /**
     * Indicator whether is shade display button should be visible.
     */
    public get isShareDisplayButtonVisible(): boolean {
        return 'mediaDevices' in navigator
            && 'getDisplayMedia' in navigator.mediaDevices;
    }

    /**
     * Indicator whether user has screen sharing enabled.
     */
    public get isScreenSharingActive(): boolean {
        return this.participantsInfo.self.isScreenSharingActive;
    }

    /**
     * Indicator whether mobile mode is active.
     */
    public get isMobileMode(): boolean {
        return this.isNativeMobileMode || this.isForceMobileMode;
    }

    /**
     * Self call-data.
     */
    public get selfCallParticipantData(): CallParticipant | null {
        return this.getParticipantDataById({ id: 'self' }) || {
            isAudioMuted: true,
            isVideoMuted: true,
            status: CallParticipantStatus.LOADING,
            stream: null,
            tracks: { audio: [], video: [] },
        };
    }

    /**
     * Toggles audio translation.
     */
    @callModule.Action(TOGGLE_AUDIO)
    public toggleAudio: () => Promise<void>;

    /**
     * Toggles video translation.
     */
    @callModule.Action(TOGGLE_VIDEO)
    public toggleVideo: () => Promise<void>;

    /**
     * Toggles screen sharing.
     */
    @callModule.Action(TOGGLE_SCREEN_SHARING)
    public toggleScreenSharingAction: () => Promise<void>;

    /**
     * Toggles screen sharing. Brights user back to fullscreen mode in case
     * it was dropped by browser's popup.
     */
    public toggleScreenSharing(): void {
        const isFullScreen = this.isFullscreenEnabled;
        if(isFullScreen) {
            this.$emit('lock-controls');
        }
        this.toggleScreenSharingAction()
            .then(() => {
                if (!this.isFullscreenEnabled && isFullScreen) {
                    this.$emit('open-full-screen');
                    this.$emit('unlock-controls');
                }
            });
    }

    /**
     * Emits `end-call` event to end the ongoing call.
     */
    public endCall(): void {
        this.$emit('end-call');
    }

    /**
     * Toggles camera between front and back.
     */
    public rotateCamera(): void {
        // TODO: rework this according to medea.
    }
}
