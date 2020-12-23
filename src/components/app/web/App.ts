import { Component, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import AppCore from '../App.core';

import { smoothTransition } from 'utils/animations';
import { clamp } from 'utils/math';
import { MovementHandler, MovementHandlerData } from 'utils/moveHandler';
import WebpackAsyncLoader from 'utils/WebpackAsyncLoader';

import { CallStates } from 'models/Call.ts';
import { IPopup, PopupType } from 'models/PopupSettings';

import CallModule from 'store/modules/call';
import ChatsModule from 'store/modules/chats';
import GeneralParameters from 'store/modules/general-parameters';
import PopupModule from 'store/modules/popup';
import UserModule from 'store/modules/user';

import {
    INIT_JASON,
    SETUP_NOTIFICATION_SOCKET,
} from 'store/modules/call/actions';
import {
    GET_CALL_STATE,
    GET_IS_MINIFIED, GET_ROOM_ID,
    HAS_INCOMING_CALL,
} from 'store/modules/call/getters';
import { FETCH_CHATS } from 'store/modules/chats/actions';
import { SET_MOBILE_MODE } from 'store/modules/general-parameters/actions';
import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';
import { GET_POPUPS } from 'store/modules/popup/getters';
import { FETCH_USER_DATA } from 'store/modules/user/actions';

const IncomingCall = () => import('components/common/calls/incoming-call/IncomingCall.vue');
const Call = () => import('components/common/calls/video-call/VideoCall.vue');
const ContactPreview = () => import('components/common/contact/contact-preview/ContactPreview.vue');
import BottomMenu from 'components/common/menu/bottom-menu/BottomMenu.vue';
import NotificationsList from 'components/common/notifications/notifications-list/NotificationsList.vue';
import TextAlert from 'components/common/popups/alert/Alert.vue';
import ConfirmComponent from 'components/common/popups/confirm/Confirm.vue';
import ContactsListPopup from 'components/common/popups/contact-list/ContactList.vue';
import ShareContainer from 'components/common/share/share-container/ShareContainer.vue';

import LeftSideMenu from './components/left-side-menu/LeftSideMenu.vue';


const generalParameters = namespace(GeneralParameters.vuexName);
const popupModule = namespace(PopupModule.vuexName);
const userModule = namespace(UserModule.vuexName);
const chatsModule = namespace(ChatsModule.vuexName);
const callModule = namespace(CallModule.vuexName);

/**
 * Base application component that contains general properties of all views and
 * components.
 *
 * Also, represents a basic application template.
 */
@Component({
    components: {
        'bottom-menu': BottomMenu,
        'call': WebpackAsyncLoader(Call),
        'confirm-component': ConfirmComponent,
        'contact-preview': WebpackAsyncLoader(ContactPreview),
        'contacts-list-popup': ContactsListPopup,
        'incoming-call': WebpackAsyncLoader(IncomingCall),
        'left-side-menu': LeftSideMenu,
        'notifications-list': NotificationsList,
        'share-container': ShareContainer,
        'text-alert': TextAlert,
    },
})
export default class App extends AppCore {
    /**
     * Indicator whether mouse moved onto menu or not.
     */
    public isMouseMoved: boolean = false;

    /**
     * Indicator whether menu panel is visible or not.
     */
    public isMenuOpen: boolean = false;

    /**
     * Indicator whether bottom menu is visible or not.
     */
    public isBottomMenuVisible: boolean = true;

    /**
     * Max angle which will still start menu transition.
     */
    public readonly MAX_SWIPE_ANGLE = 35;

    /**
     * Min distance to pass to toggle menu state.
     */
    public readonly SWIPE_DIST_TO_SUCCEED = 150;

    /**
     * Movement handler, responsible for sidebar menu touch events.
     */
    public movementHandler: MovementHandler = new MovementHandler();

    /**
     * Popup type enum copy to get access to it from template.
     */
    public readonly popupType = PopupType;

    /**
     * Indicator whether share container is visible.
     */
    public isShareVisible: boolean = false;

    /**
     * List of visible popups.
     */
    @popupModule.Getter(GET_POPUPS)
    public popups: IPopup[];

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
     * Returns `Menu` component by ref.
     */
    public get menu(): HTMLElement {
        return this.$refs.menu as HTMLElement;
    }

    /**
     * Returns `App` component by ref.
     */
    public get app(): HTMLElement {
        return this.$refs.app as HTMLElement;
    }

    /**
     * Width of the app container element.
     */
    public get appContainerWidth(): number {
        return (document.querySelector(
            '#page-wrap',
        ) as HTMLElement).clientWidth;
    }

    /**
     * Indicator whether mobile mode is active.
     */
    public get isMobileMode(): boolean {
        return this.isForceMobileMode || this.isNativeMobileMode;
    }

    /**
     * Current call state.
     */
    @callModule.Getter(GET_CALL_STATE)
    public callState: CallStates;

    /**
     * Indicator whether user has incoming call.
     */
    @callModule.Getter(HAS_INCOMING_CALL)
    public hasIncomingCall: boolean;

    /**
     * Current call room ID.
     */
    @callModule.Getter(GET_ROOM_ID)
    public roomId: string;

    /**
     * Indicator whether call is minified.
     */
    @callModule.Getter(GET_IS_MINIFIED)
    public isMinified: boolean;

    /**
     * Indicator whether user has incoming call.
     */
    public get hasOngoingCall(): boolean {
        if (this.$route.path.includes('outer-call')) return false;
        return this.callState === CallStates.ACTIVE
            || this.callState === CallStates.ENDED
            || this.callState === CallStates.BUSY
            || this.callState === CallStates.FAILED_TO_CONNECT
            || this.callState === CallStates.DECLINED
            || this.callState === CallStates.NO_RESPONSE
            || this.callState === CallStates.RECONNECTING
            || this.callState === CallStates.AWAITING;
    }

    /**
     * Indicator whether swipe in menu is disabled or not.
     */
    public get isSwipeDisabled(): boolean {
        if(this.isMenuOpen) return false;
        if(this.$route.query.dsw) return true;

        const routesWidthSwipeElements = ['contacts', 'chats'];

        for(const route of routesWidthSwipeElements) {
            if(this.$route.path.includes(route)) {
                return true;
            }
        }
        return false;
    }

    /**
     * List of elements to be moved on menu-touch-events.
     */
    public get elementsToMove(): HTMLElement[] {
        return [(this.$refs.menu as Vue).$el] as HTMLElement[];
    }

    /**
     * Browser window width (in pixels).
     */
    public get windowWidth(): number {
        return window.innerWidth;
    }

    /**
     * Fetches user's account data.
     */
    @userModule.Action(FETCH_USER_DATA)
    public fetchUserDataAction: () => Promise<void>;

    /**
     * Inits Jason WASM module. Required for Medea to work.
     */
    @callModule.Action(INIT_JASON)
    public initJason: () => Promise<void>;

    /**
     * Creates WebSocket connection with backend calls notification socket.
     * Also, sets up call notification socket callbacks.
     */
    @callModule.Action(SETUP_NOTIFICATION_SOCKET)
    public setupNotificationSocket: () => void;

    /**
     * Fetches user's chats from the server.
     */
    @chatsModule.Action(FETCH_CHATS)
    public fetchChatsAction: () => Promise<void>;

    /**
     * Sets mobile mode state.
     *
     * @param isMobileMode              Indicator whether mobile mode is
     *                                  active.
     */
    @generalParameters.Action(SET_MOBILE_MODE)
    public setMobileModeAction: (isMobileMode: boolean) => void;

    /**
     * Closes left-side app menu.
     */
    public closeMenu(): void {
        this.isMenuOpen = false;
    }

    /**
     * Opens left-side app menu.
     */
    public openMenu(): void {
        this.isMenuOpen = true;
    }

    /**
     * Toggles left-side app menu.
     */
    public toggleMenu(): void {
        this.isMenuOpen ? this.closeMenu() : this.openMenu();
    }

    /**
     * Gets position of the touch event relative to page wrapper.
     *
     * @param e                         `touch` event.
     */
    public getPositionByDevice(e: {changedTouches}): { x: number, y: number } {
        if (!this.isMobileMode) {
            return {
                x: e.changedTouches[0].pageX,
                y: e.changedTouches[0].pageY,
            };
        } else {
            const wrapWidth = this.appContainerWidth;
            const diff = (window.innerWidth - wrapWidth) / 2;
            return {
                x: e.changedTouches[0].pageX - diff,
                y: e.changedTouches[0].pageY,
            };
        }
    }

    /**
     * Triggers movement handler to start listening to events.
     *
     * @param e                         `touchstart` | `mousedown` event.
     */
    public movementHandlerStart(e: TouchEvent): void {
        if(!this.isMobileMode) return;
        if (e.type !== 'touchstart') return;
        if (this.isSwipeDisabled) return;

        this.movementHandler.start(e);
    }

    /**
     * Sets initial position of the menu element.
     * Also, adds move and end touch events.
     *
     * @param data                      Movement handler data.
     */
    public startHandler(data: MovementHandlerData): boolean | void {
        const { x } = data.initialPosition;
        if (!this.isMenuOpen && x > 60) return false;
        if (this.isMenuOpen && x < this.appContainerWidth - 60) return false;
    }


    /**
     * Moves `elementsToMove` according to current finger position.
     *
     * @param data                      Movement handler data.
     */
    public moveHandler(data: MovementHandlerData): void {
        const { x: dX, y: dY } = data.diff;

        const angle = Math.abs(Math.atan2(dY, dX) / Math.PI * 180);

        if( angle > this.MAX_SWIPE_ANGLE
            && angle < 180 - this.MAX_SWIPE_ANGLE) return;

        const [minValue, maxValue] = [
            this.isMenuOpen ? -this.appContainerWidth : 0,
            this.isMenuOpen ? 0 : this.appContainerWidth,
        ];

        this.elementsToMove.forEach(
            element => element.style.transform = `translateX(${clamp(
                dX,
                minValue,
                maxValue,
            )}px)`,
        );
    }

    /**
     * Changes menu state based on `dX`.
     * Also, removes `touchmove` and `touchend` event listeners.
     *
     * @param data                      Movement handler data.
     */
    public endHandler(data: MovementHandlerData): void {
        if(Math.abs(data.diff.x) > this.SWIPE_DIST_TO_SUCCEED) {
            this.toggleMenu();
        } else {
            const elements = this.elementsToMove;
            const settings = {
                transform: '',
                transition: '200ms transform ease-in-out',
            };
            smoothTransition({ elements, settings });
        }
    }

    /**
     * Sets bottom menu visibility state.
     *
     * @param isVisible                 Indicator whether bottom menu is
     *                                  visible.
     */
    public setBottomMenuVisibility(isVisible: boolean): void {
        this.isBottomMenuVisible = isVisible;
    }

    /**
     * Toggles share container visibility.
     */
    public toggleShareVisibility(): void {
        this.setShareVisibility(!this.isShareVisible);
    }

    /**
     * Sets share container visibility.
     */
    public setShareVisibility(value: boolean): void {
        this.isShareVisible = value;
    }

    /**
     * Removes visual transformations of menu on change from mobile desktop.
     */
    @Watch('isMobileMode')
    onMobileModeChanged(isMobileMode: boolean): void {
        if(!isMobileMode) {
            this.elementsToMove.forEach(element => {
                element.style.left = '';
                element.style.transform = '';
                element.style.transition = '';
            });
        }
    }

    /**
     * Smoothly animates `elementToMove` to new state on `isMenuOpen` change.
     *
     * @param isMenuOpen                Indicator whether menu should be open.
     */
    @Watch('isMenuOpen')
    watchIsMenuOpen(isMenuOpen: string): void {
        if(!this.isMobileMode) return;
        const duration = 200;

        const settings = {
            left: `${isMenuOpen ? '0px' : '-100%'}`,
            transform: '',
            transition: `${duration}ms left ease-in-out,
                         ${duration}ms transform ease-in-out`,
        };

        const elements = this.elementsToMove;

        smoothTransition({ elements, settings });
    }

    /**
     * Updates app mobile mode state on window width change.
     * Also, updates custom css --vh property on height change.
     */
    onWindowWidthChanged(): void {
        if(window.innerWidth <=800 && !this.isMobileMode) {
            this.setMobileModeAction(true);
        } else if (window.innerWidth > 800 && this.isMobileMode) {
            this.setMobileModeAction(false);
        }

        const vhValue = parseFloat(
            document.documentElement.style.getPropertyValue('--vh'),
        );

        if(vhValue !== window.innerHeight * 0.01) {
            document.documentElement.style.setProperty(
                '--vh', `${window.innerHeight * 0.01}px`,
            );
        }
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to register global listener of
     * browser window's `resize` event and gather user data from the server.
     * Also, adds `setBottomMenuVisibility` event listener.
     */
    public async mounted(): Promise<void> {
        await this.fetchUserDataAction();
        this.fetchChatsAction();
        this.initJason()
            .then(this.setupNotificationSocket);

        try {
            const mediaSession = navigator['mediaSession'];
            mediaSession.setActionHandler('play'         , () => undefined);
            mediaSession.setActionHandler('pause'        , () => undefined);
            mediaSession.setActionHandler('seekbackward' , () => undefined);
            mediaSession.setActionHandler('seekforward'  , () => undefined);
            mediaSession.setActionHandler('previoustrack', () => undefined);
            mediaSession.setActionHandler('nexttrack'    , () => undefined);
        } catch(e) {
            console.log('can\'t block media buttons');
        }

        const element = (this.$refs.menu as Vue).$el as HTMLElement;
        element.style.left = '';
        element.style.transform = '';
        element.style.transition = '';

        this.movementHandler.onStart(this.startHandler.bind(this));
        this.movementHandler.onMove(this.moveHandler.bind(this));
        this.movementHandler.onEnd(this.endHandler.bind(this));

        this.fetchUserDataAction();

        this.$root.$on('setBottomMenuVisibility', this.setBottomMenuVisibility);
        this.onWindowWidthChanged();
        window.addEventListener('resize', this.onWindowWidthChanged);
    }

    /**
     * Hooks `beforeDestroy` Vue lifecycle stage to drop global listener of
     * browser window's `resize` event.
     */
    public beforeDestroy(): void {
        this.$nextTick(() => {
            window.removeEventListener('resize', this.onWindowWidthChanged);
        });

        this.$root.$off(
            'setBottomMenuVisibility',
            this.setBottomMenuVisibility,
        );
    }
}
