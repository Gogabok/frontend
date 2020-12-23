import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import CopyIcon from 'components/icons/CopyIcon.vue';
import DeleteIcon from 'components/icons/DeleteIcon.vue';
import ForwardIcon from 'components/icons/ForwardIcon.vue';
import PlusIcon from 'components/icons/PlusIcon.vue';
import SaveIcon from 'components/icons/SaveIcon.vue';
import ShareIcon from 'components/icons/ShareIcon.vue';
import MenuElement from 'components/pages/chats/components/attachments-panel/components/menu-item/MenuItem.vue';


/**
 * Media line item tools menu component.
 */
@Component({
    components: {
        'copy-icon': CopyIcon,
        'delete-icon': DeleteIcon,
        'forward-icon': ForwardIcon,
        'menu-item': MenuElement,
        'plus-icon': PlusIcon,
        'save-icon': SaveIcon,
        'share-icon': ShareIcon,
    },
})
export default class MediaLineItemToolsMenu extends Vue {
    /**
     * Indicator whether web ShareAPI is supported. If so, show share option.
     */
    public get isShareAPISupported(): boolean {
        return !!navigator.share;
    }

    /**
     * Indicator whether menu is visible.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isVisible;

    /**
     * Indicator whether copy option is disabled.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isCopyDisabled;

    /**
     * Emits `share` event.
     */
    public share(): void {
        this.$emit('share');
    }

    /**
     * Emits `delete` event.
     */
    public del(): void {
        this.$emit('delete');
    }

    /**
     * Emits `copy` event.
     */
    public copy(): void {
        this.$emit('copy');
    }

    /**
     * Emits `forward` event.
     */
    public forward(): void {
        this.$emit('forward');
    }

    /**
     * Emits `save` event.
     */
    public save(): void {
        this.$emit('save');
    }

    /**
     * Emits `reply` event.
     */
    public reply(): void {
        this.$emit('reply');
    }

    /**
     * Emits `close` event.
     */
    public closeContactsMenu(): void {
        this.$emit('close');
    }
}
