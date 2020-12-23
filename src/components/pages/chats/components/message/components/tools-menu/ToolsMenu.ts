import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import GeneralParametersModule from 'store/modules/general-parameters';

import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';

import CopyIcon from 'components/icons/CopyIcon.vue';
import DeleteIcon from 'components/icons/DeleteIcon.vue';
import ForwardIcon from 'components/icons/ForwardIcon.vue';
import MenuElement from 'components/pages/chats/components/attachments-panel/components/menu-item/MenuItem.vue';
import SaveIcon from 'components/icons/SaveIcon.vue';
import ShareIcon from 'components/icons/ShareIcon.vue';
import TransferIcon from 'components/icons/TransferIcon.vue';


const generalParameters = namespace(GeneralParametersModule.vuexName);

/**
 * Message tools menu, that allows user to copy, delete, forward, save or
 * translate message.
 */
@Component({
    components: {
        'copy-icon': CopyIcon,
        'delete-icon': DeleteIcon,
        'forward-icon': ForwardIcon,
        'menu-item': MenuElement,
        'save-icon': SaveIcon,
        'share-icon': ShareIcon,
        'transfer-icon': TransferIcon,
    },
})
export default class ToolsMenu extends Vue {
    /**
     * Indicator whether menu is visible.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isVisible;

    /**
     * Menu position settings.
     */
    @Prop({
        required: true,
    }) position;

    /**
     * Indicator whether message has attachments that can be downloaded.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) hasAttachments;

    /**
     * Indicator whether message has text to be copied.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) hasMessageText;

    /**
     * Indicator whether user's device supports WebShare API
     */
    public get isShareApiSupported(): boolean {
        return !!navigator.share;
    }

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
     * Indicator whether mobile mode is on.
     */
    public get isMobileMode(): boolean {
        return this.isNativeMobileMode || this.isForceMobileMode;
    }

    /**
     * Closes the menu.
     */
    public closeContactsMenu(): void {
        this.$emit('close');
    }

    /**
     * Makes user reply to the message.
     */
    public reply(): void {
        this.$emit('reply');
    }

    /**
     * Opens translation of the message interface.
     */
    public translate(): void {
        this.$emit('translate');
    }

    /**
     * Opens contacts list to choose contacts to forward to.
     */
    public forward(): void {
        this.$emit('forward');
    }

    /**
     * Copies message to ClipBoard
     */
    public copy(): void {
        this.$emit('copy');
    }

    /**
     * Downloads the image.
     */
    public download(): void {
        this.$emit('download');
    }

    /**
     * Deletes the image.
     */
    public del(): void {
        this.$emit('delete');
    }

    /**
     * Deletes the image.
     */
    public share(): void {
        this.$emit('share');
    }

    /**
     * Closes tools menu if click was outside of it.
     *
     * @param e     Click event.
     */
    public closeClickHandler(e: MouseEvent): void {
        e.stopPropagation();
        if (!this.$el.contains(e.target as Node)) {
            this.closeContactsMenu();
        }
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to add click event listener.
     */
    public mounted(): void {
        window.addEventListener('click', this.closeClickHandler);
    }

    /**
     * Hooks `beforeDestroy` Vue lifecycle stage to remove click event listener.
     */
    public beforeDestroy(): void {
        window.removeEventListener('click', this.closeClickHandler);
    }

}
