import Vue from 'vue';
import { ActionContext, ActionTree } from 'vuex';

import Modernizr from 'plugins/Modernizr';
import { getMenuScroll } from 'utils/MenuSidebar';

import RootState from 'store/root/state';

import MobileScrollModule from 'store/modules/mobile-scroll-controller';

import * as MobileScrollMutations from 'store/modules/mobile-scroll-controller/mutations';
import * as mutations from 'store/root/mutations';


/**
 * Name of start loading action.
 */
export const START_LOADING: string = 'startLoading';

/**
 * Name of stop loading action.
 */
export const STOP_LOADING: string = 'stopLoading';

/**
 * Name of toggle menu sidebar action.
 */
export const TOGGLE_MENU_SIDEBAR: string = 'toggleMenuSidebar';

/**
 * Name of toggle lang sidebar action.
 */
export const TOGGLE_LANG_SIDEBAR: string = 'toggleLangSidebar';

/**
 * Name of toggle quick access sidebar action.
 */
export const TOGGLE_QUICK_ACCESS_SIDEBAR: string = 'toggleQuickAccessSidebar';

/**
 * Name of disable scroll event action.
 */
export const DISABLE_SCROLL_HANDLING: string = 'disableScrollHandling';

/**
 * Name of set menu sidebar active action.
 */
export const SET_MENU_SIDEBAR_ACTIVE: string = 'setMenuSidebarActive';

/**
 * Name of lock background action.
 */
export const LOCK_BACKGROUND: string = 'lockBackground';

/**
 * Name of unlock background action.
 */
export const UNLOCK_BACKGROUND: string = 'unlockBackground';

/**
 * Commits "true" to store's loading state.
 *
 * @param store     Root Vuex store.
 */
export function startLoading(store: ActionContext<RootState, RootState>): void {
    store.commit(mutations.SET_LOADING, true);
}

/**
 * Commits "false" to store's loading state.
 *
 * @param store     Root Vuex store.
 */
export function stopLoading(store: ActionContext<RootState, RootState>): void {
    store.commit(mutations.SET_LOADING, false);
}

/**
 * Toggles menu sidebar active state in root store.
 *
 * @param store         Root Vuex store.
 * @param payload       Payload that contains:
 *                      - Optional, menu sidebar isActive flag. If specified,
 *                      then menu sidebar active state won't be just toggled,
 *                      but turned into the flag state.
 *                      - Optional force flag. True to skip aside opened check.
 */
export function toggleMenuSidebar(
    store: ActionContext<RootState, RootState>,
    payload: {
        isActive?: boolean,
        force?: boolean,
    } = {},
): void {
    const { isActive, force } = payload;
    if ((!force)
        && (store.state.asideOpenedCount !== 0)
        && (Modernizr.isTouchDevice())
    ) {
        return;
    }
    if (store.state.langSidebarActive && Modernizr.isMobileDevice()) {
        toggleLangSidebar(store, false);
    }

    setMenuSidebarActive(
        store,
        ((isActive !== undefined) ? isActive : !store.state.menuSidebarActive),
    );
}

/**
 * Toggles lang sidebar active state in root store.
 *
 * @param store         Root Vuex store.
 * @param isActive      Optional, lang sidebar active flag. If specified, then
 *                      lang sidebar active state won't be just toggled, but
 *                      turned into the flag state.
 */
export function toggleLangSidebar(
    store: ActionContext<RootState, RootState>,
    isActive?: boolean,
): void {
    if (store.state.menuSidebarActive && Modernizr.isMobileDevice()) {
        toggleMenuSidebar(store, { isActive: false });
    }

    store.commit(
        mutations.SET_LANG_SIDEBAR_ACTIVE,
        ((isActive !== undefined) ? isActive : !store.state.langSidebarActive),
    );
}

/**
 * Toggles quick access sidebar active state for specified view in root store.
 *
 * @param store     Root Vuex store.
 * @param view      View, whose active state will be toggled.
 */
export function toggleQuickAccessSidebar(
    store: ActionContext<RootState, RootState>,
    view: string,
): void {
    Object.keys(store.state.quickAccessSidebarActive).map((storeView) => {
        const isActive = store.state.quickAccessSidebarActive[storeView];
        if (!isActive && (storeView !== view)) {
            return;
        }

        store.commit(
            mutations.SET_QUICK_ACCESS_SIDEBAR_VIEW,
            { isActive: !isActive, view: storeView },
        );
    });
}

/**
 * Sets menu sidebar active state.
 *
 * @param store      Root Vuex store.
 * @param isActive   Active flag, that will be committed to the state.
 */
export function setMenuSidebarActive(
    store: ActionContext<RootState, RootState>,
    isActive: boolean,
): void {
    store.state.menuSidebarActive = isActive;
    if (Modernizr.isMobileDevice()) {
        if (isActive) {
            Vue.nextTick(() => {
                const mutationName = MobileScrollMutations.SET_IS_HEADER_HIDDEN;
                store.commit(
                    `${MobileScrollModule.vuexName}/${mutationName}`,
                    false,
                    { root: true },
                );

                if (getMenuScroll()) {
                    const mutationName =
                        MobileScrollMutations.SET_IS_EVENTS_DISABLED;
                    store.commit(
                        `${MobileScrollModule.vuexName}/${mutationName}`,
                        true,
                        { root: true },
                    );
                }
            });
        }
    }
}


export default {
    startLoading,
    stopLoading,
    toggleLangSidebar,
    toggleMenuSidebar,
    toggleQuickAccessSidebar,
} as ActionTree<RootState, RootState>;
