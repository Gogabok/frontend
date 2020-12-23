import Vue from 'vue';
import { SwiperSlide } from 'vue-awesome-swiper';
import { Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { ProfileMediaItemType } from 'models/ProfileMediaItem';

import GeneralParameters from 'store/modules/general-parameters';

import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';

import PlayIcon from 'components/icons/PlayIcon.vue';


const generalParameters = namespace(GeneralParameters.vuexName);

/**
 * Component displaying profile gallery slide.
 */
@Component({
    components: {
        'play-icon': PlayIcon,
        'swiper-slide': SwiperSlide,
    },
})
export default class Slide extends Vue {
    /**
     * Profile item poster.
     */
    @Prop({
        default: '',
        type: String,
    }) poster;

    /**
     * Profile item source file link.
     */
    @Prop({
        default: '',
        type: String,
    }) src;

    /**
     * Profile item type.
     */
    @Prop({
        default: 'image',
        type: String,
    }) type: ProfileMediaItemType;

    /**
     * Profile item ID.
     */
    @Prop({
        default: '',
        type: String,
    }) id;

    /**
     * Indicator whether mobile mode is active.
     */
    @generalParameters.Getter(IS_MOBILE_MODE)
    public isNativeMobileMode: boolean;

    /**
     * Indicator whether force mobile mode is active.
     */
    @generalParameters.Getter(IS_FORCE_MOBILE_MODE)
    public isForceMobileMode: boolean;

    /**
     * Indicator whether mobile mode is active (whether it's force or native).
     */
    public get isMobileMode(): boolean {
        return this.isNativeMobileMode && this.isForceMobileMode;
    }

    /**
     * Emits `open-media-player` to open media player.
     */
    public openMediaPlayer(): void {
        this.$emit('open-media-player', this.id);
    }
}
