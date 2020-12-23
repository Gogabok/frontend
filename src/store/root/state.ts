import { NotificationModel } from 'models/old/NotificationTypes';


/**
 * Root Vuex state.
 */
export default class RootState {

    /**
     * Application loading flag.
     */
    public loading: boolean;

    /**
     * Application locale.
     */
    public locale: string;

    /**
     * Menu sidebar active state.
     */
    public menuSidebarActive: boolean;

    /**
     * Quick access sidebar active state for each component.
     */
    public quickAccessSidebarActive: {[component: string]: boolean};

    /**
     * Quick access sidebar on top state.
     */
    public quickAccessSidebarOnTop: boolean = false;

    /**
     * Lang sidebar active state.
     */
    public langSidebarActive: boolean;

    /**
     * Indicator whether sign up window should be shown or not.
     */
    public authorizationWindowActive: boolean;

    /**
     * Indicator whether account quick access window should be shown or not.
     */
    public accountQuickAccessWindowActive: boolean;

    /**
     * Describes is chunk loading is failed or not.
     */
    public isChunkLoadingFailed: boolean;

    /**
     * Aside opened count value. Is used for prevent menu sidebar opening on
     * mobile device swipe, while some aside panels is not closed.
     */
    public asideOpenedCount: number = 0;

    /**
     * Width of the document. It used for render correct layout
     * depends on type of device.
     */
    public documentWidth = 0;

    /**
     * Indicator whether focus is currently on the editable content element.
     * Used in mobile devices to hide top menu when keyboard shown.
     */
    public isEditableContentFocused = false;

    /**
     * Indicator whether address bar is hidden. Used for mobile devices.
     */
    public isAddressBarHided = false;

    /**
     * Is browser page need to be reloaded.
     */
    public isNeedReload = false;

    /**
     * Notifications on the web page.
     */
    public notifications: NotificationModel[] = [];

    /**
     * Creates initial root store state.
     */
    constructor() {
        this.loading = false;
        this.locale = 'en';
        this.menuSidebarActive = false;
        this.quickAccessSidebarActive = {
            broadcast: false,
            events: false,
            im: false,
            media: false,
        };
        this.authorizationWindowActive = false;
        this.accountQuickAccessWindowActive = false;
        this.langSidebarActive = false;
        this.isChunkLoadingFailed = false;
    }
}
