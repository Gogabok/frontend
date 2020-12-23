import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { CallType } from 'models/Call';
import { Chat } from 'models/Chat';

import CallModule from 'store/modules/call';
import GeneralParametersModule from 'store/modules/general-parameters';

import { CALL_TO, JOIN_CALL } from 'store/modules/call/actions';
import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';

import CallIcon from 'components/icons/CallIcon.vue';
import CheckedIcon from 'components/icons/CheckedIcon.vue';
import VideoCallIcon from 'components/icons/VideoCallIcon.vue';


const generalParameters = namespace(GeneralParametersModule.vuexName);
const callModule = namespace(CallModule.vuexName);

/**
 * Dialog header component containing interlocutor information, video and audio
 * call buttons.
 */
@Component({
    components: {
        'call-icon': CallIcon,
        'checked-icon': CheckedIcon,
        'video-call-icon': VideoCallIcon,
    },
})
export default class DialogHeader extends Vue {
    /**
     * Contact (person), dialog with which is being displayed.
     */
    @Prop() activeChat: Chat;

    /**
     * Amount of selected messages.
     */
    @Prop({
        default: 0,
        type: Number,
    }) selectedMessagesAmount;

    /**
     * Indicator whether user selected all messages.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) selectedMessagesLength;

    /**
     * Indicator whether select mode is active.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isSelectMode;

    /**
     * Indicator whether it is personal chat or group chat opened.
     */
    @Prop({
        default: 'chat',
        type: String,
    }) pageType;

    /**
     * Indicator whether all messages are selected.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isAllMessagesSelected;

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
     * Indicator whether mobile mode is active (whether it's force or mobile).
     */
    public get isMobileMode(): boolean {
        return this.isForceMobileMode || this.isNativeMobileMode;
    }

    /**
     * Joins ongoing call.
     */
    @callModule.Action(JOIN_CALL)
    public joinCallAction: (payload: {
        roomId: string,
        isVideoMuted: boolean,
        isAudioMuted: boolean,
    }) => Promise<void>;

    /**
     * Sets up user media devices settings and joins ongoing call.
     */
    public joinCall(): void {
        this.joinCallAction({
            isAudioMuted: false,
            isVideoMuted: true,
            roomId: this.activeChat.id,
        });
    }

    /**
     * Starts call with current chat users.
     */
    @callModule.Action(CALL_TO)
    public callTo: (payload: {
        type: CallType,
        id: string,
    }) => Promise<void>

    /**
     * Sets query parameters of the route to null to go back from dialog.
     */
    public handleBack(): void {
        this.$route.query.id && this.$router.replace({
            path: this.$route.path,
            query: {},
        });
    }

    /**
     * Emits an event to set select mode off.
     */
    public handleSelectCancel(): void {
        this.$emit('cancel-select');
    }

    /**
     * Emits an event to select all messages.
     */
    public handlerSelectAll(): void {
        this.$emit('select-all');
    }

    /**
     * Starts video call session.
     */
    public videoHandler(): void {
        this.callTo({
            id: this.$route.query.id as string,
            type: CallType.Video,
        });
    }

    /**
     * Starts audio call session.
     */
    public audioHandler(): void {
        this.callTo({
            id: this.$route.query.id as string,
            type: CallType.Audio,
        });
    }

    /**
     * Open chat settings.
     */
    public openChatSettings(): void {
        this.$emit('open-profile');
    }
}
