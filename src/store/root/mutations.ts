import { MutationTree } from 'vuex';

import Modernizr from 'plugins/Modernizr';

import { NotificationModel, NotificationTypes } from 'models/old/NotificationTypes';

import RootState from 'store/root/state';


/**
 * Name of set loading mutation.
 */
export const SET_LOADING: string = 'setLoading';

/**
 * Name of set locale mutation.
 */
export const SET_LOCALE: string = 'setLocale';

/**
 * Name of set lang sidebar active mutation.
 */
export const SET_LANG_SIDEBAR_ACTIVE: string = 'setLangSidebarActive';

/**
 * Name of set quick access sidebar view mutation.
 */
export const SET_QUICK_ACCESS_SIDEBAR_VIEW: string
    = 'setQuickAccessSidebarView';

/**
 * Name of close quick access sidebar mutation.
 */
export const CLOSE_QUICK_ACCESS_SIDEBAR: string = 'closeQuickAccessSidebar';

/**
 * Name of set aside opened mutation.
 */
export const SET_ASIDE_OPENED: string = 'setAsideOpened';

/**
 * Name of is chunk loading failed mutation.
 */
export const SET_IS_CHUNK_LOADING_FAILED: string = 'setIsChunkLoadingFailed';

/**
 * Name of set document width mutation.
 */
export const SET_DOCUMENT_WIDTH: string = 'setDocumentWidth';

/**
 * Name of set editable content focused mutation.
 */
export const SET_EDITABLE_CONTENT_FOCUSED: string = 'setEditableContentFocused';

/**
 * Name of set address bar hided mutation.
 */
export const SET_ADDRESS_BAR_HIDED: string = 'setAddressBarHided';

/**
 * Name of set authorization window is active mutation.
 */
export const SET_AUTHORIZATION_WINDOW_ACTIVE: string
    = 'setAuthorizationWindowActive';

/**
 * Name of set account quick access window is active mutation.
 */
export const SET_ACCOUNT_QUICK_ACCESS_WINDOW_ACTIVE: string
    = 'setAccountQuickAccessWindowActive';

/**
 * Name of set quick access sidebar on top mutation.
 */
export const SET_QUICK_ACCESS_SIDEBAR_ON_TOP: string
    = 'setQuickAccessSidebarOnTop';

/**
 * Name of set is need reload mutation.
 */
export const SET_IS_NEED_RELOAD: string = 'setIsNeedReload';

/**
 * Name of add notification mutation.
 */
export const ADD_NOTIFICATION: string = 'addNotification';

/**
 * Name of add notification mutation.
 */
export const CLOSE_NOTIFICATION: string = 'closeNotification';

/**
 * Sets application loading state.
 *
 * @param state         Root Vuex state.
 * @param isLoading     Loading state, that will be set to the state.
 */
export function setLoading(state: RootState, isLoading: boolean): void {
    state.loading = isLoading;
}

/**
 * Sets application locale state.
 *
 * @param  state    Root Vuex state.
 * @param  locale   Locale key string, that will be committed to the state.
 */
export function setLocale(state: RootState, locale: string): void {
    state.locale = locale;
}

/**
 * Sets lang sidebar active state.
 *
 * @param state      Root Vuex state.
 * @param isActive   Active flag, that will be committed to the state.
 */
export function setLangSidebarActive(
    state: RootState,
    isActive: boolean,
): void {
    state.langSidebarActive = isActive;
}

/**
 * Sets quick access sidebar view active state.
 *
 * @param state     Root Vuex state.
 * @param payload   View name and it's active flag,
 *                  that will be committed to the state.
 */
export function setQuickAccessSidebarView(
    state: RootState,
    payload: { view: string, isActive: boolean },
): void {
    state.quickAccessSidebarActive[payload.view] = payload.isActive;
}

/**
 * Set quick access sidebar active state to false.
 *
 * @param state         Root Vuex state.
 */
export function closeQuickAccessSidebar(state: RootState): void {
    Object.keys(state.quickAccessSidebarActive).map((view) => {
        state.quickAccessSidebarActive[view] = false;
    });
}

/**
 * Sets isChunkLoadingFailed state.
 *
 * @param state      Root Vuex state.
 * @param isFailed   True if chunk loading is failed.
 */
export function setIsChunkLoadingFailed(
    state: RootState,
    isFailed: boolean,
): void {
    if (isFailed) {
        addNotification(state, new NotificationModel(
            NotificationTypes.FATAL_ERROR,
        ));
    }
    state.isChunkLoadingFailed = isFailed;
}

