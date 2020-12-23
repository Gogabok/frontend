import 'swiper/swiper-bundle.css';

import {
    Mousewheel,
    Swiper as SwiperClass,
    SwiperOptions,
} from 'swiper/core';
import Vue from 'vue';
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter';
import { Component, Prop } from 'vue-property-decorator';

import { MessageAttachment } from 'models/Attachment';

import SliderItem from './components/slider-item/SliderItem.vue';


type SwiperVirtualData = {
    from: number,
    to: number,
    slides: MessageAttachment[],
    offset: number,
}

SwiperClass.use([ Mousewheel ]);
const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass);

/**
 * Media player slider component.
 */
@Component({
    components: {
        'slider-item': SliderItem,
        'swiper': Swiper,
        'swiper-slide': SwiperSlide,
    },
})
export default class MediaPlayerSlider extends Vue {
    /**
     * Indicator whether player interface is visible.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isInterfaceVisible;

    /**
     * Video player gallery.
     */
    @Prop({
        default: () => ([]),
        type: Array,
    }) gallery: MessageAttachment[];

    /**
     * Index of active slide.
     */
    @Prop({
        default: 0,
        type: Number,
    }) activeSlideIndex;

    /**
     * Indicator whether main slider is being updated.
     */
    public isSlideChanging: boolean = false;

    /**
     * Indicator whether thumbnail slider is being updated.
     */
    public isThumbChanging: boolean = false;

    /**
     * Slider virtualization data.
     */
    public virtualData: SwiperVirtualData = {
        from: 0,
        offset: 0,
        slides: [],
        to: 0,
    };

    /**
     * Thumbnail swiper options.
     */
    public thumbnailsSwiperOptions: SwiperOptions = {
        breakpoints: {
            // when window width is <= 800px
            800: {
                direction: 'vertical',
            },
        },
        centeredSlides: true,
        direction: 'horizontal',
        freeMode: true,
        freeModeMomentumBounceRatio: 0.7,
        freeModeMomentumRatio: 0.7,
        freeModeMomentumVelocityRatio: 0.7,
        freeModeSticky: true,
        mousewheel: true,
        on: {
            progress: (): void => {
                this.isThumbChanging = true;
            },
            touchStart: (): void => {
                this.isThumbChanging = true;
            },
            transitionEnd: (): void => {
                setTimeout(() => {
                    this.isThumbChanging = false;
                }, 10);
            },
        },
        slideToClickedSlide: true,
        slidesPerView: 'auto',
    }

    /**
     * Swiper options.
     */
    public swiperOptions: SwiperOptions = {
        grabCursor: true,
        keyboard: {
            enabled: true,
        },
        on: {
            touchStart: (): void => {
                this.isSlideChanging = true;
            },
            transitionEnd: (): void => {
                setTimeout(() => {
                    this.isSlideChanging = false;
                }, 10);
            },
        },
        preventInteractionOnTransition: false,
        simulateTouch: true,
        updateOnWindowResize: true,
        zoom: true,
    }

    /**
     * Sets swiper virtual slides information.
     *
     * @param data      Virtual slides information.
     */
    public setVirtualData(data: SwiperVirtualData): void {
        this.virtualData = data;
    }

    /**
     * Indicator whether video is currently being played.
     */
    public isVideoRunning: boolean = false;

    /**
     * Indicator whether video has been played at least once.
     */
    public hasVideoBeenRun: boolean = false;

    /**
     * Indicator whether media item is scaled.
     */
    public isScaled: boolean = false;

    /**
     * Swiper element.
     */
    public get mySwiper(): HTMLElement {
        return this.$refs.swipeElement as HTMLElement;
    }

    /**
     * Thumbnail swiper element.
     */
    public get thumbnailsSwiper(): HTMLElement {
        return this.$refs.thumbnailsSwiper as HTMLElement;
    }

    /**
     * Vue awesome swiper virtual slides position.
     */
    public get slideStyles(): string {
        return `left: ${this.virtualData.offset}px;`;
    }
    /**
     * Emits `close` event.
     */
    public closeHandler(): void {
        this.$emit('close');
    }

    /**
     * Sets `isScaled` state.
     *
     * @param newState    Indicator whether media item should be scaled.
     */
    public setScaleHandler(newState: boolean): void {
        this.isScaled = newState;
    }

    /**
     * Emits `set-interface` event.
     *
     * @param isVisible    Indicator whether interface should be visible.
     */
    public setInterface(isVisible: boolean): void {
        this.$emit('set-interface', isVisible);
    }

    /**
     * Sets thumbnails slider active index equal to main slider active index.
     */
    public slideChangeHandler(): void {
        if (this.isThumbChanging) return;
        const activeItem = this.$refs.swipeElement.$swiper.activeIndex;
        this.onSlideChange(activeItem);
        this.$refs.thumbnailsSwiper.$swiper.slideTo(activeItem, 10);
    }

    /**
     * Sets interface visible, stops running video and emits `slide-change`
     * event to update active slide index on the parent.
     *
     * @param index                     Index of the new active slide.
     */
    public onSlideChange(index: number): void {
        this.setInterface(true);
        // Used here due to lack of type definitions for swiper lib.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.$emit('slide-change', index);
        this.hasVideoBeenRun = false;
        if (this.isVideoRunning) this.isVideoRunning = false;
    }

    /**
     * Sets main slider active index equal to thumbnails slider active index.
     */
    public thumbChangeHandler(): void {
        if (this.isSlideChanging) return;
        const activeIndex = this.$refs.thumbnailsSwiper.$swiper.activeIndex;
        this.onSlideChange(activeIndex);
        this.$refs.swipeElement.$swiper.slideTo(activeIndex, 10);
    }

    /**
     * Scales active image to 1 before change slide, stops the video if it's
     * being played and shows pagination.
     */
    public slideTransitionStartHandler(): void {
        if(this.isScaled) this.isScaled = false;
    }

    /**
     * Plays or stops video depending on it's current state.
     */
    playHandler(): void {
        if (this.isVideoRunning) {
            this.isVideoRunning = false;
            this.setInterface(true);
        } else {
            this.isVideoRunning = true;
            this.setInterface(false);
        }
    }

    /**
     * Sets interface visible. Also, sets `isVideoRunning` indicator to false.
     */
    public videoEndHandler(): void {
        this.setInterface(true);
        this.isVideoRunning = false;
    }

    /**
     * Slides slider to provided slide index.
     * Also, removes `slide-player-to` listener as it's only needed once (on
     * first render).
     *
     * @param index     Index of the element to be shown on first render.
     */
    public slidePlayerTo(index: number): void {
        // Used here due to lack of type definitions for swiper lib.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.$refs.swipeElement.$swiper.slideTo(index, 0);
        this.$root.$off('slide-player-to', this.slidePlayerTo);
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to add `slide-player-to` event
     * listener.
     */
    public mounted(): void {
        this.$root.$on('slide-player-to', this.slidePlayerTo);
    }
}
