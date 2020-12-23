import { MutationTree } from 'vuex';

import MobileScrollState from 'store/modules/mobile-scroll-controller/state';


/**
 * Name of set is header hidden mutation.
 */
export const SET_IS_HEADER_HIDDEN: string = 'setIsHeaderHidden';

/**
 * Name of set is header hidden mutation.
 */
export const SET_IS_FOOTER_HIDDEN: string = 'setIsFooterHidden';

/**
 * Name of set is events disabled mutation.
 */
export const SET_IS_EVENTS_DISABLED: string = 'setIsEventsDisabled';

/**
 * Name of set scroll direction mutation.
 */
export const SET_SCROLL_DIRECTION: string = 'setScrollDirection';

/**
 * Name of set scroll bottom mutation.
 */
export const SET_SCROLL_BOTTOM: string = 'setScrollBottom';

/**
 * Name of set scroll top mutation.
 */
export const SET_SCROLL_TOP: string = 'setScrollTop';

/**
 * Name of set last scroll position mutation.
 */
export const SET_LAST_SCROLL_POSITION: string = 'setLastScrollPosition';

/**
 * Sets is header hidden state.
 *
 * @param state       MobileScrollState Vuex state.
 * @param isHidden    Is header hidden value, that will be set to the state.
 */
export function setIsHeaderHidden(
    state: MobileScrollState,
    isHidden: boolean,
): void {
    state.isHeaderHidden = isHidden;
}

/**
 * Sets is footer hidden state.
 *
 * @param state       MobileScrollState Vuex state.
 * @param isHidden    Is footer hidden value, that will be set to the state.
 */
export function setIsFooterHidden(
    state: MobileScrollState,
    isHidden: boolean,
): void {
    state.isFooterHidden = isHidden;
}

/**
 * Sets is events disabled state.
 *
 * @param state         MobileScrollState Vuex state.
 * @param isDisabled    Is events disabled flag, that will be set to the state.
 */
export function setIsEventsDisabled(
    state: MobileScrollState,
    isDisabled: boolean,
): void {
    state.isEventsDisabled = isDisabled;
}

/**
 * Sets scroll direction state.
 *
 * @param state              MobileScrollState Vuex state.
 * @param scrollDirection    Scroll direction value, that will be set
 *                           to the state.
 */
export function setScrollDirection(
    state: MobileScrollState,
    scrollDirection: number,
): void {
    state.scrollDirection = scrollDirection;
}

/**
 * Sets scroll bottom state.
 *
 * @param state           MobileScrollState Vuex state.
 * @param scrollBottom    Scroll bottom value, that will be set to the state.
 */
export function setScrollBottom(
    state: MobileScrollState,
    scrollBottom: number,
): void {
    state.scrollBottom = scrollBottom;
}

/**
 * Sets scroll top state.
 *
 * @param state        MobileScrollState Vuex state.
 * @param scrollTop    Scroll top value, that will be set to the state.
 */
export function setScrollTop(
    state: MobileScrollState,
    scrollTop: number,
): void {
    state.scrollTop = scrollTop;
}

/**
 * Sets scroll last position state.
 *
 * @param state       MobileScrollState Vuex state.
 * @param position    Scroll last position value, that will be set to the state.
 */
export function setLastScrollPosition(
    state: MobileScrollState,
    position: number,
): void {
    state.lastScrollPosition = position;
}

export default {
    setIsEventsDisabled,
    setIsFooterHidden,
    setIsHeaderHidden,
    setLastScrollPosition,
    setScrollBottom,
    setScrollDirection,
    setScrollTop,
} as MutationTree<MobileScrollState>;
