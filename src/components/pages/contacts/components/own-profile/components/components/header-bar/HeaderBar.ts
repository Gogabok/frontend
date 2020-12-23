import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { getAttachmentType, getPoster } from 'utils/files';

import AngleIcon from 'components/icons/AngleIcon.vue';


/**
 * Component letting user upload new profile gallery image.
 * Also, lets user to close profile page.
 */
@Component({
    components: {
        'angle-icon': AngleIcon,
    },
})
export default class OwnProfileHeaderBar extends Vue {
    /**
     * Files upload input element by ref.
     */
    public get input(): HTMLInputElement {
        return this.$refs.uploader as HTMLInputElement;
    }

    /**
     * List of extensions to be show in files picker.
     */
    public get extensionsList(): string {
        return `image/*,
         video/mp4,
         video/m4a,
         video/m4v,
         video/f4v,
         video/ogg,
         video/wmv,
     `;
    }

    /**
     * Open files upload system window.
     */
    public uploadMediaFiles(): void {
        this.input.click();
    }

    /**
     * Reads each uploaded file and adds it to user's gallery.
     *
     * @param event     `input` event.
     */
    public fileUploadHandler(event: InputEvent): void {
        const files = (event.target as HTMLInputElement).files as FileList;
        for(let i = 0; i < files.length; i++) {
            this.sendFile(files[i])
                .then(() => i === files.length - 1 && (this.input.value = ''));
        }
    }

    /**
     * Reads provided file and adds it to user's gallery.
     *
     * @param file      File to be read.
     */
    public async sendFile(file: File): Promise<void> {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async (): Promise<void> => {
            this.$emit('add-file-to-gallery', {
                item: {
                    id: (new Date().getTime()
                        + Math.round(Math.random() * 1000)).toString(),
                    poster: await getPoster(file, reader.result as string),
                    src: reader.result as string,
                    type: getAttachmentType(file),
                },
            });
        };
    }

    /**
     * Emits `close` event to close profile.
     */
    public close(): void {
        this.$emit('close');
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to subscribe to `upload-images`
     * event.
     */
    public mounted(): void {
        this.$parent.$on('upload-images', this.uploadMediaFiles);
    }

    /**
     * Hooks `beforeDestroy` Vue lifecycle stage to unsubscribe from
     * `upload-images` event.
     */
    public beforeDestroy(): void {
        this.$parent.$off('upload-images', this.uploadMediaFiles);
    }
}
