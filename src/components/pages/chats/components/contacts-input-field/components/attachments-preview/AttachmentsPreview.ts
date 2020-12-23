import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import {
    getAttachmentType,
    getExtension,
    getPoster,
} from 'utils/files';

import { MessageAttachment } from 'models/Attachment';

import AttachmentComponent from './components/attachment/Attachment.vue';


/**
 * Component, that previews uploaded attachments.
 */
@Component({
    components: {
        'attachment': AttachmentComponent,
    },
})
export default class AttachmentsPreview extends Vue {
    /**
     * List of files to be previewed.
     */
    public previewsGallery: MessageAttachment[] = [];

    /**
     * Adds the file to the to the files preview gallery and to the files to be
     * sent via message.
     * Also, fires the 'upload-ended' event after finishing processing the
     * last file.
     *
     * @param file                      File item.
     */
    public previewFile(
        file: File,
    ): void {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const payload: MessageAttachment = {
                extension: getExtension(file),
                id: `attachment_${new Date().getTime()}-${file.type}`,
                name: file.name
                    .split('.')
                    .slice(0, file.name.split('.').length - 1)
                    .join('.'),
                poster: await getPoster(file, reader.result as string),
                size: file.size,
                src: reader.result as string,
                type: getAttachmentType(file),
            };

            this.previewsGallery.push(payload);

            this.$emit('add-file', payload);
        };
    }

    /**
     * Clears the files preview gallery.
     */
    public clearPreview(): void {
        this.previewsGallery = [];
    }

    /**
     * Removes the file from the files preview gallery.
     *
     * @param index                     Index of the item to be deleted.
     */
    public deletePreviewItem(index: number): void {
        this.previewsGallery = this.previewsGallery.filter(
            (item: MessageAttachment, i: number) => i !== index,
        );
        this.$emit('remove-file', index);
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to add listeners to parent events.
     */
    mounted(): void {
        this.$parent.$on('clear-preview', this.clearPreview);
        this.$parent.$on('add-file', this.previewFile);
    }
}
