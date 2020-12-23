import { ActionContext, ActionTree } from 'vuex';

import EventBus from 'plugins/EventBus';

import ScrollEvents from 'models/old/ScrollEvents';
import ScrollOwner from 'models/old/ScrollOwner';

import MobileScrollState from 'store/modules/mobile-scroll-controller/state';
import RootState from 'store/root/state';

import * as mutations from 'store/modules/mobile-scroll-controller/mutations';


/**
 * Name of update scroll owner action.
 */
export const SET_SCROLL_OWNER: string = 'setScrollOwner';

/**
 * Name of remove scroll owner action.
 */
export const UNSET_SCROLL_OWNER: string = 'unsetScrollOwner';

/**
 * Name of pause listeners action.
 */
export const PAUSE_LISTENERS: string = 'pauseListeners';

/**
 * Name of disable listeners action.
 */
export const DISABLE_LISTENERS: string = 'disableListeners';

/**
 * Name of disable listeners action.
 */
export const ENABLE_LISTENERS: string = 'enableListeners';

/**
 * Name of show both menu action.
 */
export const SHOW_BOTH_MENU: string = 'showBothMenu';

/**
 * Name of update scroll state action.
 */
export const UPDATE_SCROLL_STATE: string = 'updateScrollState';

/**
 * Set new owner of app scroll. Add new owner to stack to know previous owners
 * (when this owner will destroyed need know previous).
 *
 * @param store    MobileScrollState Vuex store.
 * @param owner    Owner of scroll.
 */
export function setScrollOwner(
    store: ActionContext<MobileScrollState, RootState>,
    owner: ScrollOwner,
): void {
    const prevLocation = store.state.scrollOwners.length
        ? store.state.scrollOwners[store.state.scrollOwners.length - 1]
        : null;
    store.state.scrollOwners.push(owner);

    const recreate = (prevLocation === null)
        || (prevLocation.component !== owner.component);
    reinitialize(store, { owner, recreate });
}

/**
 * Unset current scroll owner and find previous scroll owner. Used when
 * component-owner destroyed for return events handling to previous component.
 * (for example, when MessagesList destroyed then ConversationList component
 * become the owner of scroll again).
 *
 * @param store    MobileScrollState Vuex store.
 * @param owner    Owner of scroll which must deleted from owners stack.
 */
export function unsetScrollOwner(
    store: ActionContext<MobileScrollState, RootState>,
    owner: ScrollOwner,
): void {
    let recreate = false;
    for (let ind = store.state.scrollOwners.length - 1; ind >= 0; ind--) {
        const item = store.state.scrollOwners[ind];
        if (item.component !== owner.component) {
            break;
        }
        store.state.scrollOwners.pop();
        recreate = true;
    }
    reinitialize(store, { owner, recreate });
}

/**
 * Disables scroll event handling for 300ms. Used for prevent scroll event
 * handling while navigate between messages list and conversations list.
 *
 * @param store     MobileScrollState Vuex store.
 */
export function pauseListeners(
    store: ActionContext<MobileScrollState, RootState>,
): void {
    store.commit(mutations.SET_IS_EVENTS_DISABLED, true);
    setTimeout(
        () => store.commit(mutations.SET_IS_EVENTS_DISABLED, false),
        300,
    );
}

/**
 * Disables scroll event handling permanently. Used for prevent scroll event
 * handling when layout changed to fixed.
 *
 * @param store     MobileScrollState Vuex store.
 */
export function disableListeners(
    store: ActionContext<MobileScrollState, RootState>,
): void {
    store.commit(mutations.SET_IS_EVENTS_DISABLED, true);
}

/**
 * Enable scroll event handling. Used for restore scroll event handling when
 * layout changed back to static.
 *
 * @param store     MobileScrollState Vuex store.
 */
export function enableListeners(
    store: ActionContext<MobileScrollState, RootState>,
): void {
    store.commit(mutations.SET_IS_EVENTS_DISABLED, false);
}

/**
 * Show header and footer menu.
 *
 * @param store     MobileScrollState Vuex store.
 */
export function showBothMenu(
    store: ActionContext<MobileScrollState, RootState>,
): void {
    store.commit(mutations.SET_IS_HEADER_HIDDEN, false);
    store.commit(mutations.SET_IS_FOOTER_HIDDEN, false);
}

/**
 * Update scroll state. Refresh scroll top, scroll bottom positions,
 * find scroll direction, change visibility of header and footer.
 *
 * @param store      MobileScrollState Vuex store.
 * @param payload    New scroll top and scroll bottom positions.
 */
export function updateScrollState(
    store: ActionContext<MobileScrollState, RootState>,
    payload: {
        scrollTop: number,
        scrollBottom: number,
    },
): void {
    if (store.state.isEventsDisabled) {
        return;
    }
    const { scrollTop, scrollBottom } = payload;

    const threshold = 3;
    const diff = scrollBottom - store.state.lastScrollPosition;
    if (Math.abs(diff) <= threshold) {
        return;
    }

    store.commit(mutations.SET_SCROLL_TOP, scrollTop);
    store.commit(mutations.SET_SCROLL_BOTTOM, scrollBottom);
    store.commit(mutations.SET_SCROLL_DIRECTION, diff);

    if (store.state.scrollDirection > 0 && store.state.scrollBottom >= 40) {
        store.commit(mutations.SET_IS_HEADER_HIDDEN, false);
        store.commit(mutations.SET_IS_FOOTER_HIDDEN, true);
    }
    if (store.state.scrollDirection < 0 && store.state.scrollTop >= 80) {
        store.commit(mutations.SET_IS_HEADER_HIDDEN, true);
        store.commit(mutations.SET_IS_FOOTER_HIDDEN, false);
    }

    store.commit(mutations.SET_LAST_SCROLL_POSITION, scrollBottom);
}

/**
 * Reinitialize scroll state.
 * Temporary disable listeners, show both menu and send CREATED/DESTROYED events
 * if needed.
 *
 * @param store      MobileScrollState Vuex store.
 * @param payload    Recreate flag and new scroll owner. Recreate flag define is
 *                   need send CREATED and DESTROYED event to recreate events
 *                   listeners(when owner component changed then need recreate).
 */
function reinitialize(
    store: ActionContext<MobileScrollState, RootState>,
    payload: {
        recreate: boolean,
        owner: ScrollOwner,
    },
): void {
    const { recreate, owner } = payload;

    disableListeners(store);
    showBothMenu(store);
    store.commit(mutations.SET_SCROLL_DIRECTION, 0);
    store.commit(mutations.SET_LAST_SCROLL_POSITION, 0);

    if (recreate) {
        EventBus.$emit(ScrollEvents.SCROLL_DESTROYED, owner);
    }

    setTimeout(() => {
        if (recreate) {
            EventBus.$emit(ScrollEvents.SCROLL_CREATED, owner);
        }
        enableListeners(store);
    }, 300);
}

export default {
    disableListeners,
    enableListeners,
    pauseListeners,
    setScrollOwner,
    showBothMenu,
    unsetScrollOwner,
    updateScrollState,
} as ActionTree<MobileScrollState, RootState>;
