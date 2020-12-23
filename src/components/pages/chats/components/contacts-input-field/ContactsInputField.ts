import { mixins } from 'vue-class-component';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { MessageAttachment } from 'models/Attachment';
import { Contact } from 'models/Contact';
import {
    Message,
} from 'models/Message';
import { User } from 'models/User';

import autoResize from 'mixins/auto-resize.ts';

import GeneralParameters from 'store/modules/general-parameters';
import UserModule from 'store/modules/user';

import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';
import { GET_USER_DATA } from 'store/modules/user/getters';

import AttachIcon from 'components/icons/AttachIcon.vue';
import CameraIcon from 'components/icons/CameraIcon.vue';
import DeleteIcon from 'components/icons/DeleteIcon.vue';
import ForwardIcon from 'components/icons/ForwardIcon.vue';
import MicrophoneIcon from 'components/icons/MicrophoneIcon.vue';
import PlusIcon from 'components/icons/PlusIcon.vue';
import SendMessageIcon from 'components/icons/SendMessageIcon.vue';
import TransferIcon from 'components/icons/TransferIcon.vue';
import AttachmentsPanel from 'components/pages/chats/components/attachments-panel/AttachmentsPanel.vue';

import AttachmentsPreview from './components/attachments-preview/AttachmentsPreview.vue';
import AudioRecordPanel from './components/audio-record-panel/AudioRecordPanel.vue';
import ReplyMessageBar from './components/replied-message-bar/RepliedMessageBar.vue';


const generalParameters = namespace(GeneralParameters.vuexName);
const userModule = namespace(UserModule.vuexName);

/**
 * Chat input field component that allows user to write a message to current
 * interlocutor, attach media object to message or send audio message.
 */
@Component({
    components: {
        'attach-icon': AttachIcon,
        'attachments-panel': AttachmentsPanel,
        'attachments-preview': AttachmentsPreview,
        'audio-record-panel': AudioRecordPanel,
        'camera-icon': CameraIcon,
        'delete-icon': DeleteIcon,
        'forward-icon': ForwardIcon,
        'microphone-icon': MicrophoneIcon,
        'plus-icon': PlusIcon,
        'reply-message-bar': ReplyMessageBar,
        'send-message-icon': SendMessageIcon,
        'transfer-icon': TransferIcon,
    },
})
export default class ContactsInputField extends mixins(autoResize) {
    /**
     * Indicator whether any message selected.
     */
    @Prop({
        default: () => ([]),
        type: Array,
    }) selectedMessages: Message[];

    /**
     * Indicator whether selection mode is enabled.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isSelectMode;

    /**
     * Indicator whether contacts choose list is visible.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isContactsListVisible;

    /**
     * Indicator whether any contact has been selected.
     */
    @Prop({
        default: () => ([]),
        type: Array,
    }) chosenContacts: Contact[];

    /**
     * Indicator whether message selection is of type 'forward' or 'delete'.
     */
    @Prop({
        default: '',
        type: String,
    }) selectType;

    /**
     * Indicator whether camera interface is open.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isCameraOpen;

    /**
     * User's message to be sent.
     */
    private messageText: string = '';

    /**
     * Indicator whether chat window height has been adapted to contain replied
     * message.
     */
    public doesFitRepliedMessageHeight: boolean = false;

    /**
     * Replied message object.
     */
    public repliedMessage: Message | null = null;

    /**
     * Indicator whether message input field is focused.
     */
    private isInputFocused: boolean = false;

    /**
     * Indicator whether message is being translated to another lang.
     */
    private isPayedDialog: boolean = false;

    /**
     * Indicator whether attachments menu list is visible.
     */
    public isAttachmentsMenuVisible: boolean = false;

    /**
     * Files attached by the user.
     */
    public attachments: MessageAttachment[] = [];

    /**
     * Indicator whether mic menu sould be visible.
     */
    public isMicrophoneMenuActive: boolean = false;

    /**
     * Indicator whether any messages are being sent right now.
     */
    public isSending: boolean = false;

