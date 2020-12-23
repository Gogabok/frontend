import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { clamp } from 'utils/math';
import { MovementHandler, MovementHandlerData } from 'utils/moveHandler';
import { capitalize } from 'utils/strings';

import { CallType } from 'models/Call.ts';
import { Chat, ChatPartial } from 'models/Chat';
import { CurrentUser } from 'models/CurrentUser';
import { User } from 'models/User';

import CallModule from 'store/modules/call';
import GeneralParameters from 'store/modules/general-parameters';
import UserModule from 'store/modules/user';
import UsersModule from 'store/modules/users';

import { ACCEPT_CALL, DECLINE_CALL } from 'store/modules/call/actions';
import { GET_CALL_TYPE, GET_ROOM_ID } from 'store/modules/call/getters';
import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';
import { GET_USER_DATA } from 'store/modules/user/getters';
import {
    GET_USER_BY_CHAT_ID,
    GET_USER_BY_ID,
} from 'store/modules/users/getters';

import CallIcon from 'components/icons/CallIcon.vue';
import ChatsIcon from 'components/icons/Chats.vue';
import VideoCameraIcon from 'components/icons/VideoCameraIcon.vue';


const callModule = namespace(CallModule.vuexName);
const usersModule = namespace(UsersModule.vuexName);
const userModule = namespace(UserModule.vuexName);
const generalParameters = namespace(GeneralParameters.vuexName);

/**
 * Component, that displays incoming call.
 */
@Component({
    components: {
        'call-icon': CallIcon,
        'chats-icon': ChatsIcon,
        'video-camera-icon': VideoCameraIcon,
    },
})
export default class IncomingCall extends Vue {
    /**
     * ID of the group-chat/user that is calling.
     */
    @callModule.Getter(GET_ROOM_ID)
    public from: string;

    /**
     * Minimum gap between screen edge and call container.
     */
    private readonly MIN_BORDER_SPACING: number = 5;

    /**
     * Movement handler that handles container dragging.
     */
    public callMoveHandler: MovementHandler = new MovementHandler();

    /**
     * Capitalize class method to get access to it inside the template.
     */
    public capitalize: (payload: string) => string = capitalize;

    /**
     * Indicator whether messages container is visible.
     */
    public isVisibleMessages: boolean = false;

    /**
     * List of messages user can decline call with.
     */
    public replyMessages: string[] = [
        'I can\'t talk.',
        'I will call you back later.',
        'Please, call back later.',
        'Please, text me.',
    ];

    /**
     * Initial component settings.
     */
    public settings: {
        top: number,
        right: number,
        width: number,
        height: number,
    } = {
        height: 510,
        right: 300,
        top: 5,
        width: 5,
    }

    /**
     * Gets user by it's ID.
     */
    @usersModule.Getter(GET_USER_BY_ID)
    public getUserDataById: (payload: {id: string}) => User | Chat;

    /**
     * Call type `audio` or `video`.
     */
    @callModule.Getter(GET_CALL_TYPE)
    public callType: CallType;

    /**
     * Current app user information.
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
     * Gets user by it's chat ID.
     */
    @usersModule.Getter(GET_USER_BY_CHAT_ID)
    public getUserByChatId: (payload: {id: string}) => User;

    /**
     * Indicator whether mobile mode is active (whether it's native or forced).
     */
    public get isMobileMode(): boolean {
        return this.isForceMobileMode || this.isNativeMobileMode;
    }

    /**
     * Information about the caller.
     */
    public get callerData(): User | Chat {
        return this.getUserByChatId({ id: this.from }) || {};
    }

    /**
     * List of avatars of call participants.
     */
    public get avatars(): string[] {
        const avatars: string[] = [];
        const defaultAvatar = require('~assets/img/default_avatar.svg'); // eslint-disable-line

        if (this.callerData.type === 'group') {
            if (this.callerData.avatarPath) {
                avatars.push(this.callerData.avatarPath);
                return avatars;
            }
            (this.callerData as unknown as ChatPartial).participants.forEach(
                (p: string) => {
                    const user = this.getUserDataById({ id: p });
                    avatars.push(user.avatarPath || defaultAvatar);
                },
            );
        } else {
            avatars.push((<User>this.callerData).avatarPath || defaultAvatar);
        }
        return avatars;
    }

