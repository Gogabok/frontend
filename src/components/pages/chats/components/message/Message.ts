import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { copyTextToClipboard } from 'utils/clipboard';

import { CurrentUser } from 'models/CurrentUser';
import { Message as MessageType } from 'models/Message';
import {
    IPopup,
    Popup,
    PopupAlign,
    PopupType,
} from 'models/PopupSettings';

import GeneralModule from 'store/modules/general-parameters';
import PopupModule from 'store/modules/popup';
import UserModule from 'store/modules/user';

import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';
import { ADD_POPUP } from 'store/modules/popup/actions';
import { GET_USER_DATA } from 'store/modules/user/getters';

import AttachIcon from 'components/icons/AttachIcon.vue';
import CheckedIcon from 'components/icons/CheckedIcon.vue';
import ForwardIcon from 'components/icons/ForwardIcon.vue';
import PlayIcon from 'components/icons/PlayIcon.vue';
import ForwardedHeader from 'components/pages/chats/components/message/components/forwarded-header/ForwardedHeader.vue';
import MediaGroup from 'components/pages/chats/components/message/components/media-group/MediaGroup.vue';
import ToolsMenu from 'components/pages/chats/components/message/components/tools-menu/ToolsMenu.vue';

import AudioTrack from './components/audio-track/AudioTrack.vue';
import RepliedHeader from './components/replied-header/RepliedHeader.vue';
import RepliedMessage from './components/replied-message/RepliedMessage.vue';


const generalModule = namespace(GeneralModule.vuexName);
const popupModule = namespace(PopupModule.vuexName);
const userModule = namespace(UserModule.vuexName);

/**
 * Message component.
 */
@Component({
    components: {
        'atach-icon': AttachIcon,
        'audio-track': AudioTrack,
        'checked-icon': CheckedIcon,
        'forward-icon': ForwardIcon,
        'forwarded-header': ForwardedHeader,
        'media-group': MediaGroup,
        'play-icon': PlayIcon,
        'replied-header': RepliedHeader,
        'replied-message': RepliedMessage,
        'tools-menu': ToolsMenu,
    },
})
export default class Message extends Vue {
    /**
     * Message object to be displayed.
     */
    @Prop() message: MessageType;

    /**
     * Indicator whether message is last message of the user.
     */
    @Prop() isLastMessage: boolean;

    /**
     * Indicator whether message is selected.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isSelected;

    /**
     * Indicator whether select mode is active.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isSelectMode;

    /**
     * Indicator whether message is being moved.
     */
    public movingMessage: boolean = false;

    /**
     * Indicator whether tools menu should be visible.
     */
    public isToolsMenuVisible: boolean = false

    /**
     * Position settings of the tools menu.
     */
    public toolsMenuPosition: {
        left: boolean,
        top: boolean,
        right: boolean,
        bottom: boolean,
    } = {
        bottom: false,
        left: false,
        right: false,
        top: false,
    }

    /**
     * Current user account information.
     */
    @userModule.Getter(GET_USER_DATA)
    public userInfo: CurrentUser;

    /**
     * Indicator whether mobile mode is active.
     */
    @generalModule.Getter(IS_MOBILE_MODE)
    public isMobileMode: boolean;

    /**
     * Indicator whether mobile mode is active.
     */
    @generalModule.Getter(IS_FORCE_MOBILE_MODE)
    public isForceMobileMode: boolean;

    /**
     * Message content element ref.
     */
    public get messageContainer(): HTMLElement {
        return this.$refs.message as HTMLElement;
    }

    /**
     * ToolsMenu element ref.
     */
    public get menuBox(): Vue {
        return this.$refs.menuBox as Vue;
    }

    /**
     * Dots for ToolsMenu element ref.
     */
    public get dots(): HTMLElement {
        return this.$refs.dots as HTMLElement;
    }

    /**
     * Indicator whether forward icon is visible.
     */
    public get isForwardIconVisible(): boolean {
        return Boolean(!this.isSelectMode
            && ((this.message.attachment
                && this.message.attachment.type === 'audio')
                || (this.message.attachment
                    && this.message.attachment.type === 'video')
                || this.message.mediaGroup),
        );
    }