    /**
     * Indicator whether message remove popup should be
     */
    public isVisibleDeleteConfirm: boolean = false;

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
     * Current user account information.
     */
    @userModule.Getter(GET_USER_DATA)
    public userData: User;

    /**
     * Indicator whether mobile mode is on.
     */
    public get isMobileMode(): boolean {
        return this.isForceMobileMode || this.isNativeMobileMode;
    }

    /**
     * Indicator whether send button is active.
     */
    public get isSendButtonActive(): boolean {
        return (this.messageText.trim().length
            || this.attachments.length
            || this.isCameraOpen
            || (this.isContactsListVisible && this.chosenContacts.length)
            || (this.isSelectMode && this.selectedMessages.length));
    }

    /**
     * Indicator whether plus icon should be rotated.
     */
    public get isPlusIconRotated(): boolean {
        return this.attachments.length
            || this.isAttachmentsMenuVisible
            || this.isCameraOpen
            || this.isContactsListVisible
            || this.isSelectMode;
    }

    /**
     * Indicator whether transfer icon is visible.
     */
    public get isTransferIconVisible(): boolean {
        return !this.attachments.length
            && !this.isMobileMode
            && !this.isCameraOpen
            && !this.isSelectMode;
    }

    /**
     * Indicator whether microphone icon is visible.
     */
    public get isMicIconVisible(): boolean {
        return !this.isInputFocused
            && !this.messageText.length
            && !this.attachments.length
            && !this.isCameraOpen
            && !this.isContactsListVisible;
    }

    /**
     * Emits `open-camera` event to open camera interface of provided type.
     *
     * @param type                      Type of camera interface to be open
 *                                      (`photo`|`video`).
     */
    public openCamera(type: string): void {
        this.$emit('open-camera', type);
    }

    /**
     * Detects which actions should be called on send message click.
     */
    public sendButtonClickHandler(): void {
        if (this.isSelectMode) {
            if (this.selectType === 'delete') {
                if (!this.isVisibleDeleteConfirm) {
                    this.isVisibleDeleteConfirm = true;
                } else {
                    this.$emit('delete');
                    this.isVisibleDeleteConfirm = false;
                }
            } else {
                if (this.isContactsListVisible && !this.chosenContacts.length) {
                    return;
                }
                this.$emit('forward', { type: 'message' });
            }
        } else if (this.isCameraOpen) {
            this.$parent.$emit(
                'send-video-or-photo-message',
                this.messageText,
            );
            this.messageText = '';
        } else if (
            !this.messageText.trim().length
            && !this.attachments.length
            && !this.isInputFocused
            && !this.isContactsListVisible
        ) {
            this.openMicrophoneMenu();
        } else {
            this.handleMessageSend();
        }
    }

    /**
     * Sends message to the current user.
     */
    public handleMessageSend(): void {
        if (!this.messageText.trim()
            && !this.attachments.length) return;

        if (this.attachments.length && this.attachments.length < 4) {
            this.attachments.forEach((file, index) => {
                const payload: Message = {
                    attachment: file,
                    forwarded: false,
                    forwardedFromUser: null,
                    id: this.$route.query.id.toString()
                        + new Date().getTime().toString(),
                    isUserMessage: true,
                    mediaGroup: null,
                    message: index < this.attachments.length - 1
                        ? ''
                        : this.messageText,
                    num: this.userData.num,
                    repliedMessage: null,
                    status: 'sent',
                    time: new Date().getTime(),
                    userId: this.userData.num,
                };

                if (this.repliedMessage) {
                    payload.repliedMessage = this.repliedMessage;
                }

                this.$emit(
                    'send-message',
                    payload,
                    {
                        index,
                        total: this.attachments.length,
                    },
                );
            });
            this.attachments = [];
        } else if (this.attachments.length >= 4) {
            const payload: Message = {
                attachment: null,
                forwarded: false,
                forwardedFromUser: null,
                id: this.$route.query.id.toString()
                    + new Date().getTime().toString(),
                isUserMessage: true,
                mediaGroup: this.attachments,
                message: this.messageText,
                num: this.userData.num,
                repliedMessage: null,
                status: 'sent',
                time: new Date().getTime(),
                userId: this.userData.num,
            };

            if (this.repliedMessage) {
                payload.repliedMessage = this.repliedMessage;
            }

            this.$emit(
                'send-message',
                payload,
                {
                    index: 1,
                    total: 2,
                },
            );
            this.attachments = [];
        } else {
            const payload: Message = {
                attachment: null,
                forwarded: false,
                forwardedFromUser: null,
                id: this.$route.query.id.toString()
                    + new Date().getTime().toString(),
                isUserMessage: true,
                mediaGroup: null,
                message: this.messageText,
                num: this.userData.num,
                repliedMessage: null,
                status: 'sent',
                time: new Date().getTime(),
                userId: this.userData.id,
            };

            if (this.repliedMessage) {
                payload.repliedMessage = this.repliedMessage;
            }

            this.$emit('send-message', payload);
        }
        this.messageText = '';

        this.clearAttachments();
        this.resetInputSize();
    }

