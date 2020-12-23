import { MediaTrack } from 'medea-jason';
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { clamp } from 'utils/math';
import { capitalize } from 'utils/strings';

import { CallParticipant } from 'models/CallParticipant.ts';

import CallModule from 'store/modules/call';
import GeneralParameters from 'store/modules/general-parameters';

import {
    GET_IS_SCREEN_SHARING_ACTIVE,
    GET_PARTICIPANT_DATA_BY_ID,
} from 'store/modules/call/getters';
import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';

import MicrophoneIcon from 'components/icons/MicrophoneIcon.vue';


const generalParameters = namespace(GeneralParameters.vuexName);
const callModule = namespace(CallModule.vuexName);

/**
 * Floating window component displaying call participant's video.
 * Also, displays audio disabled state.
 */
@Component({
    components: {
        'microphone-icon': MicrophoneIcon,
    },
})
export default class FloatingWindow extends Vue {
    /**
     * ID of the user whose video should be displayed.
     */
    @Prop({ required: true }) id: string;

    /**
     * Indicator whether user is loading.
     */
    @Prop({ required: true }) isLoading: boolean;

    /**
     * Indicator whether call controls are visible.
     */
    @Prop({ required: true }) areControlsVisible: boolean;

    /**
     * Indicator whether call is minified.
     */
    @Prop({ required: true }) isMinified: boolean;

    /**
     * Minimum possible distance between floating window and call borders.
     */
    public readonly MIN_SPACING = 8;

    /**
     * Initial position.
     */
    public settings: {
        right: number,
        bottom: number,
    } = {
        bottom: 8,
        right: 8,
    }

    /**
     * Video stream to be played.
     */
    public videoStream: MediaStream | null = null;

    /**
     * Indicator whether window is being moved.
     */
    public isMoving: boolean = false;

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
     * Gets participant data by ID.
     */
    @callModule.Getter(GET_PARTICIPANT_DATA_BY_ID)
    public getParticipantDataById: (payload: {id: string}) => CallParticipant;

    /**
     * Indicator whether screen of the current app user is being shared.
     */
    @callModule.Getter(GET_IS_SCREEN_SHARING_ACTIVE)
    public isScreenSharingActive: boolean;

    /**
     * Indicator whether current app user's video is muted.
     */
    public get isSelfVideoMuted(): boolean {
        return this.getParticipantDataById({ id: 'self' }).isVideoMuted;
    }

    /**
     * List of active video tracks.
     */
    public get videoTracks(): MediaTrack[] {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this.callParticipant.tracks.video.filter(track => track.ptr > 0);
    }

    /**
     * Indicator whether mobile mode is active (whether native or forced).
     */
    public get isMobileMode(): boolean {
        return this.isNativeMobileMode || this.isForceMobileMode;
    }

    /**
     * Video element by ref.
     */
    public get video(): HTMLVideoElement | null {
        return this.$refs.video as HTMLVideoElement || null;
    }

    /**
     * Call participants call-related data.
     */
    public get callParticipant(): CallParticipant {
        return this.getParticipantDataById({ id: this.id }) || {
            hasAudioBeenActivated: false,
            hasVideoBeenActivated: false,
            id: this.id,
            isAudioMuted: false,
            isVideoMuted: true,
            stream: null,
            tracks: {
                audio: [],
                video: [],
            },
        };
    }

    /**
     * Indicator whether element is visible.
     */
    public get isVisible(): boolean {
        return this.callParticipant
            && !this.isSelfVideoMuted
            && !this.callParticipant.isScreenSharingActive;
    }

    /**
     * Watches for `isMinified` indicator changes to set element's transition.
     */
    @Watch('isMinified')
    watchIsMinified(): void {
        (this.$el as HTMLElement).style.transition = '';
    }

    /**
     * Updates call position.
     *
     * @param containerSize             New floating window size according to
     *                                  which position should be calculated.
     */
    public updatePosition(
        containerSize: {
            width: number,
            height: number,
        },
    ): void {
        const calcProp = (prop: string) => {
            const param =
                `client${capitalize(prop)}`;

            return containerSize[prop]
                - this.MIN_SPACING
                - this.$el[param];
        };


        this.settings.right = clamp(this.settings.right,15, calcProp('width'));
        this.settings.bottom = clamp(
            this.settings.bottom,
            15,
            calcProp('height'),
        );

        (this.$el as HTMLElement).style.right = `${this.settings.right}px`;
        (this.$el as HTMLElement).style.bottom = `${this.settings.bottom}px`;
    }

    /**
     * Updates video stream to only contain not more than one active video
     * track.
     *
     * @param tracks                    All user's video tracks.
     */
    @Watch('videoTracks', { immediate: true })
    public watchVideoTracks(tracks: MediaTrack[]): void {
        if(!tracks.length) {
            this.videoStream = null;
            return;
        }
        this.$nextTick(() => {
            this.videoStream = new MediaStream();
            for (const track of tracks) {
                if(track.enabled()) {
                    this.videoStream.addTrack(track.get_track());
                }
            }
            if (!this.$refs.video) return;
            (<HTMLVideoElement>this.$refs.video).srcObject = this.videoStream;
        });
    }

    /**
     * Updates video stream and position on visibility state change.
     *
     * @param isVisible                 Indicator whether element is visible.
     */
    @Watch('isVisible', { immediate: true })
    public watchIsVisible(isVisible: boolean): void {
        this.$nextTick(() => {
            if(!isVisible) return;
            const el = getComputedStyle(this.$el);
            this.settings.bottom = parseInt(el.bottom, 10);
            this.$parent.$on(
                'update-inner-video-position',
                this.updatePosition,
            );
            this.videoStream = new MediaStream();
            for(const track of this.callParticipant.tracks.video) {
                this.videoStream.addTrack(track.get_track());
            }
            (<HTMLVideoElement>this.$refs.video).srcObject = this.videoStream;
        });
    }
}
