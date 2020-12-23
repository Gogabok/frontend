import {
    Pagination,
    Swiper as SwiperClass,
    SwiperOptions,
} from 'swiper/core';
import Vue from 'vue';
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter';
import { Component, Prop, Watch } from 'vue-property-decorator';

import { Contact } from 'models/Contact';
import { ProfileMediaItem } from 'models/ProfileMediaItem';
import {
    UserStatusCode,
} from 'models/UserStatus';

import MediaPlayer from 'components/common/media-player/MediaPlayer.vue';

import AvatarEditor from './components/avatar-editor/AvatarEditor.vue';
import Slide from './components/slide/Slide.vue';


SwiperClass.use([ Pagination ]);
const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass);

type Swiper = HTMLElement & {
    $el: HTMLElement,
    $swiper: {
        activeIndex: number,
        slideTo: (index: number, time?: number) => undefined,
        slideNext: (duration: number) => void,
        slidePrev: (duration: number) => void,
    },
}

/**
 * Component displaying profile owner's profile gallery.
 */
@Component({
    components: {
        'avatar-editor': AvatarEditor,
        'media-player': MediaPlayer,
        'slide': Slide,
        'swiper': Swiper,
        'swiper-slide': SwiperSlide,
    },
})
export default class OwnProfileAvatarSlider extends Vue {
    /**
     * Profile owner.
     */
    @Prop({ required: true }) profileOwner: Contact;

    /**
     * Indicator whether mobile mode is active (whether it's native or force).
     */
    @Prop({ required: true }) isMobileMode: boolean;

    /**
     * Profile owner's status.
     */
    @Prop({
        default: 'is-online',
        type: String,
    }) status: UserStatusCode;

    /**
     * Indicator whether avatar editor is visible.
     */
    public isAvatarEditorMode: boolean = false;

    /**
     * Active slide index.
     */
    public activeSlideIndex: number = 0;

    /**
     * Swiper options.
     */
    public swiperOption: SwiperOptions = {
        keyboard: {
            enabled: true,
            onlyInViewport: false,
        },
        navigation: {
            nextEl: '.profile-settings__avatar-slider__arrow.right',
            prevEl: '.profile-settings__avatar-slider__arrow.left',
        },
        on: {
            touchEnd: (): void => this.touchEndHandler(),
            touchStart: (): void => this.touchStartHandler(),
        },
        pagination: {
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 1,
            el: '.swiper-pagination',
            type: 'bullets',
        },
        slidesPerView: 1,
    };

    /**
     * Swiper element by ref.
     */
    public get swiper(): Swiper {
        return this.$refs.swiper as Swiper;
    }

    /**
     * Avatar action button label.
     */
    public get avatarLabel(): string {
        return this.profileOwner.avatarId === this.activeImageId
            ? 'Edit avatar'
            : 'Set as avatar';
    }

    /**
     * Image currently being shown on slider.
     */
    public get activeSlideImage(): string {
        return this.profileOwner.gallery.length
            ? this.profileOwner.gallery[this.activeSlideIndex].poster
            : require('~assets/img/gapopa-img.svg');
    }

    /**
     * ID of the image currently being shown on slider.
     */
    public get activeImageId(): string {
        return this.profileOwner.gallery.length
            ? this.profileOwner.gallery[this.activeSlideIndex].id
            : 'defaultAvatar';
    }

    /**
     * Emits `open-profile-media-player` to open media player.
     */
    public setMediaPlayerVisibility(): void {
        const gallery = this.profileOwner.gallery.length
            ? this.profileOwner.gallery
            : [{
                id: 'default-item',
                poster: require('~assets/img/gapopa.svg'),
                src: require('~assets/img/gapopa.svg'),
                type: 'image',
            }];
        this.$root.$emit('open-profile-media-player', {
            gallery,
            slide: this.activeSlideIndex,
        });
    }

    /**
     * Emits `upload-images` event to open files upload system window.
     */
    public uploadImages(): void {
        this.$parent.$emit('upload-images');
    }

    /**
     * Sets active image as avatar.
     */
    public setActiveAsAvatar(): void {
        this.updateAvatarHandler(this.activeSlideImage, this.activeImageId);
    }

    /**
     * Opens avatar editor.
     */
    public editAvatar(): void {
        this.isAvatarEditorMode = true;
    }

    /**
     * Disables swipe events.
     */
    public touchEndHandler(): void {
        this.$router.replace({
            path: this.$route.path,
            query: Object.fromEntries(
                Object.entries(this.$route.query)
                    .filter(([key]) => key !== 'dsw'),
            ),
        });
    }

    /**
     * Emits `update-avatar` event to update group avatar.
     *
     * @param src                       New avatar source link.
     * @param id                        ID of the image to be set as avatar.
     */
    public updateAvatarHandler(src: string, id: string): void {
        this.$emit('update-avatar', src, id);
    }

    /**
     * Closes avatar editor.
     */
    public closeAvatarEditorHandler(): void {
        this.isAvatarEditorMode = false;
    }

    /**
     * Enables swipe events.
     */
    public touchStartHandler(): void {
        this.$router.replace({
            path: this.$route.path,
            query: { ...this.$route.query, dsw: 'true' },
        });
    }

    /**
     * Synchronizes active slide index to swiper's active index.
     */
    public slideChangeHandler(): void {
        this.activeSlideIndex = this.swiper.$swiper.activeIndex;
    }

    /**
     * Scrolls slider to the next slide.
     */
    public nextSlide(): void {
        this.swiper.$swiper.slideNext(200);
    }

    /**
     * Scrolls slider to the previous slide.
     */
    public prevSlide(): void {
        this.swiper.$swiper.slidePrev(200);
    }

    /**
     * Slides to first slide on new image upload.
     *
     * @param newGal                    New gallery.
     * @param oldGal                    Prev gallery.
     */
    @Watch('gallery')
    watchGallery(
        newGal: ProfileMediaItem[],
        oldGal: ProfileMediaItem[],
    ): void {
        if(newGal.length > oldGal.length) {
            this.swiper.$swiper.slideTo(0);
        }
    }
}
