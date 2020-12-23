import { Component } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';

import { MessageAttachment } from 'models/Attachment';
import { Message } from 'models/Message';

import counter from 'mixins/counter.ts';
import filters from 'mixins/filters.ts';
import camera from 'mixins/web-camera.ts';

import TEST_USER from 'localdata/user.ts';
import { createVideoPoster } from 'utils/posters';

import PhotoIcon from 'components/icons/PhotoIcon.vue';
import PlayIcon from 'components/icons/PlayIcon.vue';
import PlusIcon from 'components/icons/PlusIcon.vue';
import RotateIcon from 'components/icons/RotateIcon.vue';
import SendMessageIcon from 'components/icons/SendMessageIcon.vue';


type CameraInterfaceType = 'photo' | 'video';

/**
 * Component, that allows user to send a photo or video message.
 */
@Component({
    components: {
        'photo-icon': PhotoIcon,
        'play-icon': PlayIcon,
        'plus-icon': PlusIcon,
        'rotate-icon': RotateIcon,
        'send-message-icon': SendMessageIcon,
    },
    filters,
})
export default class CameraInterface extends mixins(counter, camera) {

    /**
     * Indicator whether video preview is played.
     */
    public isVideoBeingPlayed: boolean = false;

    /**
     * Timer counter element.
     */
    public get counterBox(): HTMLElement {
        return this.$refs.counterBox as HTMLElement;
    }

    /**
     * Rotate camera icon element.
     */
    public get rotateIcon(): HTMLElement {
        return this.$refs.rotateIcon as HTMLElement;
    }

    /**
     * Starts or stops recording based on the current state.
     */
    public toggleVideoRecording(): void {
        if (!this.isVideoBeingRecorded) {
            this.startCounter();

            setTimeout(() => {
                this.startVideoRecord();
            }, 200);
        } else {
            setTimeout(() => {
                this.clearCounter();
                this.stopVideoRecord();
            }, 50);
        }
    }

    /**
     * Inits camera interface.
     */
    public openCamera(type: CameraInterfaceType): void {
        this.initCamera(type);
    }

    /**
     * Closes camera.
     */
    public closeCamera(): void {
        this.$emit('close');
    }

    /**
     * Creates message object and sends it.
     */
    public toggleVideo(): void {
        if (this.isVideoBeingPlayed) {
            this.pauseVideo();
        } else {
            this.playVideo();
        }
    }

    /**
     * Pauses video preview.
     */
    public pauseVideo(): void {
        this.videoElement.pause();
        this.videoElement.removeEventListener('ended', this.handleVideoEnd);
        this.isVideoBeingPlayed = false;
    }

    /**
     * Plays video preview.
     */
    public playVideo(): void {
        this.videoElement.play();
        this.videoElement.addEventListener('ended', this.handleVideoEnd);
        this.isVideoBeingPlayed = true;
    }

    /**
     * Stops video, sets `isVideoBeingPlayed` to false and sets currentTime
     * to 0.
     * Also, removes `ended` listener from the video preview element.
     */
    public handleVideoEnd(): void {
        this.isVideoBeingPlayed = false;
        this.videoElement.currentTime = 0;
        this.videoElement.removeEventListener('ended', this.handleVideoEnd);
    }

    /**
     * Creates message object and sends it.
     */
    public async sendMessage(message?: string): Promise<void> {
        const poster = this.interfaceType === 'photo'
            ? this.src
            : await createVideoPoster(this.src);

        const size = this.fileSize;

        const attachment: MessageAttachment = {
            extension: this.src, // TODO: Check file extensions.
            id: `attachment-${new Date().getTime()}`,
            name: this.src.substring(0, 25),
            poster,
            size,
            src: this.src,
            type: this.interfaceType === 'video' ? 'video' : 'image',
        };

        const payload: Message = {
            attachment,
            forwarded: false,
            forwardedFromUser: null,
            id: 'user-video-message' + new Date().getTime().toString(),
            isUserMessage: true,
            mediaGroup: null,
            message: message || '',
            num: TEST_USER.num,
            repliedMessage: null,
            status: 'sent',
            time: new Date().getTime(),
            userId: TEST_USER.id,
        };
        this.$emit('send-message', payload);
        this.closeCamera();
    }


    /**
     * Hooks `mounted` Vue lifecycle stage to add `open-camera` and
     * `close-camera` events listeners.
     */
    public mounted(): void {
        this.$parent.$on('open-camera', this.openCamera);
        this.$parent.$on('close-camera', this.closeCamera);
        this.$parent.$on('send-video-or-photo-message', this.sendMessage);
    }

    /**
     * Hooks `beforeDestroy` Vue lifecycle stage to remove `open-camera` and
     * `close-camera` events listeners.
     */
    public beforeDestroy(): void {
        this.$parent.$off('open-camera', this.openCamera);
        this.$parent.$off('close-camera', this.closeCamera);
        this.$parent.$off('send-video-or-photo-message', this.sendMessage);
    }
}
