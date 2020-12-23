import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import DeleteIcon from 'components/icons/DeleteIcon.vue';
import ForwardIcon from 'components/icons/ForwardIcon.vue';
import PlusIcon from 'components/icons/PlusIcon.vue';
import SaveIcon from 'components/icons/SaveIcon.vue';
import ShareIcon from 'components/icons/ShareIcon.vue';


/**
 * Media player controls panel component, that allows user to close media player
 * or rather share, save, forward or delete media item.
 */
@Component({
    components: {
        'delete-icon': DeleteIcon,
        'forward-icon': ForwardIcon,
        'plus-icon': PlusIcon,
        'save-icon': SaveIcon,
        'share-icon': ShareIcon,
    },
})
export default class ControlsPanel extends Vue {
    /**
     * Indicator whether icons are active on media line mode.
     */
    @Prop(Boolean) areIconsActive;

    /**
     * Indicator whether media line mode is active.
     */
    @Prop(Boolean) isMediaLineMode;

    /**
     * Indicator whether Web Share API is supported.
     *
     * If so, show share option.
     */
    public get isShareAPISupported(): boolean {
        return !!navigator.share;
    }

    /**
     * Emits `close` event.
     */
    public close(): void {
        this.$emit('close');
    }

    /**
     * Emits `forward` event.
     */
    public forward(): void {
        this.$emit('forward');
    }

    /**
     * Emits `share` event.
     */
    public share(): void {
        this.$emit('share');
    }

    /**
     * Emits `del` event.
     */
    public del(): void {
        this.$emit('del');
    }

    /**
     * Emits `save` event.
     */
    public save(): void {
        this.$emit('save');
    }
}
