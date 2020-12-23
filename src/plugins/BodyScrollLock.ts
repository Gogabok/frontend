import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock';

import DefaultTheme from '../themes/default';


/**
 * Wrapper on top of body-scroll-lock package.
 */
export default class BodyScrollLock {

    /**
     * Locks body scrolling and adds locked class to body.
     *
     * @param element   Element for which scroll must be not lock.
     */
    public static lockBackground(element: HTMLElement): void {
        document.body.classList.add(DefaultTheme.classes.bodyLocked);
        disableBodyScroll(element);
    }

    /**
     * Unlocks body scrolling and removes locked class from body.
     */
    public static unlockBackground(): void {
        document.body.classList.remove(DefaultTheme.classes.bodyLocked);
        clearAllBodyScrollLocks();
    }

}