    /**
     * Resets the size of the message input.
     */
    public resetInputSize(): void {
        (this.$refs.textArea as HTMLElement).style.height = '30px';

        const wrapper = document.querySelector(
            '.vue-bar-container',
        ) as HTMLElement;

        if (wrapper) {
            wrapper.style.paddingBottom = `${30 + 20}px`;
        }
    }

    /**
     * Clears attachments.
     */
    public clearAttachments(): void {
        this.$emit('clear-preview');
        this.attachments = [];
    }

    /**
     * Adds attached file to the message attachments.
     *
     * @param file      File attached.
     */
    public addFileHandler(file: MessageAttachment): void {
        this.attachments.push(file);
    }

    /**
     * Removes attached file.
     *
     * @param index      Index of an attached file.
     */
    public removeFileHandler(index: number): void {
        this.attachments = this.attachments.filter(
            (item: MessageAttachment, i: number) => i !== index,
        );
    }

    /**
     * Opens message translation interface.
     */
    public transactionHandler(): void {
        this.isPayedDialog = !this.isPayedDialog;
        this.$emit('ttm', this.isPayedDialog);
    }

    /**
     * Sets message input focus indicator's state.
     *
     * @param val       State to be set.
     */
    public focusStateChangeHandler(val: boolean): void {
        val
            ? this.isInputFocused = val
            : setTimeout(() => this.isInputFocused = val, 100);
    }

    /**
     * Makes message input field height fit the text.
     *
     * @param e     `input` event.
     */
    public inputHandler(e: InputEvent): void {
        const didExpand = this.autoResize(e, 130);
        if(didExpand) {
            this.repliedMessage && this.fitRepliedMessageHeight();

            const attachmentsPreview = this.$el.querySelector(
                '.contacts__preview',
            ) as HTMLInputElement;

            if (attachmentsPreview) {
                attachmentsPreview.style.height = `${
                    window.innerHeight - 60 - 56 - this.$el.clientHeight
                }px`;
            }
        }
    }

    /**
     * Resets input field to initial size, clears the input, discards
     * all attachments.
     */
    public resetInputField(): void {
        this.messageText = ''.trim();
        this.resetInputSize();
    }

    /**
     * Opens attachment menu.
     */
    public openAttachmentMenu(): void {
        this.isAttachmentsMenuVisible = true;
    }

    /**
     * Closes attachment menu.
     */
    public closeAttachmentMenu(): void {
        this.isAttachmentsMenuVisible = false;
    }

    /**
     * Sets replied message as provided one.
     *
     * @param message       Message object.
     */
    public setRepliedMessage(message: Message): void {
        this.repliedMessage = message;
    }

    /**
     * Clears replied message.
     */
    public clearRepliedMessage(): void {
        this.repliedMessage = null;
    }

