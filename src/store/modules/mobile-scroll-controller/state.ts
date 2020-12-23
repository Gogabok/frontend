import ScrollOwner from 'models/old/ScrollOwner';


/**
 * MobileScrollController Vuex state.
 */
export default class MobileScrollState {

    /**
     * Flag, that shows is header must be hidden.
     */
    public isHeaderHidden = false;

    /**
     * Flag, that shows is footer must be hidden.
     */
    public isFooterHidden = false;

    /**
     * Flag, that shows is scroll events must be ignored.
     */
    public isEventsDisabled = false;

    /**
     * Scroll direction. Scrolled to top if greater than 0, to bottom if lower
     * than 0 and yet not scrolled when equal to 0.
     */
    public scrollDirection: number = 0;

    /**
     * Stack of scroll owners. When scroll owner component destroyed - remove
     * them from stack and find previous scroll owner component.
     */
    public scrollOwners: ScrollOwner[] = [];

    /**
     * Scroll position from top of window.
     */
    public scrollTop = 0;

    /**
     * Scroll position from bottom of window.
     */
    public scrollBottom = 0;

    /**
     * Remember last scroll position(from bottom) to find scroll direction.
     */
    public lastScrollPosition = 0;
}
