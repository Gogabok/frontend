import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { MessageAttachment } from 'models/Attachment';

import { copyTextToClipboard, imageToBlob } from 'utils/clipboard';

import ChatsModule from 'store/modules/chats';
import GeneralParameters from 'store/modules/general-parameters';

import { DELETE_ATTACHMENT } from 'store/modules/chats/actions';
import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';

import CheckedIcon from 'components/icons/CheckedIcon.vue';
import CopyIcon from 'components/icons/CopyIcon.vue';
import DeleteIcon from 'components/icons/DeleteIcon.vue';
import ForwardIcon from 'components/icons/ForwardIcon.vue';
import PlayIcon from 'components/icons/PlayIcon.vue';
import SaveIcon from 'components/icons/SaveIcon.vue';
import ShareIcon from 'components/icons/ShareIcon.vue';

import ToolsMenu from './components/tools-menu/ToolsMenu.vue';


const chatsModule = namespace(ChatsModule.vuexName);
const generalParameters = namespace(GeneralParameters.vuexName);

/**
 * Media line media item component.
 */
@Component({
    components: {
        'checked-icon': CheckedIcon,
        'copy-icon': CopyIcon,
        'delete-icon': DeleteIcon,
        'forward-icon': ForwardIcon,
        'play-icon': PlayIcon,
        'save-icon': SaveIcon,
        'share-icon': ShareIcon,
        'tools-menu': ToolsMenu,
    },
})
export default class MediaLineItem extends Vue {
    /**
     * Index of media item.
     */
    @Prop({
        default: 0,
        type: Number,
    }) mediaIndex: number;

    /**
     * Media item.
     */
    @Prop({
        default: null,
        type: Object,
    }) item: MessageAttachment;

    /**
     * Indicator whether selection mode is on.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isSelectMode: boolean;

    /**
     * List of selected media items.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isItemSelected;

    /**
     * Indicator whether tools menu is visible.
     */
    public isToolsMenuVisible: boolean = false;

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
     * Media item wrapper element.
     */
    public get itemWrapper(): HTMLElement {
        return this.$refs.itemWrapper as HTMLElement;
    }

    /**
     * Media item content element.
     */
    public get itemContent(): HTMLElement {
        return this.$refs.itemContent as HTMLElement;
    }

    /**
     * Tools menu element.
     */
    public get menuBox(): HTMLElement {
        return this.$refs.menuBox as HTMLElement;
    }

    /**
     * Tools menu controls element.
     */
    public get dots(): HTMLElement {
        return this.$refs.dots as HTMLElement;
    }

    /**
     * Indicator whether mobile mode is active (whether it's force or native).
     */
    public get isMobileMode(): boolean {
        return this.isNativeMobileMode || this.isForceMobileMode;
    }

    /**
     * Deletes message attachment.
     *
     * @param id                        ID of the attachment to be removed.
     */
    @chatsModule.Action(DELETE_ATTACHMENT)
    public deleteAttachmentAction: (id: string) => Promise<void>;

    /**
     * Selects/deselects media item.
     */
    public selectMedia(): void {
        this.$parent.$emit('select-media', this.item);
    }

    /**
     * Opens item in single-item mode.
     */
    public openItemInPlayer(): void {
        if(this.isSelectMode) return;
        this.$root.$emit('open-item-in-player', this.mediaIndex);
    }

    /**
     * Enables scroll.
     */
    public enableScrollFunc(): void {
        this.$emit('enable-scroll');
    }

    /**
     * Disables scroll.
     */
    public disableScrollFunc(): void {
        this.$emit('disable-scroll');
    }

    /**
     * Sets selected media item as replied message.
     */
    public replyHandler(): void {
        this.closeToolsMenu();
        this.$root.$emit('reply-to-attachment', this.item.id);
    }

    /**
     * Shares item via ShareAPI.
     */
    public shareHandler(): void {
        if(navigator.share) {
            navigator.share({
                text: this.item.src,
                title: 'File from the Gapopa Messenger',
                url: window.location.href,
            })
                .catch(e => console.error(e));
        }
    }

    /**
     * Copies media element to clipboard.
     */
    public async copyHandler(): Promise<void> {
        try {
            const res = await imageToBlob(this.item.src);
            // `.write` replaced with `['write']` due to TSLint error.
            navigator.clipboard['write']([
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                new ClipboardItem({
                    'image/png': res,
                }),
            ]);
        } catch(e) {
            console.log('error caught ', e);
            copyTextToClipboard(this.item.src);
        }
        this.closeToolsMenu();
    }

    /**
     * Downloads media item.
     */
    public saveHandler(): void {
        const link = document.createElement('a');
        link.setAttribute('href', this.item.src);
        link.setAttribute('download', this.item.src);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.closeToolsMenu();
    }

    /**
     * Sets select type as forward. Also, selects item.
     */
    public forwardHandler(): void {
        this.$parent.$emit('forward', [this.item]);
        this.closeToolsMenu();
    }

    /**
     * Sets select type as delete. Also, selects item.
     */
    public deleteHandler(): void {
        const id = this.item.id;
        this.deleteAttachmentAction(id)
            .then(() => this.$root.$emit('delete-media-item', id))
            .then(() => this.closeToolsMenu());
    }

    /**
     * Toggles tools menu.
     */
    public toolsHandler(): void {
        if (this.isSelectMode) return;
        this.isToolsMenuVisible
            ? this.closeToolsMenu()
            : this.openToolsMenu();
    }

    /**
     * Opens tools menu.
     */
    public openToolsMenu(): void {
        this.disableScrollFunc();

        setTimeout(() => {
            this.isToolsMenuVisible = true;
            document.querySelector(
                '.preview_container',
            )?.classList.add('menu-opened');

            const menuTop =
                ((this.$refs.menuBox as Vue).$el as HTMLElement).offsetTop;
            const messageTop =
                this.itemContent.getBoundingClientRect().top;
            const messageHeight = this.itemContent.offsetHeight;
            const diff = menuTop - messageTop - messageHeight - 10;
            this.itemContent.classList.add('menu-opened');
            this.itemContent.style.cssText =
                `transform: translateY(${diff}px); z-index: 15`;
        }, 5);
    }

    /**
     * Closes tools menu.
     */
    public closeToolsMenu(): void {
        this.isToolsMenuVisible = false;
        this.enableScrollFunc();
        this.itemContent.classList.remove('menu-opened');
        document.querySelector(
            '.preview_container',
        )?.classList.remove('menu-opened');
        this.itemContent.style.cssText =
            'transform: translateY(0px); transform-origin: bottom right';
    }

    /**
     * Hooks `beforeDestroy` Vue lifecycle stage to remove scroll event
     * listeners.
     */
    public beforeDestroy(): void {
        this.enableScrollFunc();
    }
}
