import Vue from 'vue';
import { SwiperSlide } from 'vue-awesome-swiper';
import { Component, Prop, Watch } from 'vue-property-decorator';

import { MessageAttachment } from 'models/Attachment';

import PlayIcon from 'components/icons/PlayIcon.vue';


/**
 * Media player slider item component.
 */
@Component({
    components: {
        'play-icon': PlayIcon,
        'swiper-slide': SwiperSlide,
    },
})
export default class SliderItem extends Vue {
    /**
     * Indicator whether video is being played.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isVideoRunning;

    /**
     * Media item.
     */
    @Prop({
        default: () => ({}),
        type: Object,
    }) item: MessageAttachment;

    /**
     * ID of slide item.
     */
    @Prop({
        default: '0',
        type: String,
    }) id;

    /**
     * Indicator whether image is scaled.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isScaled;

    /**
     * Indicator whether player interface is visible.
     */
    @Prop({
        default: true,
        type: Boolean,
    }) isInterfaceVisible;

    /**
     * Active slide ID.
     */
    @Prop({
        default: '0',
        type: String,
    }) activeSlideId;

    /**
     * Indicator whether video has been run at least once.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) hasVideoBeenRun;

    /**
     * Amount of times user clicked in last 200ms.
     */
    private click: number = 0;

    /**
     * Handler for click/tap action.
     * Hides previews on first click.
     * Runs `toggleScale()` on second click.
     */
    tapHandler(type?: string): void {
        if('ontouchstart' in window) {
            this.click++;
            setTimeout(() => {
                if(type !== 'video') {
                    this.$emit('set-interface', !this.isInterfaceVisible);
                }
                this.click = 0;
                if(this.click == 2)  this.toggleScale();
            }, 200);
        }
    }

    /**
     * Toggles video.
     */
    public togglePlay(): void {
        this.$emit('toggle-video');
    }

    /**
     * Toggles pagination on desktop devices.
     */
    public imageClickHandler(): void {
        if(!('ontouchstart' in window)) {
            this.$emit('set-interface', !this.isInterfaceVisible);
        }
    }

    /**
     * Scales the image/video to 2x or backwards.
     */
    toggleScale(): void {
        this.$emit('set-scaled', !this.isScaled);
    }

    /**
     * Plays video. Also, adds 'ended' eventListener with [`handleVideoEnd`]
     * callback if video is being run for the first time.
     *
     * @param video     Video element to be played.
     */
    public playVideo(video: HTMLVideoElement): void {
        if(!this.hasVideoBeenRun) this.$emit('video-has-been-run');

        if(!video.onended) {
            video.addEventListener('ended', this.handleVideoEnd);
        }

        video.controls = false;
        video.play();
    }

    /**
     * Pauses video.
     *
     * @param video     Video element to be paused.
     */
    public pauseVideo(video: HTMLVideoElement): void {
        video.pause();
    }

    /**
     * Emits `video-ended` event, sets video currentTime to 0.
     * Also, removes `ended` listener.
     */
    public handleVideoEnd(): void {
        const video = this.$el.querySelector(
            `[id="media-${this.activeSlideId}"]`,
        ) as HTMLVideoElement;
        if(!video) return;

        video.removeEventListener('ended', this.handleVideoEnd);
        video.currentTime = 0;
        this.$emit('video-ended');
        this.$emit('set-interface', true);
    }

    /**
     * Synchronizes video element to app `isVideoRunning` indicator.
     */
    @Watch('isVideoRunning')
    isVideoRunningWatcher(isRunning: boolean): void {
        const video = this.$el.querySelector('video');
        if(!(video && video.id === `media-${this.activeSlideId}`)) return;
        isRunning
            ? this.playVideo(video)
            : this.pauseVideo(video);
    }

    /**
     * Synchronizes visual styles with isScaled indicator.
     *
     * @param isScaled    Indicator whether media item is scaled.
     */
    @Watch('isScaled')
    isScaledWatcher(isScaled: boolean): void {
        const item = this.$el.querySelector(
            `[id="media-${this.activeSlideId}"]`,
        ) as HTMLElement;
        if(!item) return;
        isScaled
            ? item.style.transform = 'scale(1)'
            : item.style.transform = 'scale(2)';
    }

    /**
     * Stops and resets video playtime before slider changes.
     *
     * @param video         Video element to be reset.
     */
    public beforeSlideChangeHandler(video: HTMLVideoElement): void {
        video.pause();
        video.removeEventListener('ended', this.handleVideoEnd);
        video.currentTime = 0;
    }

    /**
     * Calls `beforeSlideChangeHandler` on current slide if it has video being
     * played.
     */
    @Watch('activeSlideId')
    activeSlideIdWatcher(): void {
        const video = this.$el.querySelector('video');
        if(!video) return;
        const isVideoPlaying =
            video.currentTime > 0 && !video.paused && !video.ended;
        if(isVideoPlaying) {
            this.beforeSlideChangeHandler(video);
        }
    }
}
