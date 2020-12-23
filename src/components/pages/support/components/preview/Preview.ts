import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { Attachment } from 'models/Attachment';

import VideoPlayer from 'components/common/video-preview/VideoPreview.vue';
import AttachIcon from 'components/icons/AttachIcon.vue';
import DeleteIcon from 'components/icons/DeleteIcon.vue';


/**
 * Support attachment preview component.
 */
@Component({
    components: {
        'attach-icon': AttachIcon,
        'delete-icon': DeleteIcon,
        'video-player': VideoPlayer,
    },
})
export default class Preview extends Vue {
    /**
     * File to preview.
     */
    @Prop({ default: {} }) preview: Attachment;
}
