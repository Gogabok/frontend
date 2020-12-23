import { MediaTrack } from 'medea-jason';
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { MediaSourceKind } from 'models/Call';
import { CallParticipant, CallParticipantStatus } from 'models/CallParticipant';
import { CurrentUser } from 'models/CurrentUser';
import { User } from 'models/User';

import CallModule from 'store/modules/call';
import GeneralParametersModule from 'store/modules/general-parameters';
import UsersModule from 'store/modules/users';
import UserModule from 'store/modules/user';

import {
    GET_PARTICIPANTS_INFO,
} from 'store/modules/call/getters';
import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';
import { GET_USER_DATA } from 'store/modules/user/getters';
import { GET_USER_BY_ID } from 'store/modules/users/getters';


enum ObjectFitOption {
    Cover = 'cover',
    Contain = 'contain',
}

const userModule = namespace(UserModule.vuexName);
const usersModule = namespace(UsersModule.vuexName);
const callModule = namespace(CallModule.vuexName);
const generalParameters = namespace(GeneralParametersModule.vuexName);

/**
 * Component, that display's call participant's screen when it's shared.
 */
@Component
export default class ScreenVideo extends Vue {
    /**
     * ID of the user to display screen of.
     */
    @Prop({ required: true }) id: string;

    /**
     * Video stream.
     */
    public videoStream: null | MediaStream = null;

    /**
     * Call participants information.
     */
    @callModule.Getter(GET_PARTICIPANTS_INFO)
    public participantsInfo: { [id: string]: CallParticipant };

    /**
     * Return user account information by it's ID.
     */
    @usersModule.Getter(GET_USER_BY_ID)
    public getUserById: (payload: { id: string }) => User | null;

    /**
     * Current app user data.
     */
    @userModule.Getter(GET_USER_DATA)
    public currentUserData: CurrentUser;

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
     * User, which should be represented by this component.
     */
    public get participant(): CallParticipant {
        return this.participantsInfo[this.id] || {
            callStatus: CallParticipantStatus.AWAITING,
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
     * Avatar of the user or default image in case user has no avatar.
     */
    public get avatar(): { avatarPath: string, isDefault: boolean } {
        let avatar: string = '';
        let isDefault: boolean = false;
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const defaultAvatar = require('~assets/img/default_avatar.svg');

        if(this.id === 'self') {
            if (this.currentUserData.avatarPath) {
                avatar = this.currentUserData.avatarPath;
            } else {
                isDefault = true;
                avatar = defaultAvatar;
            }
        } else {
            const user = this.getUserById({ id: this.id });
            if(user && user.avatarPath) {
                avatar = user.avatarPath;
            } else {
                avatar = defaultAvatar;
                isDefault = true;
            }
        }
        return { avatarPath: avatar , isDefault };
    }

    /**
     * List of user's active video tracks.
     */
    public get videoTracks(): MediaTrack[] {
        return this.participant.tracks.video.filter(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            track => track.ptr > 0
                && track.media_source_kind() === MediaSourceKind.Display,
        ) || [];
    }

    /**
     * Indicator whether video is active.
     */
    public get isVideoActive(): boolean {
        return !this.participant.isVideoMuted;
    }

    /**
     * Video element by ref.
     */
    public get video(): HTMLVideoElement {
        return this.$refs.video as HTMLVideoElement;
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
        if(!tracks) return;

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
