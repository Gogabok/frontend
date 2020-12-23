import { mixins } from 'vue-class-component';
import { Component, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { clamp } from 'utils/math';
import { MovementHandler, MovementHandlerData } from 'utils/moveHandler';
import { capitalize } from 'utils/strings';

import { CallStates } from 'models/Call';
import {
    CallParticipant,
    CallParticipantStatus,
} from 'models/CallParticipant.ts';
import { Chat } from 'models/Chat';
import { CurrentUser } from 'models/CurrentUser';
import {
    ContactsListPopup,
    ContactsListPopupState,
    IPopup,
    PopupAlign,
    PopupType,
} from 'models/PopupSettings';
import { User } from 'models/User';

import counter from 'mixins/counter.ts';
import filters from 'mixins/filters.ts';

import CallModule from 'store/modules/call';
import GeneralParametersModule from 'store/modules/general-parameters';
import PopupModule from 'store/modules/popup';
import UserModule from 'store/modules/user';
import UsersModule from 'store/modules/users';

import {
    ADD_CALL_PARTICIPANTS,
    CHANGE_AUDIO_DEVICE,
    CHANGE_VIDEO_DEVICE,
    END_CALL,
    SET_IS_MINIFIED,
} from 'store/modules/call/actions';
import {
    GET_CALL_STATE,
    GET_IS_MINIFIED,
    GET_LOADING_TIMEOUT,
    GET_OTHER_CALL_PARTICIPANTS,
    GET_PARTICIPANTS_INFO,
    GET_ROOM_ID,
    GET_START_TIME,
} from 'store/modules/call/getters';
import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';
import { ADD_POPUP } from 'store/modules/popup/actions';
import { GET_USER_DATA } from 'store/modules/user/getters';
import {
    GET_USER_BY_CHAT_ID,
    GET_USER_BY_ID,
} from 'store/modules/users/getters';

import PlusIcon from 'components/icons/PlusIcon.vue';

import CallControls from './components/call-controls/CallControls.vue';
import CallFooter from './components/call-footer/CallFooter.vue';
import CallHeader from './components/call-header/CallHeader.vue';
import CallInfo from './components/call-info/CallInfo.vue';
import CallParticipantElement from './components/call-participant/CallParticipant.vue';
import EndCallButton from './components/end-call-button/EndCallButton.vue';
import FloatingWindow from './components/floating-window/FloatingWindow.vue';
import ScreenVideo from './components/screen-video/ScreenVideo.vue';
import Settings from './components/settings/Settings.vue';


const callModule = namespace(CallModule.vuexName);
const generalParameters = namespace(GeneralParametersModule.vuexName);
const usersModule = namespace(UsersModule.vuexName);
const userModule = namespace(UserModule.vuexName);
const popupModule = namespace(PopupModule.vuexName);

/**
 * Video call component allowing user to see, hear its interlocutors.
 * Also, allows user to control his call settings.
 */
@Component({
    components: {
        'call-controls': CallControls,
        'call-footer': CallFooter,
        'call-header': CallHeader,
        'call-info': CallInfo,
        'call-participant': CallParticipantElement,
        'end-call-button': EndCallButton,
        'floating-window': FloatingWindow,
        'plus-icon': PlusIcon,
        'screen-video': ScreenVideo,
        'settings': Settings,
    },
    filters,
})
export default class VideoCall extends mixins(counter) {
    /**
     * Default settings for call window size and position.
     */
    private _settings: {
        top: number,
        right: number,
        width: number,
        height: number,
    } = {
        height: 510,
        right: 5,
        top: 5,
        width: 310,
    }

    /**
     * Minimum possible call height.
     */
    private readonly MIN_CALL_HEIGHT = 510;

    /**
     * Minimum possible call width.
     */
    private readonly MIN_CALL_WIDTH = 310;

    /**
     * Minimum possible distance between window edge and call container.
     */
    private MIN_BORDER_GAP = 5;

    /**
     * Indicator whether call is scaled to fullscreen.
     */
    public isFullscreen: boolean = false;

    /**
     * Indicator whether controls are visible.
     */
    public isVisibleControls: boolean = true;

    /**
     * Indicator whether add user interface is visible.
     */
    public isAddUsersInterfaceVisible: boolean = false;

    /**
     * Indicator whether settings are visible.
     */
    public isSettingsVisible: boolean = false;

    /**
     * Copy of `CallStates` enum to pass them to component template.
     */
    public callStates = CallStates;

    /**
     * Movement handler responsible for call dragging.
     */
    public moveHandler: MovementHandler = new MovementHandler();

    /**
     * Movement handler responsible for call resizing.
     */
    public resizeHandler: MovementHandler = new MovementHandler();

    /**
     * Movement handler responsible for call participant dragging.
     */
    public participantMoveHandler: MovementHandler = new MovementHandler();

    /**
     * Movement handler responsible for interface visibility.
     */
    public generalMovementHandler: MovementHandler = new MovementHandler();

    /**
     * Controls timeout function ID.
     */
    public controlsTimeout: number;

    /**
     * Amount of milliseconds that controls will be visible without any mouse
     * activity.
     */
    public readonly CONTROLS_DEFAULT_TIMEOUT: number = 5000;

    /**
     * Timestamp of last mouse activity.
     */
    public controlsTimeoutResetTimestamp: number;

    /**
     * List of users, which are displayed on main call window.
     */
    public mainWindowUsersIds: string[] = [];

    /**
     * Postfix for user's screen stream.
     * Used to separate user's device video stream from display stream.
     */
    public readonly SCREEN_POSTFIX: string = '-screen';

    /**
     * Indicator, whether call window is vertical oriented.
     */
    public isVerticalOriented = true;

    /**
     * Image to be displayed on ghost user.
     */
    public ghostUserImage: string = '';

    /**
     * Indicator whether ghost user is visible.
     */
    public isGhostUserVisible: boolean = false;

    /**
     * ID of the user to be displayed as  ghost user.
     */
    public ghostUserId: string = '';

    /**
     * Amount of time needed to trigger long tap event instead of click.
     */
    private TIME_TO_EVAL_LONG_TAP: number = 200;

    /**
     * Long tap timeout.
     */
    private longTapTimeout: number;

    /**
     * List of call states that mean that call has been ended.
     */
    public endedCallStates: CallStates[] = [
        CallStates.ENDED,
        CallStates.DECLINED,
        CallStates.BUSY,
        CallStates.FAILED_TO_CONNECT,
        CallStates.NO_RESPONSE,
    ];

    /**
     * Call states enum copy to get access to it from the template.
     */
    public CallStates: typeof CallStates = CallStates;

    /**
     * Loading timeout.
     */
    @callModule.Getter(GET_LOADING_TIMEOUT)
    public loadingTimeout: number;

    /**
     * Indicator whether mobile mode is active.
     */
    @generalParameters.Getter(IS_MOBILE_MODE)
    public isNativeMobileMode: boolean;

    /**
     * Indicator whether mobile mode is active.
     */
    @generalParameters.Getter(IS_FORCE_MOBILE_MODE)
    public isForceMobileMode: boolean;

    /**
     * Indicator whether call is minified.
     */
    @callModule.Getter(GET_IS_MINIFIED)
    public isMinified: boolean;

    /**
     * Current call state.
     */
    @callModule.Getter(GET_CALL_STATE)
    public callState: CallStates;

    /**
     * Participants information.
     */
    @callModule.Getter(GET_PARTICIPANTS_INFO)
    public participantsInfo: { [ id: string ]: CallParticipant }

    /**
     * Current room ID.
     */
    @callModule.Getter(GET_ROOM_ID)
    public roomId: string;

    /**
     * Call start time (in ms).
     */
    @callModule.Getter(GET_START_TIME)
    public callStartTime: number;

    /**
     * Other call participants.
     */
    @callModule.Getter(GET_OTHER_CALL_PARTICIPANTS)
    public otherCallParticipants: Array<{
        id: string,
        status: CallParticipantStatus,
    }>;

    /**
     * Gets user by its chat ID.
     */
    @usersModule.Getter(GET_USER_BY_CHAT_ID)
    public getUserByChatId: (payload: {id: string}) => User;

    /**
     * Gets user by it's ID.
     */
    @usersModule.Getter(GET_USER_BY_ID)
    public getUserById: (payload: { id: string }) => User | null;

    /**
     * Current app user information.
     */
    @userModule.Getter(GET_USER_DATA)
    public currentUserInfo: CurrentUser;

    /**
     * Ghost user element.
     */
    public get ghostUser(): HTMLElement {
        return this.$refs.ghostUser as HTMLElement;
    }

    /**
     * Indicator whether call has ended and with which status.
     */
    public get isCallEnded(): {
        isEnded: boolean,
        code: CallStates | null,
    } {
        const isEnded = this.endedCallStates.includes(this.callState);

        return {
            code: isEnded ? this.callState : null,
            isEnded,
        };
    }

    /**
     * Caller information.
     */
    public get callerData(): User | Chat {
        return this.getUserByChatId({ id: this.roomId });
    }

    /**
     * Indicator whether it's group call.
     */
    public get isGroupChat(): boolean {
        return this.callerData.type === 'group';
    }

    /**
     * Who the call is coming from.
     */
    public get callTitle(): string {
        return this.callerData.name || `&${this.callerData.num}`;
    }

    /**
     * List of visible participants.
     */
    public get visibleParticipants(): Array<{
        id: string,
        status: CallParticipantStatus,
    }> {
        return this.listOfParticipants.filter(p =>
            this.mainWindowUsersIds.includes(p.id),
        );
    }

    /**
     * Indicator whether users should be stacked on each other instead of grid
     * layout.
     */
    public get doStackParticipants(): boolean {
        return this.isVerticalOriented
            && this.mainWindowUsersIds.length === 2;
    }

    /**
     * List of participants to display.
     */
    public get listOfParticipants(): Array<{
        id: string,
        status: CallParticipantStatus,
    }> {
        const otherParticipants = [
            ...this.otherCallParticipants,
            {
                id: 'self',
                status: CallParticipantStatus.ACTIVE,
            },
        ];

        return otherParticipants.map(participant =>
            this.getParticipantById(participant.id).isScreenSharingActive
                ? [
                    participant,
                    {
                        id: participant.id + this.SCREEN_POSTFIX,
                        status: participant.status,
                    },
                ]
                : participant,
            )
            .flat();
    }

    /**
     * Indicator whether call is loading.
     */
    public get isLoading(): boolean {
        return this.callState === CallStates.LOADING
            || this.callState === CallStates.RECONNECTING
            || this.callState === CallStates.AWAITING;
    }

    /**
     * Indicator whether mobile mode is active (whether it's force of native).
     */
    public get isMobileMode(): boolean {
        if(this.$route.path.includes('video-call')) return false;
        return this.isForceMobileMode || this.isNativeMobileMode;
    }

    /**
     * Call container element.
     */
    public get callContainer(): HTMLElement {
        return this.$refs.callContainer as HTMLElement;
    }

    /**
     * Call container settings.
     */
    public get settings(): {
        top: number,
        right: number,
        width: number,
        height: number,
    } {
        const position = localStorage.getItem('callPosition');
        return position
            ? JSON.parse(position)
            : this._settings
                ? this._settings
                : {
                    height: 510,
                    right: 5,
                    top: 5,
                    width: 300,
                };
    }

    /**
     * Sets settings value.
     *
     * @param newSettings               New settings value.
     */
    public set settings(newSettings: {
        top: number,
        right: number,
        width: number,
        height: number,
    }) {
        this._settings = newSettings;
    }

    /**
     * Current app user's call information.
     */
    public get selfParticipant(): { id: string, status: CallParticipantStatus} {
        return { id: 'self', status: 3 };
    }

    /**
     * Ends ongoing call.
     */
    @callModule.Action(END_CALL)
    public endCallAction: () => Promise<void>

    /**
     * Sets call minified.
     */
    @callModule.Action(SET_IS_MINIFIED)
    public setIsMinified: (payload: { isMinified: boolean }) => Promise<void>;

    /**
     * Changes active video device.
     *
     * @param payload.id                Video device ID.
     */
    @callModule.Action(CHANGE_VIDEO_DEVICE)
    public changeVideoDevice: (payload: {id: string}) => Promise<void>;

    /**
     * Changes active audio device.
     *
     * @param payload.id                Audio device ID.
     */
    @callModule.Action(CHANGE_AUDIO_DEVICE)
    public changeAudioDevice: (payload: {id: string}) => Promise<void>;

    /**
     * Opens new popup.
     *
     * @param payload                   Action parameters.
     * @param payload.popup             Popup to be opened.
     */
    @popupModule.Action(ADD_POPUP)
    public addPopup: (payload: { popup: IPopup }) => Promise<void>;

    /**
     * Adds participants to the call.
     */
    @callModule.Action(ADD_CALL_PARTICIPANTS)
    public addParticipantsAction: (payload: { ids: string []}) => Promise<void>;

    /**
     * Opens contacts list popup.
     * Also, adds selected users to contact on resolve.
     */
    public showAddParticipantInterface(): void {
        this.addPopup({
            popup: new ContactsListPopup({
                confirmCallback: ({ selectedContacts }) => {
                    this.addParticipants(selectedContacts.map(user => user.id));
                },
                disabledContactsIds: this.listOfParticipants.map(p => p.id),
                id: `${new Date().getTime()}${PopupType.Contacts}`,
                settings: {
                    align: {
                        horizontal: PopupAlign.Center,
                        vertical: PopupAlign.Center,
                    },
                    position: {
                        bottom: 0,
                        left: 0,
                        right: 0,
                        top: 0,
                    },
                    type: PopupType.Contacts,
                },
                state: ContactsListPopupState.AddCallMember,
                textMessage: null,
            }),
        });
    }

    /**
     * Ends the ongoing call.
     * Also, exists fullscreen mode if it's active.
     */
    public endCall(): void {
        this.endCallAction();
        if (this.isFullscreen) this.closeNativeFullScreen();
    }

    /**
     * Gets participant by its ID.
     *
     * @param id                        ID of the user to get information of.
     */
    public getParticipantById(id: string): CallParticipant {
        return this.participantsInfo[id] || {
            callStatus: CallParticipantStatus.AWAITING,
            hasAudioBeenActivated: false,
            hasVideoBeenActivated: false,
            id,
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
     * Adds participant to the call.
     *
     * @param ids                       IDs of the users to call to.
     */
    public addParticipants(ids: string[]): void {
        this.addParticipantsAction({ ids });
    }

    /**
     * Sets selected audio device active.
     *
     * @param id                        ID of the audio device to be set active.
     */
    public selectAudioDevice(id: string): void {
        this.changeAudioDevice({ id });
    }

    /**
     * Sets selected video device active.
     *
     * @param id                        ID of the video device to be set active.
     */
    public selectVideoDevice(id: string): void {
        this.changeVideoDevice({ id });
    }

    /**
     * Sets settings visibility state.
     *
     * @param isVisible                 Indicator whether settings are visible.
     */
    public setSettingsVisibility(isVisible: boolean): void {
        this.isSettingsVisible = isVisible;
    }

    /**
     * Disabled incoming video.
     */
    public disableIncomingVideo(): void {
        // TODO: disable incoming video;
    }

    /**
     * Minifies call.
     * Also, adds transition for the call container.
     */
    public minifyCall(): void {
        if(!this.isMobileMode) return;

        this.setIsMinified({ isMinified: true });
    }

    /**
     * Opens native fullscreen mode.
     */
    public openNativeFullScreen(): void {
        const html = document.body;
        if (html.requestFullscreen) {
            html.requestFullscreen();
        } else if (html['msRequestFullscreen']) {
            html['msRequestFullscreen']();
        } else if (html['mozRequestFullScreen']) {
            html['mozRequestFullScreen']();
        } else if (html['webkitRequestFullscreen']) {
            html['webkitRequestFullscreen']();
        }
    }

    /**
     * Closes native fullscreen mode.
     */
    public closeNativeFullScreen(): void {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else {
            if (document['msExitFullscreen']) {
                document['msExitFullscreen']();
            } else if (document['mozCancelFullScreen']) {
                document['mozCancelFullScreen']();
            } else if (document['webkitExitFullscreen']) {
                document['webkitExitFullscreen']();
            }
        }
    }

    /**
     * Toggles fullscreen.
     */
    public fullScreenHandler(): void {
        document.fullscreenElement
            ? this.closeNativeFullScreen()
            : this.openNativeFullScreen();
    }

    /**
     * Synchronizes `isFullscreen` indicator state with native fullscreen state.
     */
    public fullScreenChangeHandler(): void {
        this.isFullscreen = !!document.fullscreenElement;
        const $el = this.$el as HTMLElement;
        if(this.isFullscreen) {
            this.MIN_BORDER_GAP = 0;
            $el.style.top = '0px';
            $el.style.right = '0px';
        } else {
            this.MIN_BORDER_GAP = 5;
            $el.style.top = `${this.settings.top}px`;
            $el.style.right = `${this.settings.right}px`;
        }
    }

    /**
     * Toggles controls visibility.
     */
    public toggleControlsVisibility(): void {
        if (this.isMinified) return;

        this.isVisibleControls = !this.isVisibleControls;
   }

    /**
     * Sets add user interface visibility state.
     *
     * @param isVisible                 Indicator whether add user interface
     *                                  is visible.
     */
    public setIsAddUsersInterfaceVisible(isVisible: boolean): void {
        this.isAddUsersInterfaceVisible = isVisible;
    }

    /**
     * Handles container dragging start.
     */
    public onMoveStart(): void {
        this.callContainer.style.cursor = 'grab';
    }

    /**
     * Handles container dragging.
     *
     * @param data                      Movement handler data.
     */
    public onMove(data: MovementHandlerData): void {
        const movingCoordinates = {
            right: this.settings.right - data.diff.x,
            top: this.settings.top + data.diff.y,
        };

        const $el = this.$el as HTMLElement;

        const calcProp = (prop) => {
            prop = prop.toString();
            const paramModifier = capitalize(prop);
            return window[`inner${paramModifier}`]
                - this.$el[`client${paramModifier}`]
                - this.MIN_BORDER_GAP;
        };

        $el.style.right = `${clamp(
            movingCoordinates.right,
            this.MIN_BORDER_GAP,
            calcProp('width'),
        )}px`;

        $el.style.top = `${clamp(
            movingCoordinates.top,
            this.MIN_BORDER_GAP,
            calcProp('height'),
        )}px`;
    }

    /**
     * Handles container dragging end.
     */
    public onMoveEnd(): void {
        this.settings.top =
            parseInt(this.callContainer.style.top, 10);
        this.settings.right =
            parseInt(this.callContainer.style.right, 10);

        this.callContainer.style.cursor = 'unset';
    }

    /**
     * Handles resize start.
     */
    public onResizeStart(): void {
        if(this.isMobileMode) return;
    }

    /**
     * Handles resize.
     *
     * @param data                      Movement handler data.
     */
    public onResize(data: MovementHandlerData): void {
        const $el = this.$el as HTMLElement;

        const calcProp = (prop) => {
            prop = prop.toString();
            const param = `inner${capitalize(prop.toString())}`;
            return window[param] - this.MIN_BORDER_GAP * 2;
        };

        const width = clamp(
            this.settings.width - data.diff.x,
            this.MIN_CALL_WIDTH,
            calcProp('width') - this.settings.right,
        );

        const height = clamp(
            this.settings.height + data.diff.y,
            this.MIN_CALL_HEIGHT,
            calcProp('height') - this.settings.top,
        );

        this.isVerticalOriented = height > width;

        $el.style.width =`${width}px`;
        $el.style.height =`${height}px`;

        this.$emit('resize');

        if(this.otherCallParticipants.length > 1) return;
        this.$emit('update-inner-video-position', {
            height: this.callContainer.clientHeight,
            width: this.callContainer.clientWidth,
        });
    }

    /**
     * Handles resize end.
     */
    public onResizeEnd(): void {
        this.settings.height = parseInt(
            this.callContainer.style.height,
            10,
        );
        this.settings.width = parseInt(this.callContainer.style.width, 10);
    }

    /**
     * Updates last mouse activity timestamp.
     * Hides call interface if it's been longer than `CONTROLS_DEFAULT_TIMEOUT`
     * ms ago.
     */
    public updateControlsTimeout(): void {
        if(new Date().getTime() - this.controlsTimeoutResetTimestamp
            < this.CONTROLS_DEFAULT_TIMEOUT * 0.8) return;

        this.controlsTimeoutResetTimestamp = new Date().getTime();
        if(this.controlsTimeout) {
            clearTimeout(this.controlsTimeout);
        }
        this.controlsTimeout = setTimeout(() => {
            this.controlsTimeout = NaN;
            this.isVisibleControls = false;
        }, this.CONTROLS_DEFAULT_TIMEOUT);
    }

    /**
     * Disables controls auto-hide mechanism.
     */
    public lockControlsVisibility(): void {
        clearTimeout(this.controlsTimeout);
    }

    /**
     * Enables controls auto-hide mechanism.
     */
    public unlockControlsVisibility(): void {
        this.updateControlsTimeout();
    }

    /**
     * Adds user to `mainWindowUsersIds` if it's not there yet.
     *
     * @param id                        ID of the user to be moved.
     */
    public addUserToMainWindow(id: string): void {
        if(!this.mainWindowUsersIds.includes(id)) {
            this.mainWindowUsersIds.push(id);
        }
    }

    /**
     * Removed user from `mainWindowUsersIds`.
     *
     * @param id                        ID of the user to moved.
     */
    public removeUserFromMainWindow(id: string): void {
        this.mainWindowUsersIds = this.mainWindowUsersIds.filter(
            _id => id !== _id,
        );
    }

    /**
     * Clears long tap timeout and removes `mouseup`|`touchend` event listener.
     * Also, toggles controls visibility.
     */
    public userTapFunction(): void {
        this.toggleControlsVisibility();
        clearTimeout(this.longTapTimeout);
        this.removeListeners();
    }

    /**
     * Removes `touchend` and `mouseup` events listeners.
     */
    public removeListeners(): void {
        window.removeEventListener('mouseup', this.userTapFunction);
        window.removeEventListener('touchend', this.userTapFunction);
    }

    /**
     * Updates ghost user's information.
     *
     * @param event                     Movement handler data.
     * @param id                        ID of the user to take data from.
     */
    public onUserMouseDown(event: MouseEvent | TouchEvent, id: string): void {
        event.stopPropagation();
        event.preventDefault();


        if(event.type.includes('mouse')) {
            window.addEventListener('mouseup', this.userTapFunction);
        } else {
            window.addEventListener('touchend', this.userTapFunction);
        }

        this.longTapTimeout = setTimeout(() => {
            this.participantMoveHandler.start(event);

            this.removeListeners();

            this.ghostUserId = id;
            if(id.includes(this.SCREEN_POSTFIX)) {
                id = id.split(this.SCREEN_POSTFIX)[0];
            }
            const user = id === 'self'
                ? this.currentUserInfo
                : this.getUserById({ id });

            this.ghostUserImage = user
                ? user.avatarPath
                : require('~assets/img/default_avatar.svg');
        }, this.TIME_TO_EVAL_LONG_TAP);
    }

    /**
     * Sets cursor to `grab`.
     * Also, updates `ghostUser` element position.
     *
     * @param data                      Movement handler data.
     */
    public onUserMoveStart(data: MovementHandlerData): boolean | void {
        (<HTMLElement>this.$el).style.cursor = 'grab';
        if (!this.isGhostUserVisible) this.isGhostUserVisible = true;
        this.$nextTick(() => {
            const ghostUser = this.$refs.ghostUser as HTMLElement;
            if(ghostUser) {
                ghostUser.style.cssText = `left: ${data.initialPosition.x
                }px; top: ${data.initialPosition.y}px`;
            }
        });
    }


    /**
     * Updates ghost user element position.
     *
     * @param data                      Movement handler data.
     */
    public onUserMove(data: MovementHandlerData): boolean | void {
        if ( data.diff.x**2 + data.diff.y**2 < 16) return;

        const ghostUser = this.$refs.ghostUser as HTMLElement;
        this.$nextTick(() => {
            if(ghostUser) {
                ghostUser.style.cssText = `left: ${data.currentPosition.x
                    }px; top: ${data.currentPosition.y}px`;
            }
        });
    }

    /**
     * Moves user to main window or to footer based on it's position on drop.
     * Also, clears ghost user element.
     *
     * @param data                      Movement handler data.
     */
    public onUserMoveEnd(data: MovementHandlerData): void {
        (<HTMLElement>this.$el).style.cursor = '';

        const footerBounds = ((<Vue>this.$refs.footer).$el)
            .getBoundingClientRect();
        const mainWindowBounds = (<HTMLElement>this.$refs.mainWindow)
            .getBoundingClientRect();


        if (
            data.currentPosition.x > footerBounds.left
            && data.currentPosition.x < footerBounds.right
            && data.currentPosition.y > footerBounds.top
            && data.currentPosition.y < footerBounds.bottom
        ) {
            this.removeUserFromMainWindow(this.ghostUserId);
        } else if (
            data.currentPosition.x > mainWindowBounds.left
            && data.currentPosition.x < mainWindowBounds.right
            && data.currentPosition.y > mainWindowBounds.top
            && data.currentPosition.y < mainWindowBounds.bottom
        ) {
            this.addUserToMainWindow(this.ghostUserId);
        }
        this.ghostUserImage = '';
        this.isGhostUserVisible = false;
        this.ghostUserId = '';
        if(this.ghostUser) {
            this.ghostUser.style.cssText = '';
        }
    }

    /**
     * Updates `additionalData.hasMovedFarEnough` value.
     *
     * @param data                      Movement handler data.
     * @param additionalData            Custom data provided to movement
     *                                  handler.
     */
    public onGeneralMove(
        data: MovementHandlerData,
        additionalData: Record<string, unknown>,
    ): void {
        if ( data.diff.x**2 + data.diff.y**2 >= 16) {
            additionalData.hasMovedFarEnough = true;
        }
    }

    /**
     * Expands call window if it's minified. Toggles controls visibility
     * otherwise.
     *
     * @param _                                 Movement handler data.
     * @param additionalData                    Custom data provided to movement
     *                                          handler.
     * @param additionalData.hasMovedFarEnough  Indicator whether user's
     *                                          pointer/touch has been moved
     *                                          for more than 5px since
     *                                          `mousedown`|`touchstart` event.
     */
    public onGeneralMoveEnd(
        _: MovementHandlerData, // eslint-disable-line
        additionalData: Record<string, unknown>,
    ): void {
        if(additionalData.hasMovedFarEnough) return;

        this.isMinified
            ? this.setIsMinified({ isMinified: false })
            : this.toggleControlsVisibility();
    }

    /**
     * Adds users' screen to main window, or removes it from there based on
     * current and prev participants information.
     *
     * @param newInfo                   New participants data.
     * @param oldInfo                   Old participants data.
     */
    @Watch('participantsInfo')
    public watchParticipantsInfo(
        newInfo: { [id: string]: CallParticipant },
        oldInfo: { [id: string]: CallParticipant },
    ): void {
        let oldUsers = Object.keys(oldInfo);
        Object.keys(newInfo).forEach(userId => {
            oldUsers = oldUsers.filter(id => id !== userId);
            if(!oldInfo[userId]) {
                this.addUserToMainWindow(userId);
                this.$emit('resize');
                return;
            }
            if( !oldInfo[userId].isScreenSharingActive
                && newInfo[userId].isScreenSharingActive
            ) {
                this.addUserToMainWindow(userId+this.SCREEN_POSTFIX);
                this.$emit('resize');
            } else if (
                !newInfo[userId].isScreenSharingActive
                && oldInfo[userId].isScreenSharingActive
            ) {
                this.removeUserFromMainWindow(userId+this.SCREEN_POSTFIX);
                this.$emit('resize');
            }
        });

        if(oldUsers.length) {
            this.$emit('resize');
            oldUsers.forEach(userId => {
                this.removeUserFromMainWindow(userId);
                if (oldInfo[userId].isScreenSharingActive) {
                    this.removeUserFromMainWindow(userId + this.SCREEN_POSTFIX);
                }
            });
        }
    }

    /**
     * Watches for `otherCallParticipants` to accordingly update
     * `mainWindowUsersIds`.
     *
     * @param newParticipants           New list of other call participants.
     * @param oldParticipants           Old lsit of other call participants.
     */
    @Watch('otherCallParticipants')
    watchOtherCallParticipants(
        newParticipants: Array<{ id: string, status: CallParticipantStatus }>,
        oldParticipants: Array<{ id: string, status: CallParticipantStatus }>,
    ): void {
        let participantsDiff = oldParticipants.map(p => p.id);

        newParticipants.forEach(participant => {
            participantsDiff = participantsDiff.filter(
                id => id !== participant.id,
            );
            const oldParticipant = oldParticipants.find(
                p => p.id === participant.id,
            );
            if (!oldParticipant ||(
                oldParticipant.status === CallParticipantStatus.DISCONNECTED
                && oldParticipant.status !== CallParticipantStatus.DISCONNECTED
            )) {
                this.addUserToMainWindow(participant.id);
                this.$emit('resize');
            } else if (
                oldParticipant.status !== CallParticipantStatus.DISCONNECTED
                && participant.status === CallParticipantStatus.DISCONNECTED
            ) {
                this.removeUserFromMainWindow(participant.id);
                this.$emit('resize');
            }
        });

        if (participantsDiff.length) {
            participantsDiff.forEach(id => {
                this.removeUserFromMainWindow(id);
                if(this.mainWindowUsersIds.includes(id + this.SCREEN_POSTFIX)) {
                    this.removeUserFromMainWindow(id + this.SCREEN_POSTFIX);
                }
                this.$emit('resize');
            });
        }
    }

    /**
     * Resizes call container on mobile mode change.
     *
     * @param isMobileMode              Indicator whether it's mobile mode.
     */
    @Watch('isMobileMode', { immediate: true })
    watchIsMobileMode(isMobileMode: boolean): void {
        this.MIN_BORDER_GAP = isMobileMode
            ? 0
            : 5;

        const settings = {
            bottom: isMobileMode ? '0' : 'unset',
            height: isMobileMode
                ? 'calc(var(--vh, 1vh) * 100)'
                : `${this.settings.height}px`,
            left: isMobileMode ? '0' : 'unset',
            right: isMobileMode ? '0' : `${this.settings.right}px`,
            top: isMobileMode ? '0' : `${this.settings.top}px`,
            width: isMobileMode ? '100vw' : `${this.settings.width}px`,
        };

       this.$nextTick(() => {
           const $el = this.$el as HTMLElement;
           if(!$el) return;
           Object.entries(settings).forEach(
               ([prop, value]) => $el.style[prop] = value);
       });
    }

    /**
     * Shows controls when call goes from active state to one of
     * `endedCallStates`
     *
     * @param newCallState              New call state.
     * @param oldCallState              Old call state.
     */
    @Watch('callState')
    private watchCallState(
        newCallState: CallStates,
        oldCallState: CallStates,
    ): void {
        if(
            this.endedCallStates.includes(newCallState)
            && !this.endedCallStates.includes(oldCallState)
        ) {
            this.isVisibleControls = true;
        }
    }

    /**
     * Changes call container size on fullscreen mode change.
     *
     * @param isFullScreen              Indicator whether fullscreen is active.
     */
    @Watch('isFullscreen')
    watchIsScaled(isFullScreen: boolean): void {
        const $el = this.$el as HTMLElement;

        $el.style.width = isFullScreen ? '100vw' : `${this.settings.width}px`;

        this.isVerticalOriented = isFullScreen
            ? window.innerWidth < window.innerHeight
            : this.settings.width < this.settings.height;

        $el.style.height = isFullScreen
            ? 'calc(var(--vh, 1vh) * 100)'
            : `${this.settings.height}px`;
        this.$emit('resize');
    }

    /**
     * Emits `resize` event.
     */
    @Watch('mainWindowUsersIds')
    watchMainWindowsUsersIds(): void {
        this.$emit('resize');
    }

    /**
     * Changes call container settings on `isMinified` state change.
     *
     * @param isMinified                Indicator whether call is minified.
     */
    @Watch('isMinified')
    watchIsMinified(isMinified: boolean): void {
        const duration = 400;
        const $el = this.$el as HTMLElement;
        $el.style.transition = `width ${duration}ms ease-in-out,
            height ${duration}ms ease-in-out,
            right ${duration}ms ease-in-out,
            top ${duration}ms ease-in-out,
            border-radius ${duration}ms ease-in-out`;
        setTimeout(() => $el.style.transition = '', duration * 1.1);

        if(isMinified) {
            this.settings.width = 127;
            this.settings.height = 178;

            $el.style.left = 'unset';
            $el.style.width = `${this.settings.width}px`;
            $el.style.height = `${this.settings.height}px`;

            this.settings.right = this.MIN_BORDER_GAP;
            this.settings.top = window.innerHeight - 55
                - this.settings.height
                - this.MIN_BORDER_GAP;

        } else {
            $el.style.width = '100vw';
            $el.style.height = 'calc(var(--vh, 1vh) * 100)';
            this.settings.right = 0;
            this.settings.top = 0;
        }
        $el.style.top = `${this.settings.top}px`;
        $el.style.right = `${this.settings.right}px`;
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to set current window position, based
     * on incoming call last position.
     * Also, adds `fullscreenchange` and `mousemove` events listeners.
     */
    public mounted(): void {
        const $el = this.$el as HTMLElement;

        this.moveHandler.onStart(this.onMoveStart.bind(this));
        this.moveHandler.onMove(this.onMove.bind(this));
        this.moveHandler.onEnd(this.onMoveEnd.bind(this));

        this.resizeHandler.onStart(this.onResizeStart.bind(this));
        this.resizeHandler.onMove(this.onResize.bind(this));
        this.resizeHandler.onEnd(this.onResizeEnd.bind(this));

        this.participantMoveHandler.onStart(this.onUserMoveStart.bind(this));
        this.participantMoveHandler.onMove(this.onUserMove.bind(this));
        this.participantMoveHandler.onEnd(this.onUserMoveEnd.bind(this));

        this.generalMovementHandler.onMove(this.onGeneralMove.bind(this));
        this.generalMovementHandler.onEnd(this.onGeneralMoveEnd.bind(this));


        const callPosition = localStorage.getItem('callPosition');
        if(callPosition) {
            this.settings = JSON.parse(callPosition);
            localStorage.removeItem('callPosition');
        }

        this.$nextTick(() => {
            if (!this.isMobileMode) {
                $el.style.right = `${this.settings.right}px`;
                $el.style.top = `${this.settings.top}px`;
                $el.style.width = `${this.settings.width}px`;
                $el.style.height = `${this.settings.height}px`;
            }
        });

        document.addEventListener(
            'fullscreenchange',
            this.fullScreenChangeHandler,
        );

        this.$el.addEventListener('mousemove', this.updateControlsTimeout);
        this.updateControlsTimeout();

        this.$nextTick(() => {
            this.mainWindowUsersIds = this.isGroupChat
                ? [
                    ...this.otherCallParticipants.map(({ id }) => id),
                    'self',
                ]
                : this.otherCallParticipants.map(({ id }) => id);
        });

        this.isVerticalOriented = this.settings.height > this.settings.width;
    }

    /**
     * Hooks `beforeDestroy` Vue lifecycle stage to remove `mousemove` and
     * `fullscreenchange` events listeners.
     */
    public beforeDestroy(): void {
        this.$el.removeEventListener('mousemove', this.updateControlsTimeout);
        document.removeEventListener(
            'fullscreenchange',
            this.fullScreenChangeHandler,
        );
    }
}
