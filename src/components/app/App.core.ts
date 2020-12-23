import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Action, Getter, Mutation, namespace } from 'vuex-class';

import { NotificationModel } from 'models/old/NotificationTypes';
import ScrollOwner from 'models/old/ScrollOwner';
import { User } from 'models/User';

import MobileScrollModule from 'store/modules/mobile-scroll-controller';
import UserModule from 'store/modules/user';

import * as MobileScrollActions from 'store/modules/mobile-scroll-controller/actions';
import * as MobileScrollGetters from 'store/modules/mobile-scroll-controller/getters';
import { TOGGLE_MENU_SIDEBAR } from 'store/root/actions';
import * as rootGetters from 'store/root/getters';
import * as rootMutations from 'store/root/mutations';
import * as UserGetters from 'store/modules/user/getters';


const mobileScrollModule = namespace(MobileScrollModule.vuexName);
const userModule = namespace(UserModule.vuexName);

/**
 * Base application component that contains general properties of all views and
 * components.
 *
 * Also, represents a basic application template.
 */
@Component
export default class App extends Vue {

    /**
     * Indicator whether account quick access window is active.
     */
    @Getter(rootGetters.ACCOUNT_QUICK_ACCESS_WINDOW_ACTIVE)
    public isAccountQuickAccessWindowActive: boolean;

    /**
     * Indicator whether menu sidebar is currently opened ("active") or not,
     * based on global application Vuex state.
     */
    @Getter(rootGetters.IS_MENU_SIDEBAR_ACTIVE)
    public isMenuSidebarActive: boolean;

    /**
     * Indicator whether chunk loading failed or not.
     */
    @Getter(rootGetters.IS_CHUNK_LOADING_FAILED)
    public isChunkLoadingFailed: boolean;

    /**
     * Flag, that shows if app in loading state.
     */
    @Getter(rootGetters.LOADING)
    public loading: boolean;

    /**
     * Closes quick access sidebar.
     */
    @Mutation(rootMutations.CLOSE_QUICK_ACCESS_SIDEBAR)
    public closeQuickAccessSidebar: () => void;

    /**
     * Sets document width state.
     *
     * @param width                     Document width, that will be committed
     *                                  to the state.
     */
    @Mutation(rootMutations.SET_DOCUMENT_WIDTH)
    public setDocumentWidth: (width: number) => void;

    /**
     * Toggles menu sidebar active/opened state.
     *
     * @param payload                   Action parameters.
     * @param payload.isActive          Indicator whether sidebar is visible.
     * @param payload.force             Indicator whether action should
     *                                  overload any other state.
     */
    @Action(TOGGLE_MENU_SIDEBAR)
    public toggleMenuSidebar: (payload?: {
        isActive?: boolean,
        force?: boolean,
    }) => void;

    /**
     * Notifications on the web page.
     */
    @Getter(rootGetters.GET_NOTIFICATIONS)
    public notifications: NotificationModel[];

    /**
     * Indicator whether sign up window is active.
     */
    @Getter(rootGetters.AUTHORIZATION_WINDOW_ACTIVE)
    public isAuthorizationWindowActive: boolean;

    /**
     * Indicator whether focus is currently on the editable content element.
     */
    @Getter(rootGetters.IS_EDITABLE_CONTENT_FOCUSED)
    public isEditableContentFocused: boolean;

    /**
     * Toggles sign up window state.
     *
     * @param isActive                  Indicator whether sign up window
     *                                  should be visible.
     */
    @Mutation(rootMutations.SET_AUTHORIZATION_WINDOW_ACTIVE)
    public setAuthorizationWindowActive: (isActive: boolean) => void;

    /**
     * Sets is address bar hidden state.
     *
     * @param isHidden                  Indicator whether address bar should
     *                                  be hidden.
     */
    @Mutation(rootMutations.SET_ADDRESS_BAR_HIDED)
    public setAddressBarHidden: (isHidden: boolean) => void;

    /**
     * Set new owner of app scroll.
     *
     * @param owner                     Owner of scroll.
     */
    @mobileScrollModule.Action(MobileScrollActions.SET_SCROLL_OWNER)
    public setMobileScrollOwner: (owner: ScrollOwner) => void;

    /**
     * Get is header menu hidden flag from store.
     */
    @mobileScrollModule.Getter(MobileScrollGetters.IS_HEADER_HIDDEN)
    public isHeaderHidden: boolean;

    /**
     * Returns user authorization state.
     */
    @userModule.Getter(UserGetters.GET_USER_DATA)
    public authorizedUser: User | null;

    /**
     * Indicator whether alert of started broadcast info must be shown.
     */
    public showAlertMenu = false;

    /**
     * Indicator whether alert of incoming call must be shown.
     */
    public showCallAlertMenu = false;

    /**
     * Indicator whether debug information will be shown.
     */
    public showDebugInfo = true;

    /**
     * Interval to check bundle updates with.
     */
    public updatesCheckIntervalKey: number | null = null;

    /**
     * Shows/hides broadcast started alert.
     */
    public toggleAlertMenu(): void {
        this.showAlertMenu = !this.showAlertMenu;
    }

    /**
     * Shows/hides incoming call alert.
     */
    public toggleCallAlertMenu(): void {
        this.showCallAlertMenu = !this.showCallAlertMenu;
    }

    /**
     * Hides debug information container.
     */
    public closeDebugInfo(): void {
        this.showDebugInfo = false;
    }
}
