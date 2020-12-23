import bowser from 'bowser';
import { Store } from 'vuex';

import EventBus from 'plugins/EventBus';

import ScrollEvents from 'models/old/ScrollEvents';

import MobileScrollModule from 'store/modules/mobile-scroll-controller';

import * as MobileScrollActions from 'store/modules/mobile-scroll-controller/actions';
import * as MobileScrollGetters from 'store/modules/mobile-scroll-controller/getters';


const browser = typeof window !== 'undefined'
    ? bowser.getParser(window.navigator.userAgent)
    : '';

/**
 * MobileScrollController, that control scroll events for mobile devices.
 */
export default class MobileScrollController {

    /**
     * Vuex root store.
     */
    private store: Store<Record<string, unknown>>;

    /**
     * Creates MobileScrollController instance
     *
     * @param store   Vuex root store.
     */
    public constructor(store: Store<Record<string, unknown>>) {
        this.store = store;
        window.addEventListener('scroll', (event) => {
            this.initScrollbarListener(event);
        });
    }

    /**
     * Sets onscroll event listener for mobile devices.
     */
    public initScrollbarListener(event: Event): void {
        const moduleName = MobileScrollModule.vuexName;

        if (
            this.store.getters[
                `${moduleName}/${MobileScrollGetters.IS_EVENTS_DISABLED}`
            ]
        ) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const scrollingElement: HTMLElement = (event.target as any)
            .scrollingElement;

        if (scrollingElement.scrollTop <= 0) {
            EventBus.$emit(ScrollEvents.REACHED_TOP);
        }

        if (scrollingElement.scrollTop + 100 >=
            (scrollingElement.scrollHeight
                - this.getScrollingElementClientHeight(scrollingElement))
        ) {
            EventBus.$emit(ScrollEvents.REACHED_BOTTOM);
        }

        const scrollBottom = scrollingElement.scrollHeight
            - scrollingElement.scrollTop
            - window.innerHeight;

        this.store.dispatch(
            `${moduleName}/${MobileScrollActions.UPDATE_SCROLL_STATE}`,
            { scrollBottom, scrollTop: scrollingElement.scrollTop },
        );
    }

    /**
     * Returns scrolling element client height value on mobile device.
     *
     * @param element   Element for which must return client height.
     */
    public getScrollingElementClientHeight(
        element?: HTMLElement,
    ): number {
        if (browser && browser.getOSName(true) === 'ios'
            && browser.getPlatformType(true) === 'mobile'
        ) {
            return (document.querySelector('html')?.clientHeight || 0) + 84;
        }
        return element ? element.clientHeight : 0;
    }
}
