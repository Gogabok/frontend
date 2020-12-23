import { GetterTree } from 'vuex';

import MobileScrollState from 'store/modules/mobile-scroll-controller/state';
import RootState from 'store/root/state';


/**
 * Name of is header hidden getter.
 */
export const IS_HEADER_HIDDEN: string = 'isHeaderHidden';

/**
 * Name of is footer hidden getter.
 */
export const IS_FOOTER_HIDDEN: string = 'isFooterHidden';

/**
 * Name of is events disabled getter.
 */
export const IS_EVENTS_DISABLED: string = 'isEventsDisabled';

/**
 * Name of scroll top getter.
 */
export const SCROLL_BOTTOM: string = 'scrollBottom';

/**
 * Name of scroll top getter.
 */
export const SCROLL_TOP: string = 'scrollTop';

/**
 * Get is header hidden state.
 *
 * @param state    MobileScrollState Vuex state.
 */
export function isHeaderHidden(state: MobileScrollState): boolean {
    return state.isHeaderHidden;
}

/**
 * Get is footer hidden state.
 *
 * @param state    MobileScrollState Vuex state.
 */
export function isFooterHidden(state: MobileScrollState): boolean {
    return state.isFooterHidden;
}

/**
 * Get is events disabled state.
 *
 * @param state    MobileScrollState Vuex state.
 */
export function isEventsDisabled(state: MobileScrollState): boolean {
    return state.isEventsDisabled;
}

/**
 * Get scroll bottom state.
 *
 * @param state    MobileScrollState Vuex state.
 */
export function scrollBottom(state: MobileScrollState): number {
    return state.scrollBottom;
}

/**
 * Get scroll top state.
 *
 * @param state    MobileScrollState Vuex state.
 */
export function scrollTop(state: MobileScrollState): number {
    return state.scrollTop;
}

export default {
    isEventsDisabled,
    isFooterHidden,
    isHeaderHidden,
    scrollBottom,
    scrollTop,
} as GetterTree<MobileScrollState, RootState>;
