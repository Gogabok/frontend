import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { getFormattedSize } from 'utils/files';

import { MessageAttachment } from 'models/Attachment';

import filters from 'mixins/filters';

import VideoPreview from 'components/common/video-preview/VideoPreview.vue';
import AttachIcon from 'components/icons/AttachIcon.vue';
import DeleteIcon from 'components/icons/DeleteIcon.vue';


/**
 * Attachment preview element.
 */
@Component({
    components: {
        'attach-icon': AttachIcon,
        'delete-icon': DeleteIcon,
        'video-preview': VideoPreview,
    },
    filters,
})
export default class Attachment extends Vue {
    /**
     * Attachment to be displayed.
     */
    @Prop({
        required: true,
        type: Object,
    }) attachment: MessageAttachment;

    /**
     * Get file size in human readable format.
     *
     * @param file                  Message attachment object.
     */
    public formatSize(file: MessageAttachment): string {
        return getFormattedSize(file.size);
    }

    /**
     * Emits `delete` event to delete attachment.
     */
    public deleteAttachment(): void {
        this.$emit('delete');
    }
}
