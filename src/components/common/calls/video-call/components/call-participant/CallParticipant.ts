import { MediaTrack } from 'medea-jason';
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { MediaSourceKind } from 'models/Call';
import {
    CallParticipant,
    CallParticipantStatus,
} from 'models/CallParticipant';
import { ChatPartial } from 'models/Chat';
import { CurrentUser } from 'models/CurrentUser';
import { UserPartial } from 'models/User';

import CallModule from 'store/modules/call';
import GeneralParametersModule from 'store/modules/general-parameters';
import UserModule from 'store/modules/user';
import UsersModule from 'store/modules/users';

import {
    GET_IS_SCREEN_SHARING_ACTIVE,
    GET_PARTICIPANT_DATA_BY_ID,
} from 'store/modules/call/getters';
import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';
import { GET_USER_DATA } from 'store/modules/user/getters';
import { GET_RAW_USER_BY_ID } from 'store/modules/users/getters';

import MicrophoneIcon from 'components/icons/MicrophoneIcon.vue';


enum ObjectFitOption {
    Cover = 'cover',
    Contain = 'contain',
}

const usersModule = namespace(UsersModule.vuexName);
const callModule = namespace(CallModule.vuexName);
const userModule = namespace(UserModule.vuexName);
const generalParameters = namespace(GeneralParametersModule.vuexName);

/**
 * Component displaying call participant's video stream (or displays avatar, if
 * there is no video stream), and providing its audio stream or notifying others
 * call participants that audio stream is muted.
 */
@Component({
    components: {
        'microphone-icon': MicrophoneIcon,
    },
})
export default class CallParticipantElement extends Vue {
    /**
     * Call participant ID and status.
     */
    @Prop({ required: true }) data: {
        id: string,
        status: CallParticipantStatus,
    };

    /**
     * Indicator whether call is minified.
     */
    @Prop({ default: false }) isMinified: boolean;

    /**
     * Active video stream.
     */
    public videoStream: MediaStream | null = null;

    /**
     * Active audio stream.
     */
    public audioStream: MediaStream | null = null;

    /**
     * Gets user by ID.
     */
    @usersModule.Getter(GET_RAW_USER_BY_ID)
    public getUserById: (
        payload: {id: string}
    ) => ChatPartial | UserPartial | null;

    /**
     * Gets participant call-data by ID.
     */
    @callModule.Getter(GET_PARTICIPANT_DATA_BY_ID)
    public getParticipantDataById: (
        payload: {id: string},
    ) => CallParticipant | null;

    /**
     * Gets current account user data.
     */
    @userModule.Getter(GET_USER_DATA)
    public currentUserData: CurrentUser;

