import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { MediaCaptureDevice } from 'models/MediaCaptureDevice';

import CallModule from 'store/modules/call';

import {
    GET_AUDIO_DEVICES,
    GET_VIDEO_DEVICES,
} from 'store/modules/call/getters';

import AngleIcon from 'components/icons/AngleIcon.vue';
import PlusIcon from 'components/icons/PlusIcon.vue';


const callModule = namespace(CallModule.vuexName);

/**
 * Call settings component allowing user to change input video and audio
 * devices.
 */
@Component({
    components: {
        'angle-icon': AngleIcon,
        'plus-icon': PlusIcon,
    },
})
export default class VideoCallSettings extends Vue {
    /**
     * List of available video sources.
     */
    @callModule.Getter(GET_VIDEO_DEVICES)
    public storeVideoDevices: MediaCaptureDevice[];

    /**
     * List of available audio devices.
     */
    @callModule.Getter(GET_AUDIO_DEVICES)
    public audioDevices: MediaCaptureDevice[];

    /**
     * List of available video devices.
     */
    public get videoDevices(): MediaCaptureDevice[] {
        return this.storeVideoDevices.filter(device => device.id !== 'screen');
    }

    /**
     * Emits `close` event to close settings.
     */
    public closeSettings(): void {
        this.$emit('close');
    }

    /**
     * Emits `select-video-device` to update active video device.
     *
     * @param event                     `change` event.
     */
    public selectVideoDevice(event: InputEvent): void {
        this.$emit(
            'select-video-device',
            (event.target as HTMLSelectElement).value,
        );
    }

    /**
     * Emits `select-audio-device` to update active video device.
     *
     * @param event                     `change` event.
     */
    public selectAudioDevice(event: InputEvent): void {
        this.$emit(
            'select-audio-device',
            (event.target as HTMLSelectElement).value,
        );
    }
}
