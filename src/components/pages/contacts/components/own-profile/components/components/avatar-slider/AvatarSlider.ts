import 'swiper/swiper-bundle.css';

import Vue from 'vue';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import { Component, Prop, Watch } from 'vue-property-decorator';

import { CurrentUser } from 'models/CurrentUser';
import { ProfileMediaItem } from 'models/ProfileMediaItem';

import AvatarEditor from 'components/pages/contacts/components/own-profile/components/components/avatar-editor/AvatarEditor.vue';

import Slide from './components/slide/Slide.vue';


type Swiper = HTMLElement & {
    $swiper: {
        activeIndex: number,
        slideTo: (index: number, time?: number) => undefined,
        slideNext: (duration: number) => void,
        slidePrev: (duration: number) => void,
    },
}

/**
 * Component, that displays user's profile gallery.
 */
@Component({
    components: {
        'avatar-editor': AvatarEditor,
        'slide': Slide,
        'swiper': Swiper,
        'swiper-slide': SwiperSlide,
    },
})
export default class OwnProfileAvatarSlider extends Vue {
    /**
     * List of items to be displayed in gallery.
     */
    @Prop({ required: true }) user: CurrentUser;

    /**
     * Indicator whether mobile mode is active (whether it's native of forced).
     */
    @Prop({ required: true }) isMobileMode: boolean;

    /**
     * Updates user's about information.
     */
    @Prop({ required: true }) changeUserData: (payload: {
        data: Record<string, unknown>,
    }) => Promise<void>

    /**
     * Swiper options.
     */
    public swiperOption: Record<string, unknown> = {
        autoplay: false,
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
            dynamicMainBullets: 0,
            el: '.swiper-pagination',
            type: 'bullets',
        },
        slidesPerView: 1,
    };

    /**
     * Indicator whether avatar editor is visible.
     */
    public isAvatarEditorMode: boolean = false;

    /**
     * Active slide index.
     */
    public activeSlideIndex: number = 0;

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
        return this.user.avatarId === this.activeImageId
            ? 'Edit avatar'
            : 'Set as avatar';
    }

    /**
     * Image currently being shown on slider.
     */
    public get activeSlideImage(): string {
        return this.user.gallery.length
            ? this.user.gallery[this.activeSlideIndex].poster
            : require('~assets/img/gapopa-img.svg');
    }

    /**
     * ID of the image currently being shown on slider.
     */
    public get activeImageId(): string {
        return this.user.gallery.length
            ? this.user.gallery[this.activeSlideIndex].id
            : 'defaultAvatar';
    }

    /**
     * Emits `open-profile-media-player` event to open media player.
     */
    public setMediaPlayerVisibility(): void {
        const gallery = this.user.gallery.length
            ? this.user.gallery
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
     * Enables swipe events.
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
     * Disables swipe events.
     */
    public touchStartHandler(): void {
        this.$router.replace({
            path: this.$route.path,
            query: { ...this.$route.query, dsw: 'true' },
        });
    }

    /**
     * Synchronizes `activeSlideIndex` with swiper active slide index.
     */
    public slideChangeHandler(): void {
        this.activeSlideIndex = this.swiper.$swiper.activeIndex;
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
     * Updates user's avatar.
     *
     * @param src           Source to avatar to be set.
     * @param imageId       ID of the image to be set as avatar.
     */
    public updateAvatarHandler(src: string, imageId: string): void {
        this.changeUserData({
            data: {
                avatarId: imageId,
                avatarPath: src,
            },
        });
    }

    /**
     * Closes avatar editor.
     */
    public closeAvatarEditorHandler(): void {
        this.isAvatarEditorMode = false;
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
     * Slides to the first image on a new item upload.
     *
     * @param newGal    New gallery.
     * @param oldGal    Prev gallery.
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
