import { GetterTree } from 'vuex';

import { NotificationModel } from 'models/old/NotificationTypes';

import RootState from 'store/root/state';


/**
 * Name of loading getter.
 */
export const LOADING: string = 'loading';

/**
 * Name of menu sidebar active state getter.
 */
export const IS_MENU_SIDEBAR_ACTIVE: string = 'isMenuSidebarActive';

/**
 * Name of lang sidebar active state getter.
 */
export const IS_LANG_SIDEBAR_ACTIVE: string = 'isLangSidebarActive';

/**
 * Name of quick access sidebar active state getter.
 */
export const IS_QUICK_ACCESS_SIDEBAR_ACTIVE: string
    = 'isQuickAccessSidebarActive';

/**
 * Name of quick access sidebar current view getter.
 */
export const QUICK_ACCESS_SIDEBAR_CURRENT_VIEW: string
    = 'quickAccessSidebarCurrentView';

/**
 * Name of locale getter.
 */
export const LOCALE: string = 'locale';

/**
 * Name of authorization window is active getter.
 */
export const AUTHORIZATION_WINDOW_ACTIVE: string = 'authorizationWindowActive';

/**
 * Name of account quick access window is active getter.
 */
export const ACCOUNT_QUICK_ACCESS_WINDOW_ACTIVE: string
    = 'accountQuickAccessWindowActive';

/**
 * Name of is chunk loading failed getter.
 */
export const IS_CHUNK_LOADING_FAILED: string = 'isChunkLoadingFailed';

/**
 * Name of is editable content focused getter.
 */
export const IS_EDITABLE_CONTENT_FOCUSED: string = 'isEditableContentFocused';

/**
 * Name of is address bar hided getter.
 */
export const IS_ADDRESS_BAR_HIDED: string = 'isAddressBarHided';

/**
 * Name of documentWidth getter.
 */
export const DOCUMENT_WIDTH: string = 'documentWidth';

/**
 * Name of aside opened getter.
 */
export const ASIDE_OPENED: string = 'asideOpened';

/**
 * Name of get quick access sidebar on top getter.
 */
export const GET_QUICK_ACCESS_SIDEBAR_ON_TOP: string
    = 'getQuickAccessSidebarOnTop';

/**
 * Name of get is need reload getter.
 */
export const GET_IS_NEED_RELOAD: string = 'getIsNeedReload';

/**
 * Name of get notifications getter.
 */
export const GET_NOTIFICATIONS: string = 'getNotifications';

/**
 * Returns loading state from root store.
 *
 * @param state     Root Vuex state.
 *
 * @return   Loading state.
 */
export function loading(state: RootState): boolean {
    return state.loading;
}

/**
 * Returns menu sidebar active state from root store.
 *
 * @param state     Root Vuex state.
 *
 * @return   Menu sidebar active state.
 */
export function isMenuSidebarActive(state: RootState): boolean {
    return state.menuSidebarActive;
}

/**
 * Returns lang sidebar active state from root store.
 *
 * @param state     Root Vuex state.
 *
 * @return   Lang sidebar active state.
 */
export function isLangSidebarActive(state: RootState): boolean {
    return state.langSidebarActive;
}

/**
 * Returns current quick access sidebar opened state from root store.
 *
 * @param state     Root vuex state.
 *
 * @return   Quick access sidebar active state.
 */
export function isQuickAccessSidebarActive(state: RootState): boolean {
    return Object.keys(state.quickAccessSidebarActive).some((component) => {
        return state.quickAccessSidebarActive[component];
    });
}

/**
 * Returns current active view, loaded into quick access sidebar.
 */
export function quickAccessSidebarCurrentView(
    state: RootState,
): string | undefined {
    return Object.keys(state.quickAccessSidebarActive).find((component) => {
        return (state.quickAccessSidebarActive[component] === true);
    });
}

/**
 * Returns current app locale.
 */
export function locale(state: RootState): string {
    return state.locale;
}

/**
 * Returns document width state.
 */
export function documentWidth(state: RootState): number {
    return state.documentWidth;
}

/**
 * Returns true if chunk loading is failed.
 *
 * @param state   Root Vuex state.
 */
export function isChunkLoadingFailed(state: RootState): boolean {
    return state.isChunkLoadingFailed;
}

/**
 * Returns authorizationWindowActive state.
 *
 * @param state   Root Vuex state.
 *
 * @return   True if authorization window is active.
 */
export function authorizationWindowActive(state: RootState): boolean {
    return state.authorizationWindowActive;
}

/**
 * Returns accountQuickAccessWindowActive state.
 *
 * @param state   Root Vuex state.
 *
 * @return   True if account quick access window is active.
 */
export function accountQuickAccessWindowActive(state: RootState): boolean {
    return state.accountQuickAccessWindowActive;
}

/**
 * Returns isEditableContentFocused state.
 *
 * @param state    Root Vuex state.
 */
export function isEditableContentFocused(state: RootState): boolean {
    return state.isEditableContentFocused;
}

/**
 * Returns isAddressBarHided state.
 *
 * @param state    Root Vuex state.
 */
export function isAddressBarHided(state: RootState): boolean {
    return state.isAddressBarHided;
}

/**
 * Returns asideOpened state.
 *
 * @param state   Root Vuex state.
 *
 * @return   True if aside panel is opened.
 */
export function asideOpened(state: RootState): boolean {
    return state.asideOpenedCount !== 0;
}

/**
 * Returns quickAccessSidebarOnTop state.
 *
 * @param state   Root Vuex state.
 */
export function getQuickAccessSidebarOnTop(state: RootState): boolean {
    return state.quickAccessSidebarOnTop;
}

/**
 * Returns isNeedReload state.
 *
 * @param state   Root Vuex state.
 */
export function getIsNeedReload(state: RootState): boolean {
    return state.isNeedReload;
}

/**
 * Returns notification state.
 *
 * @param state   Root Vuex state.
 */
export function getNotifications(state: RootState): NotificationModel[] {
    return state.notifications;
}

export default {
    accountQuickAccessWindowActive,
    asideOpened,
    authorizationWindowActive,
    documentWidth,
    getIsNeedReload,
    getNotifications,
    getQuickAccessSidebarOnTop,
    isAddressBarHided,
    isChunkLoadingFailed,
    isEditableContentFocused,
    isLangSidebarActive,
    isMenuSidebarActive,
    isQuickAccessSidebarActive,
    loading,
    locale,
    quickAccessSidebarCurrentView,
} as GetterTree<RootState, RootState>;
