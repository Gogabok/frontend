import { MediaSourceKind } from 'models/Call';
import { CallParticipant, CallParticipantStatus } from 'models/CallParticipant';
import { CurrentUser } from 'models/CurrentUser';
import { User } from 'models/User';
import {
    GET_IS_SCREEN_SHARING_ACTIVE,
    GET_PARTICIPANTS_INFO,
} from 'store/modules/call/getters';
import { GET_USER_DATA } from 'store/modules/user/getters';
import { GET_USER_BY_ID } from 'store/modules/users/getters';
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

import CallModule from 'store/modules/call';
import UsersModule from 'store/modules/users';
import UserModule from 'store/modules/user';

import MicrophoneIcon from 'components/icons/MicrophoneIcon.vue';
import { MediaTrack } from 'medea-jason';
import { namespace } from 'vuex-class';

const userModule = namespace(UserModule.vuexName);
const usersModule = namespace(UsersModule.vuexName);
const callModule = namespace(CallModule.vuexName);


/**
 * Component representing call participants on the footer.
 */
@Component({
    components: {
        'microphone-icon': MicrophoneIcon,
    },
})
export default class FooterCallParticipant extends Vue {
    /**
     * ID of the user to be represented.
     */
    @Prop({ required: true }) id: string;

    /**
     * Video stream.
     */
    public videoStream: null | MediaStream = null;

    /**
     * Audio stream.
     */
    public audioStream: null | MediaStream = null;

    /**
     * Call participants information.
     */
    @callModule.Getter(GET_PARTICIPANTS_INFO)
    public participantsInfo: { [id: string]: CallParticipant };

    /**
     * Returns user's account information by ID.
     */
    @usersModule.Getter(GET_USER_BY_ID)
    public getUserById: (payload: { id: string }) => User | null;

    /**
     * Current app user's account information.
     */
    @userModule.Getter(GET_USER_DATA)
    public currentUserData: CurrentUser;

    /**
     * Indicator whether screen sharing is active.
     */
    @callModule.Getter(GET_IS_SCREEN_SHARING_ACTIVE)
    public isScreenSharingActive: boolean

    /**
     * Call participant's information.
     */
    public get participant(): CallParticipant {
        const id = this.id.includes('-screen')
            ? this.id.split('-screen')[0]
            : this.id;
        return this.participantsInfo[id] || {
            callStatus: CallParticipantStatus.AWAITING,
            hasAudioBeenActivated: false,
            hasVideoBeenActivated: false,
            id: this.id,
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
     * User's avatar.
     */
    public get avatar(): { avatarPath: string, isDefault: boolean } {
        let avatar: string = '';
        let isDefault: boolean = false;
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const defaultAvatar = require('~assets/img/default_avatar.svg');

        const id = this.id.split('-screen')[0];
        if(id === 'self') {
            if (this.currentUserData.avatarPath) {
                avatar = this.currentUserData.avatarPath;
            } else {
                isDefault = true;
                avatar = defaultAvatar;
            }
        } else {
            const user = this.getUserById({ id });
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
                && track.media_source_kind() === (this.id.includes('-screen')
                ? MediaSourceKind.Display
                : MediaSourceKind.Device),
        ) || [];
    }

    /**
     * List of user's active audio tracks.
     */
    public get audioTracks(): MediaTrack[] {
        return this.id.includes('-screen')
            ? []
            : this.participant.tracks.audio.filter(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                track => track.ptr > 0,
            );
    }

    /**
     * Indicator whether video element should be visible instead of avatar.
     */
    public get isVideoActive(): boolean {
        return this.id.includes('-screen')
            ? this.participant.isScreenSharingActive
            : !this.participant.isVideoMuted;
    }

    /**
     * Video element by ref.
     */
    public get video(): HTMLVideoElement {
        return this.$refs.video as HTMLVideoElement;
    }

    /**
     * Audio element by ref.
     */
    public get audio(): HTMLAudioElement {
        return this.$refs.audio as HTMLAudioElement;
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
                    this.participant.isAudioMuted
                    || this.id === 'self'
                    || this.id.includes('-screen'),
                );
            });
        }
    }
}