    /**
     * Clears the files preview gallery if it contains any files.
     * Otherwise opens attachments menu.
     */
    public plusIconClickHandler(): void {
        if (this.isSelectMode) {
            if (this.isVisibleDeleteConfirm) {
                this.isVisibleDeleteConfirm = false;
                return;
            }
            if (this.isContactsListVisible) {
                this.$emit('close-contacts-select');
            } else {
                this.$emit('cancel-select');
            }
        } else if (this.attachments.length) {
            this.clearAttachments();
        } else if (this.isCameraOpen) {
            this.$parent.$emit('close-camera');
        } else if (this.isContactsListVisible) {
            this.$emit('close-contacts-select');
        } else {
            this.isAttachmentsMenuVisible
                ? this.closeAttachmentMenu()
                : this.openAttachmentMenu();
        }
    }

    public getDefaultMessage(payload: {
        attachment?: MessageAttachment,
        mediaGroup?: MessageAttachment[],
        message?: string,
        repliedMessage?: Message,
    }): Message {
        return {
            attachment: payload.attachment || null,
            forwarded: false,
            forwardedFromUser: null,
            id: this.$route.query.id.toString()
                + new Date().getTime().toString(),
            isUserMessage: true,
            mediaGroup: payload.mediaGroup || null,
            message: payload.message || '',
            num: this.userData.num,
            repliedMessage: payload.repliedMessage || null,
            status: 'sent',
            time: new Date().getTime(),
            userId: this.userData.id,
        };
    }

    /**
     * Sends audio message.
     */
    public audioMessageSendHandler(attachment: MessageAttachment): void {
        const payload: Message = {
            attachment: attachment,
            forwarded: false,
            forwardedFromUser: null,
            id: this.$route.query.id.toString()
                + new Date().getTime().toString(),
            isUserMessage: true,
            mediaGroup: null,
            message: this.messageText,
            num: this.userData.num,
            repliedMessage: null,
            status: 'sent',
            time: new Date().getTime(),
            userId: this.userData.id,
        };

        if (this.repliedMessage) {
            payload.repliedMessage = this.repliedMessage;
        }

        this.$emit('send-message', payload);
        this.messageText = '';
    }

    /**
     * Opens audio message record menu.
     */
    public openMicrophoneMenu(): void {
        this.isMicrophoneMenuActive = true;
    }

    /**
     * Closes audio message record menu.
     */
    public closeMicrophoneMenu(): void {
        this.isMicrophoneMenuActive = false;
    }

    /**
     * Sets chat window padding based on input field height.
     */
    public fitRepliedMessageHeight(): void {
        const barContainer: HTMLElement | null =
            document.querySelector('.vue-bar-container');
        if(!barContainer) return;

        this.$nextTick(() => {
            const height = (document.querySelector(
                '.reply__container',
            ) as HTMLElement).clientHeight;

            const initPadding = parseFloat(barContainer.style.paddingBottom)
                || this.$el.clientHeight;

            barContainer.style.paddingBottom =
                `${height + initPadding}px`;
        });
    }

    /**
     * Watches replied message to set container padding.
     * @param message
     */
    @Watch('repliedMessage')
    watchRepliedMessage(message: Message | null): void {
        const barContainer: HTMLElement | null =
            document.querySelector('.vue-bar-container');
        if(!barContainer) return;

        if(message && !this.doesFitRepliedMessageHeight) {
            this.fitRepliedMessageHeight();
            this.doesFitRepliedMessageHeight = true;
        } else if(this.doesFitRepliedMessageHeight) {
            this.doesFitRepliedMessageHeight = false;
            barContainer.style.paddingBottom =
                `${this.$el.clientHeight}px`;
        }
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to add listener to parent events.
     */
    public mounted(): void {
        this.$parent.$on('set-replied-message', this.setRepliedMessage);
        this.$parent.$on('clear-replied-message', this.clearRepliedMessage);
        this.$parent.$on('clear-input-field', this.resetInputField);
    }

    /**
     * Hooks `beforeDestroy` Vue lifecycle stage to remove listeners of parent
     * events.
     */
    public beforeDestroy(): void {
        this.$parent.$off('set-replied-message', this.setRepliedMessage);
        this.$parent.$off('clear-replied-message', this.clearRepliedMessage);
        this.$parent.$off('clear-input-field', this.resetInputField);
    }
}
