import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import PlayIcon from 'components/icons/PlayIcon.vue';


/**
 * Video preview component, that allows user to preview video file.
 */
@Component({
    components: {
        'play-icon': PlayIcon,
    },
})
export default class VideoPreview extends Vue {
    /**
     * Link to the video to be previewed.
     */
    @Prop({
        default: '',
        type: String,
    }) videoSrc;

    /**
     * Indicator whether video is being played.
     */
   public isPlayedVideo: boolean = false;

    /**
     * Video html component element.
     */
    get video(): HTMLVideoElement {
        return this.$refs.video as HTMLVideoElement;
    }

    /**
     * Toggles video.
     */
    public handleVideoClick(): void {
        if (this.isPlayedVideo) {
            this.pauseVideo();
        } else {
            this.startVideo();
        }
    }

    /**
     * Pauses the video.
     */
    public pauseVideo(): void {
        this.isPlayedVideo = false;
        this.video.pause();
    }

    /**
     * Plays the video
     */
    public startVideo(): void {
        this.video.play()
            .then(() => this.isPlayedVideo = true);
    }

    /**
     * Sets `isVideoPlayed` indicator to false.
     */
    public handleVideoEnd(): void {
        this.isPlayedVideo = false;
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to add `ended` event listener.
     */
    public mounted(): void {
        this.video.addEventListener('ended', this.handleVideoEnd);
    }

    /**
     * Hooks `beforeDestroy` Vue lifecycle stage to remove `ended` event
     * listener.
     */
    public beforeDestroy(): void {
        this.video.removeEventListener('ended', this.handleVideoEnd);
    }
}