    /**
     * Indicator whether screen of the current app user is being shared.
     */
    @callModule.Getter(GET_IS_SCREEN_SHARING_ACTIVE)
    public isScreenSharingActive: boolean;

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
     * Indicator whether mobile mode is active (whether it's forced or native).
     */
    public get isMobileMode(): boolean {
        return this.isForceMobileMode || this.isNativeMobileMode;
    }

    /**
     * Indicator whether component is used to display current app user data.
     */
    public get isSelf(): boolean {
        return this.data.id === 'self';
    }

    /**
     * Indicator whether call participant is loading.
     */
    public get isLoading(): boolean {
        if(!this.callParticipantData) return true;
        return this.data.status === CallParticipantStatus.LOADING
            || this.data.status === CallParticipantStatus.AWAITING;
    }

    /**
     * Call participant account data.
     */
    public get userData(): UserPartial | ChatPartial | null {
        if(this.data.id === 'self') {
            return {
                ...this.currentUserData,
                type: 'person',
            };
        }
        return this.getUserById({ id: this.data.id });
    }

    /**
     * Call participant call-related data.
     */
    public get callParticipantData(): CallParticipant {
        return <CallParticipant>this.getParticipantDataById({
            id: this.data.id,
        }) || {
            callStatus: CallParticipantStatus.AWAITING,
            hasAudioBeenActivated: false,
            hasVideoBeenActivated: false,
            id: this.data.id,
            isAudioMuted: false,
            isScreenSharingActive: false,
            isVideoMuted: true,
            stream: null,
            tracks: {
                audio: [],
                video: [],
            },
        };
    }

    /**
     * List of user's active video tracks.
     */
    public get videoTracks(): MediaTrack[] {
        return this.callParticipantData.tracks.video.filter(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            track => track.ptr > 0
                && track.media_source_kind() !== MediaSourceKind.Display,
        );
    }

    /**
     * List of user's active audio tracks.
     */
    public get audioTracks(): MediaTrack[] {
        return this.callParticipantData.tracks.audio.filter(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            track => track.ptr > 0,
        );
    }

    /**
     * Video element by ref.
     */
    public get video(): HTMLVideoElement {
        return this.$refs.video as HTMLVideoElement;
    }

    /**
     * Video element by ref.
     */
    public get audio(): HTMLAudioElement {
        return this.$refs.audio as HTMLAudioElement;
    }

    /**
     * Sets video element `object-fit` property value.
     *
     * @param objectFit                     Value to be set.
     */
    public setObjectFit(objectFit: ObjectFitOption): void {
        this.video.style.objectFit = objectFit;
    }

    /**
     * Sets video element `object-fit` property value based on the amount of
     * content cropped via `cover` mode.
     */
    public updateVideoCrop(): void {
        const videoElementHeight = this.video.clientHeight;
        const videoElementWidth  = this.video.clientWidth;
        const originalVideoHeight = this.video.videoHeight;
        const originalVideoWidth = this.video.videoWidth;
        const isElementPortrait = videoElementWidth / videoElementHeight > 1;
        const isVideoPortrait = originalVideoWidth / originalVideoHeight > 1;
        const areSame = isVideoPortrait === isElementPortrait;

        const portraitContentCrop = () => {
            const actualVideoHeight = originalVideoHeight
                * videoElementWidth / originalVideoWidth;

            return 1.0 - videoElementHeight / actualVideoHeight;
        };

        const verticalContentCrop = () => {
            const actualVideoWidth = originalVideoWidth
                * videoElementHeight / originalVideoHeight;

            return 1.0 - videoElementWidth / actualVideoWidth;
        };

        const fixPortraitCrop = () => {
            portraitContentCrop() > 0.2
                ? this.setObjectFit(ObjectFitOption.Contain)
                : this.setObjectFit(ObjectFitOption.Cover);
        };

        const fixVerticalCrop = (cropOnMobile: boolean = false) => {
            return (cropOnMobile && this.isMobileMode)
                || verticalContentCrop() <= 0.2
                ? this.setObjectFit(ObjectFitOption.Cover)
                : this.setObjectFit(ObjectFitOption.Contain);
        };

        areSame === isVideoPortrait
            ? fixPortraitCrop()
            : fixVerticalCrop(areSame);
    }

    /**
     * Updates video stream to only consist of single active video track.
     *
     * @param tracks                        User's video tracks.
     */
    @Watch('videoTracks', { immediate: true })
    public watchVideoTracks(tracks: MediaTrack[]): void {
        if (!tracks.length) {
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
            if (!this.video) return;
            this.updateVideoCrop();
            const execFunction = () => {
                this.updateVideoCrop();
                this.video.removeEventListener('loadedmetadata', execFunction);
            };
            this.video.removeEventListener('loadedmetadata', execFunction);
            this.video.addEventListener('loadedmetadata', execFunction);

            this.video.srcObject = this.videoStream;
        });
    }

    /**
     * Updates audio stream.
     * Also, updates audio element's mute state.
     *
     * @param tracks                        User's audio tracks.
     */
    @Watch('audioTracks', { immediate: true })
    public watchAudioTracks(tracks: MediaTrack[]): void {
        if (!tracks.length) {
            this.audioStream = null;
            return;
        }
        this.audioStream = new MediaStream();
        for (const track of tracks) {
            this.audioStream.addTrack(track.get_track());
            this.$nextTick(() => {
                if (!this.audio) return;
                this.audio.srcObject = this.audioStream;
                this.audio.muted = Boolean(
                    this.callParticipantData.isAudioMuted
                    || this.data.id === 'self',
                );
            });
        }
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to set video crop mode.
     */
    mounted(): void {
        this.updateVideoCrop();

        const execFunction = () => {
            this.updateVideoCrop();
            this.video.removeEventListener('loadedmetadata', execFunction);
        };

        this.video.addEventListener('loadedmetadata', execFunction);

        this.$parent.$on('resize', this.updateVideoCrop);
    }
}
