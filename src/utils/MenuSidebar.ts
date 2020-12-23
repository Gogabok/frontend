import BodyScrollLock from 'plugins/BodyScrollLock';


/**
 * MenuScroll element selector.
 */
const SCROLL_SELECTOR: string = '.menu-scroll';

/**
 * Gets HTML element with SCROLL_SELECTOR
 *
 * @returns   Element or null, used also for checking
 *            if MenuScroll element exists.
 */
export function getMenuScroll(): HTMLElement | null {
    return document.querySelector(SCROLL_SELECTOR);
}

/**
 * Locks all elements for scrolling except element with SCROLL_SELECTOR,
 * if it exists.
 */
export function lockMenuSidebar(): void {
    const menu = getMenuScroll();
    if (menu) {
        BodyScrollLock.lockBackground(menu);
    }
}