/**
 * Sets authorizationWindowActive state.
 *
 * @param state      Root Vuex state.
 * @param isActive   True if need show authorization window.
 */
export function setAuthorizationWindowActive(
    state: RootState,
    isActive: boolean,
): void {
    state.authorizationWindowActive = isActive;
}

/**
 * Sets accountQuickAccessWindowActive state.
 *
 * @param state      Root Vuex state.
 * @param isActive   True if need show account quick access window.
 */
export function setAccountQuickAccessWindowActive(
    state: RootState,
    isActive: boolean,
): void {
    state.accountQuickAccessWindowActive = isActive;
}

/**
 * Sets menu aside opened active state.
 *
 * @param state      Root Vuex state.
 * @param isActive   Active flag, that will be committed to the state.
 */
export function setAsideOpened(
    state: RootState,
    isActive: boolean,
): void {
    state.asideOpenedCount += isActive ? 1 : -1;
    if (isActive && Modernizr.isMobileDevice()) {
        state.menuSidebarActive = false;
    }
}

/**
 * Sets document width state.
 *
 * @param state    Root Vuex state.
 * @param width    Document width, that will be committed to the state.
 */
export function setDocumentWidth(
    state: RootState,
    width: number,
): void {
    state.documentWidth = width;
}

/**
 * Sets is editable content focused state.
 *
 * @param state        Root Vuex state.
 * @param isFocused    Is editable content focused.
 */
export function setEditableContentFocused(
    state: RootState,
    isFocused: boolean,
): void {
    state.isEditableContentFocused = isFocused;
}

/**
 * Sets is address bar hided state.
 *
 * @param state     Root Vuex state.
 * @param isHided   Is address bar hided.
 */
export function setAddressBarHided(
    state: RootState,
    isHided: boolean,
): void {
    state.isAddressBarHided = isHided;
}

/**
 * Sets quick access sidebar on top state.
 *
 * @param state     Root Vuex state.
 * @param isOnTop   Is quick access sidebar on top.
 */
export function setQuickAccessSidebarOnTop(
    state: RootState,
    isOnTop: boolean,
): void {
    state.quickAccessSidebarOnTop = isOnTop;
}

/**
 * Sets is need reload state.
 *
 * @param state          Root Vuex state.
 * @param isNeedReload   Is browser page need to be reloaded.
 */
export function setIsNeedReload(
    state: RootState,
    isNeedReload: boolean,
): void {
    // TODO: add reload blocker to prevent user actions interruption.
    const isReloadAllowed: boolean = true;

    if (isNeedReload && isNeedReload !== state.isNeedReload) {
        const reloadPage = typeof window !== undefined
            ? () => window.location.reload()
            : undefined;
        addNotification(state, new NotificationModel(
            NotificationTypes.RELOAD_REQUIRED,
            undefined,
            reloadPage,
            () => {
                if (reloadPage === undefined || !isReloadAllowed) {
                    return;
                }
                reloadPage();
            },
        ));
    }
    state.isNeedReload = isNeedReload;
}

/**
 * Adds notification to the state.
 *
 * @param state   Root Vuex state.
 * @param data    Notification data.
 */
export function addNotification(
    state: RootState,
    data: NotificationModel,
): void {
    const index =
        state.notifications.findIndex(({ type }) => type === data.type);

    if (index !== -1) {
        return;
    }
    if (data.onClose === null) {
        data.onClose = () => closeNotification(state, data.id);
    }
    state.notifications.push(data);
}

/**
 * Removes notification from the store.
 *
 * @param state   Root Vuex state.
 * @param id      ID of notification that will be deleted.
 */
export function closeNotification(
    state: RootState,
    id: string,
): void {
    state.notifications = state.notifications.filter((n) => n.id !== id);
}

export default {
    addNotification,
    closeNotification,
    closeQuickAccessSidebar,
    setAccountQuickAccessWindowActive,
    setAddressBarHided,
    setAsideOpened,
    setAuthorizationWindowActive,
    setDocumentWidth,
    setEditableContentFocused,
    setIsChunkLoadingFailed,
    setIsNeedReload,
    setLangSidebarActive,
    setLoading,
    setLocale,
    setQuickAccessSidebarOnTop,
    setQuickAccessSidebarView,
} as MutationTree<RootState>;
