/**
 * Scroll events that EventBus can emit or listens on.
 */
enum ScrollEvents {
    REACHED_TOP = 'reached-top',
    REACHED_BOTTOM = 'reached-bottom',
    SCROLL_CREATED = 'scroll_created',
    SCROLL_DESTROYED = 'scroll_destroyed',
}

export default ScrollEvents;