    /**
     * Label to be displayed about the caller.
     */
    public get fromLabel(): string {
        return this.callerData.name || this.callerData.num;
    }

    /**
     * Accepts incoming call and joins the room.
     */
    @callModule.Action(ACCEPT_CALL)
    public acceptCallAction: () => Promise<void>;

    /**
     * Declines incoming call.
     */
    @callModule.Action(DECLINE_CALL)
    public declineCallAction: (payload?: {message: string}) => Promise<void>;

    /**
     * Changes call type.
     *
     * @param type                      Call type to change to.
     */
    public changeCallType(type: string): void {
        this.$emit('change-call-type', type);
    }

    /**
     * Accepts call.
     */
    public acceptCall(): void {
        localStorage.setItem('callPosition', JSON.stringify(this.settings));
        this.acceptCallAction();
        this.callMoveHandler.end();
    }

    /**
     * Declines call.
     *
     * @param event                     `mouse` or `touch` event.
     * @param message                   Message to decline call with.
     */
    public declineCall(event: TouchEvent | MouseEvent, message: string): void {
        this.callMoveHandler.end();
        // this.$emit('decline', message);
        this.declineCallAction({ message });
    }
    /**
     * Handles container dragging start.
     */
    public onContainerTouchStarted(): void {
        const bounds = this.$el.getBoundingClientRect().toJSON();

        this.settings = {
            height: bounds.height,
            right: window.innerWidth - bounds.right,
            top: bounds.top,
            width: bounds.width,
        };
    }

    /**
     * Moves container to current touch position.
     *
     * @param data                      Movement handler data.
     */
    public onContainerMove(data: MovementHandlerData): void {
        const movingCoordinates = {
            right: this.settings.right - data.diff.x,
            top: this.settings.top + data.diff.y,
        };

        const $el = this.$el as HTMLElement;
        const maxPosition = (type: 'height' | 'width' = 'width') =>
            window[type === 'width' ? 'innerWidth' : 'innerHeight']
            - $el[`client${capitalize(type[0])}`]
            - this.MIN_BORDER_SPACING;

        $el.style.right = `${clamp(
            movingCoordinates.right,
            this.MIN_BORDER_SPACING,
            maxPosition('width'),
        )}px`;

        $el.style.top = `${clamp(
            movingCoordinates.top,
            this.MIN_BORDER_SPACING,
            maxPosition('height'),
        )}px`;
    }

    /**
     * Saves current call position to settings..
     */
    public onContainerStopMovement(): void {
        const maxPosition = (type: 'height' | 'width' = 'width') =>
            window[`inner${capitalize(type)}`]
            - this.$el[`client${capitalize(type)}`]
            - this.MIN_BORDER_SPACING;

        const $el = this.$el as HTMLElement;

        this.settings.right = clamp(
            window.innerWidth - $el.offsetLeft - $el.clientWidth,
            this.MIN_BORDER_SPACING,
            maxPosition('width'),
        );

        this.settings.top = clamp(
            $el.offsetTop,
            this.MIN_BORDER_SPACING,
            maxPosition('height'),
        );
    }

    /**
     * Toggles message box visibility.
     */
    public openMessageBox(): void {
        this.isVisibleMessages = !this.isVisibleMessages;
    }

    /**
     * Declines call with message.
     *
     * @param text                      Text to send called on decline.
     * @param event                     `touch` or `mouse` event.
     */
    public declineCallWithMessage(
        event: TouchEvent | MouseEvent,
        text: string,
    ): void {
        this.declineCall(event, text);
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to add `callMoveHandler` events.
     */
    public mounted(): void {
        this.callMoveHandler.onStart(this.onContainerTouchStarted.bind(this));
        this.callMoveHandler.onMove(this.onContainerMove.bind(this));
        this.callMoveHandler.onEnd(this.onContainerStopMovement.bind(this));
    }
}