    /**
     * Time to be displayed.
     */
    public get messageTime(): string {
        const date = new Date(this.message.time);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${hours}:${minutes}`;
    }

    /**
     * Adds popup to popups list.
     *
     * @param payload                   Action parameters.
     * @param payload.popup             Popup to be shown.
     */
    @popupModule.Action(ADD_POPUP)
    public addPopup: (payload: {
        popup: IPopup,
    }) => void;

    /**
     * Adds `touchmove` and `touchend` events listeners.
     * Also, gets initial message position to init message movement.
     *
     * @param e     `touchstart` event.
     */
    public touchStartHandler(e: TouchEvent): void {
        if(e.type !== 'touchstart') return;
        if(this.isSelectMode || this.isToolsMenuVisible) return;

        const SWIPE_DIST_TO_SUCCEED = 100;
        const MAX_SWIPE_ANGLE = 35;
        const RESISTANCE = 0.5;

        const target = this.$refs.message as HTMLElement;
        target.style.transition = '0s transform linear';

        const appContainerWidth = (document.querySelector(
            '#page-wrap',
        ) as HTMLElement).clientWidth;

        const getPositionByDevice = (e: { changedTouches }): {
            x: number,
            y: number,
        } => {
            if (!this.isMobileMode && !this.isForceMobileMode) {
                return {
                    x: e.changedTouches[0].pageX,
                    y: e.changedTouches[0].pageY,
                };
            } else {
                const diff = (window.innerWidth - appContainerWidth) / 2;
                return {
                    x: e.changedTouches[0].pageX - diff,
                    y: e.changedTouches[0].pageY,
                };
            }
        };

        const { x: initialX, y: initialY } = getPositionByDevice(e);
        let dX = 0;
        let dY = 0;

        this.movingMessage = true;

        /**
         * Moves message according to current finger position.
         *
         * @param e     `touchmove` event.
         */
        const movingHandler = (e: TouchEvent): void => {
            const { x: currentX, y: currentY } = getPositionByDevice(e);

            dX = currentX - initialX;
            dY = currentY - initialY;

            if(dX > 0) return;

            const angle = Math.abs(
                Math.atan2(
                    dY,
                    e.changedTouches[0].pageX - initialX,
                ) / Math.PI * 180,
            );

            if (angle > MAX_SWIPE_ANGLE
                && angle < 180 - MAX_SWIPE_ANGLE) return;

            function clamp(
                value: number,
                minValue: number,
                maxValue: number,
            ): number {
                return value < minValue
                    ? minValue
                    : value > maxValue
                        ? maxValue
                        : value;
            }

            const transitionDistance = dX * (1-RESISTANCE);
            target.style.transform = `translateX(${clamp(
                transitionDistance,
                -SWIPE_DIST_TO_SUCCEED,
                0,
            )}px)`;
        };

        /**
         * Emits reply event if user dragged message far enough.
         * Also, removes `touchmove` and `touchend` event listeners.
         */
        const endHandler = (): void => {
            if(-dX > SWIPE_DIST_TO_SUCCEED) {
                this.$emit('reply', this.message);
            }
            const duration = 200;
            target.style.transition = `${duration}ms transform ease-in-out`;
            target.style.transform = 'translateX(0px)';

            setTimeout(() => target.style.transition = '', duration);

            this.movingMessage = true;

            window.removeEventListener('touchmove', movingHandler);
            window.removeEventListener('touchend', endHandler);
        };

        window.addEventListener('touchmove', movingHandler);
        window.addEventListener('touchend', endHandler);
    }

    /**
     * Opens tools menu.
     */
    public openToolsMenu(): void {
        this.isToolsMenuVisible = true;
        setTimeout(() => {

            const menuTop = (this.menuBox.$el as HTMLElement).offsetTop;
            const messageTop =
                this.messageContainer.getBoundingClientRect().top;
            const messageHeight = this.messageContainer.offsetHeight;
            const diff = menuTop - messageTop - messageHeight - 10;

            this.messageContainer.classList.add('menu-opened');
            document.querySelector('.contacts-page__top-tools')
                ?.classList.add('menu-opened');
            this.messageContainer.style.cssText
                = `transform: translateY(${diff}px)`;
        }, 5);
    }

    /**
     * Closes tools menu
     */
    public closeToolsMenu(): void {
        this.isToolsMenuVisible = false;
        this.messageContainer.classList.remove('menu-opened');
        this.messageContainer.style.cssText = 'transform: translateY(0px)';
        setTimeout(() => {
            document.querySelector('.contacts-page__top-tools')
                ?.classList.remove('menu-opened');
        }, 200);
    }

    /**
     * Opens video player.
     *
     * @param src       Link to the file that should be opened.
     */
    public openVideoPlayer(src: string | undefined): void {
        this.$parent.$emit('open-video-player', src);
    }

    /**
     * Emits the `select-message` event from the parent component.
     */
    public selectMessage(): void {
        this.$parent.$emit('select-message', this.message);
    }

    /**
     * Toggle tools menu.
     */
    public toggleToolsMenu(): void {
        this.messageContainer.classList.remove('non-transition');
        this.isToolsMenuVisible
            ? this.closeToolsMenu()
            : this.openToolsMenu();
    }

    /**
     * Selects message.
     */
    public messageHold(): void | boolean {
        if(this.isSelectMode) return;
        this.openToolsMenu();
        navigator.vibrate(100);
    }

    /**
     * Handles message selection state change.
     */
    messageClick(): void {
        if (this.isSelectMode && !this.isToolsMenuVisible) {
            this.selectMessage();
        }
    }

    /**
     * Initiates selection of the messages which should be deleted.
     */
    public del(): void {
        this.closeToolsMenu();
        this.$parent.$emit('set-select-type', 'delete');
        this.selectMessage();
    }


    /**
     * Sets message as replied.
     */
    public reply(): void {
        const payload = this.message;
        this.$emit('reply', payload);
        this.closeToolsMenu();
    }

    /**
     * Copies message to clipboard.
     * Also, notifies user about that with alert popup.
     */
    public copy(): void {
        copyTextToClipboard(this.message.message);
        this.closeToolsMenu();

        const popupData = new Popup({
            confirmCallback: null,
            id: `${new Date().getTime()}${PopupType.Alert}`,
            settings: {
                align: {
                    horizontal: PopupAlign.Center,
                    vertical: PopupAlign.Center,
                },
                position: {
                    bottom: 55,
                    left: 400,
                    right: 0,
                    top: 0,
                },
                type: PopupType.Alert,
            },
            textMessage: 'Скопировано в буфер обмена',
        });
        this.addPopup({
            popup: popupData,
        });
    }

    /**
     * Toggles select mode of forward type.
     */
    public forward(): void {
        this.$parent.$emit('set-select-type', 'forward');
        this.selectMessage();
        this.closeToolsMenu();
    }

    /**
     * Toggles contacts to forward select.
     */
    public forwardImage(): void {
        this.selectMessage();
        this.$parent.$emit('forward-image');
    }

    /**
     * Downloads the attachment file of the message.
     */
    public download(): void {
        const link = document.createElement('a');
        if(!this.message.attachment) return;
        link.href = this.message.attachment.src;
        link.download = this.message.attachment.name
            || this.message.attachment.src
            ||'download';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.closeToolsMenu();
    }

    /**
     * Shares message using WebShare API.
     */
    public share(): void {
        if(navigator.share) {
            navigator.share({
                text: this.message.message,
                title: 'Gapopa Messenger message',
                url: window.location.href,
            })
                .catch(e => console.error(e));
        }
    }

    /**
     * Opens the translation interface.
     */
    public translate(): void {
        this.$emit('translate-message', this.message);
        this.closeToolsMenu();
    }

    /**
     * Scrolls dialog to exact message.
     *
     * @param id        ID of the message to scroll to.
     */
    public scrollTo(id: string): void {
        const message =
            document.querySelector(
                `[data-message-id="${id}"]`,
            ) as HTMLElement;

        const vueBarContainer =
            document.querySelector(
                '.contacts-page__dialogs .vue-bar-container',
            ) as HTMLElement;
        const vueBarContent =vueBarContainer?.querySelector(
            '.vb-content',
        ) as HTMLElement;

        const vueBarContainerHeight = vueBarContainer?.offsetHeight;
        const messageHeight = message?.offsetHeight;
        const messageTop = message?.offsetTop;
        let repliedContainerHeight = 0;
        if (document.querySelector('.reply')) {
            repliedContainerHeight = (document.querySelector(
                '.reply',
            ) as HTMLElement)?.offsetHeight;
        }

        const diff =
            messageTop - vueBarContainerHeight
            + messageHeight + repliedContainerHeight + 55;

        vueBarContent.classList.add('scroll-smooth');
        vueBarContent.scrollTop = diff;

        setTimeout(() => {
            vueBarContent.classList.remove('scroll-smooth');
            message.classList.add('message-active');
        }, 600);
        setTimeout(() => {
            message.classList.remove('message-active');
        }, 1200);
    }
}
