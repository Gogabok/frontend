import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import ListItem from './components/media-line-item/MediaLineItem.vue';


/**
 * Media player media line component.
 */
@Component({
    components: {
        'list-item': ListItem,
    },
})
export default class MediaLine extends Vue {
    /**
     * Indicator whether select mode is active.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isSelectMode;

    /**
     * List of selected media items.
     */
    @Prop({
        default: () => ([]),
        type: Array,
    }) selectedMedia;

    /**
     * Media items gallery.
     */
    @Prop({
        default: () => ([]),
        type: Array,
    }) gallery;

    /**
     * Active slide index.
     */
    @Prop({
        default: 0,
        type: Number,
    }) activeSlideIndex;

    /**
     * Disables scroll.
     */
    public disableScroll: () => void = () => undefined;

    /**
     * Enables scroll.
     */
    public enableScroll: () => void = () => undefined;

    /**
     * Hooks `mounted` Vue lifecycle stage to scroll to active slide.
     * Also, sets `disableScroll` and `enableScroll` functions depending on
     * browser.
     */
    public mounted(): void {
        setTimeout(() => {
            const activeSlide = document.querySelector(
                `[data-index="${this.activeSlideIndex}"]`,
            ) as HTMLElement;

            const offset = (
                this.$el.clientHeight - activeSlide.clientHeight
            ) / 2;

            this.$el.scrollTo(
                0,
                activeSlide.getBoundingClientRect().top - offset,
            );
        }, 100);

        const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

        function preventDefault(e) {
            e.preventDefault();
        }

        function preventDefaultForScrollKeys(e) {
            if (keys[e.keyCode]) {
                preventDefault(e);
                return;
            }
        }

        // modern Chrome requires { passive: false } when adding event
        let supportsPassive = false;
        try {
            window.addEventListener(
                'test' as 'click',
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                null,
                Object.defineProperty(
                    {},
                    'passive',
                    {
                        get:() => supportsPassive = true,
                    },
                ),
            );
        } catch(e) {
            console.log(
                'Your browser doesn\'t support passive flag on event listener',
            );
        }

        const wheelOpt: boolean | EventListenerOptions | undefined =
            // Used here due to passive flag not being well supported.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            supportsPassive ? { passive: false } : false;
        const wheelEvent = 'onwheel' in document.createElement('div')
            ? 'wheel'
            : 'mousewheel';

        function disableScroll() {
            // older FF
            window.addEventListener(
                'DOMMouseScroll',
                preventDefault,
                false,
            );

            // modern desktop
            window.addEventListener(wheelEvent, preventDefault, wheelOpt);

            // mobile
            window.addEventListener(
                'touchmove',
                preventDefault,
                wheelOpt,
            );

            window.addEventListener(
                'keydown',
                preventDefaultForScrollKeys,
                false,
            );
        }

        function enableScroll() {
            window.removeEventListener(
                'DOMMouseScroll',
                preventDefault,
                false,
            );

            window.removeEventListener(wheelEvent, preventDefault, wheelOpt);

            window.removeEventListener(
                'touchmove',
                preventDefault,
                wheelOpt,
            );
            window.removeEventListener(
                'keydown',
                preventDefaultForScrollKeys,
                false,
            );
        }

        this.disableScroll = disableScroll;
        this.enableScroll = enableScroll;
    }
}
