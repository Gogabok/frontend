import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { MessageAttachment } from 'models/Attachment';
import { Chat } from 'models/Chat';
import { CurrentUser } from 'models/CurrentUser';
import { Message } from 'models/Message';
import {
    ContactsListPopup,
    ContactsListPopupState,
    IPopup,
    PopupAlign,
    PopupType,
} from 'models/PopupSettings';
import { User } from 'models/User';

import ChatsModule from 'store/modules/chats';
import GeneralParametersModule from 'store/modules/general-parameters';
import PopupModule from 'store/modules/popup';
import UserModule from 'store/modules/user';
import UsersModule from 'store/modules/users';

import {
    DELETE_MESSAGE,
    SEND_MESSAGE,
    SEND_MESSAGE_TO_USER,
} from 'store/modules/chats/actions';
import { GET_ALL_CHATS, GET_CHAT_BY_ID } from 'store/modules/chats/getters';
import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';
import { ADD_POPUP } from 'store/modules/popup/actions';
import { GET_USER_DATA } from 'store/modules/user/getters';
import { GET_USER_BY_ID } from 'store/modules/users/getters';

import CameraInterface from 'components/common/camera/camera-interface/CameraInterface.vue';
import MediaPlayer from 'components/common/media-player/MediaPlayer.vue';
import ContactsInputField from 'components/pages/chats/components/contacts-input-field/ContactsInputField.vue';
import DialogComponent from 'components/pages/chats/components/dialog/Dialog.vue';
import DialogHeader from 'components/pages/chats/components/dialog-header/DialogHeader.vue';
import MessageLoader from 'components/pages/chats/components/chat-window/components/MessageLoader/MessageLoader.vue';
import ScrollBottomButton from 'components/pages/chats/components/chat-window/components/ScrollBottomButton/ScrollBottomButton.vue';
import TransactionMessage from 'components/pages/chats/components/transaction-message/TransactionMessage.vue';
import Profile from 'components/pages/contacts/components/profile/Profile.vue';


type Contact = User | Chat;

const generalParameters = namespace(GeneralParametersModule.vuexName);
const chatsModule = namespace(ChatsModule.vuexName);
const popupModule = namespace(PopupModule.vuexName);
const userModule = namespace(UserModule.vuexName);
const usersModule = namespace(UsersModule.vuexName);

/**
 * Chat component with dialogs, audio/video calls and message input field.
 */
@Component({
    components: {
        'camera-interface': CameraInterface,
        'contacts-input-field': ContactsInputField,
        'dialog-content': DialogComponent,
        'dialog-header': DialogHeader,
        'media-player': MediaPlayer,
        'message-loader': MessageLoader,
        'profile': Profile,
        'scroll-bottom-button': ScrollBottomButton,
        'transaction-message': TransactionMessage,
    },
})
export default class ChatWindow extends Vue {
    /**
     * Indicator whether translation interface should be visible.
     */
    public isPayedDialog: boolean = false;

    /**
     * Cost of the message translation.
     */
    public cost: string = '98,60';

    /**
     * Indicator whether select mode is on.
     */
    public isSelectMode: boolean = false;

    /**
     * Text to be translated.
     */
    public textToTranslate: string =
        'Your correspondent has set a fee for reading incoming messages.';

    /**
     * Translated text.
     */
    public translatedText: string = '«Большое количество глупых сообщений.»'

    /**
     * Indicator whether camera is open.
     */
    public isCameraOpen: boolean = false;

    /**
     * Indicator whether media player should be visible.
     */
    public isMediaPlayerVisible: boolean = false;

    /**
     * Media object that should be visible when media player opens.
     */
    public mediaPlayerIdOnOpen: string = '';

    /**
     * Indicator whether message selection is of type `forward` or `delete`.
     */
    public selectType: string = '';

    /**
     * List of selected messages.
     */
    public selectedMessages: Message[] = [];

    /**
     * List of chosen contacts.
     */
    public chosenContacts: Contact[] = [];

    /**
     * Indicator whether forward interface is visible.
     */
    public isForwardInterfaceVisible: boolean = false;

    /**
     * Indicator whether user forwards media or messages.
     */
    public forwardType: 'message' | 'media' = 'message';

    /**
     * List of items to be forwarded.
     */
    public itemsToForward: Message[] | MessageAttachment[] = [];

    /**
     * Last active contact ID.
     */
    public activeChatId: string = '';

    /**
     * Indicator whether scroll bottom button is vissible.
     */
    public isScrollBottomButtonVissible: boolean = false;

    /**
     * Indicator whether user reaches the point which activates message loader.
     */
    public isLoadMessagesBorderReached: boolean = false;

    /**
     * Indicator whether message loader is vissible.
     */
    public isMessagesLoader: boolean | null = null;

    /**
     * Initial height of chat container before loading new messages to prevent
     * a jump of scrolling.
     */
    public chatWindowScrollHeightBeforeAppend: number = 0;

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
     * Returns chat by it's ID.
     */
    @chatsModule.Getter(GET_CHAT_BY_ID)
    public getChatById: (payload: {id: string}) => Chat;

    /**
     * All user's chats.
     */
    @chatsModule.Getter(GET_ALL_CHATS)
    public chats: Chat[];

    /**
     * Gathers user's account information by its ID.
     *
     * @param payload                   Action parameters.
     * @param payload.id                ID of the user gather information of.
     */
    @usersModule.Getter(GET_USER_BY_ID)
    public getUserById: (payload: { id: string }) => User | null;

    /**
     * Current app user account information.
     */
    @userModule.Getter(GET_USER_DATA)
    public currentAppUserData: CurrentUser;

    /**
     * Indicator whether mobile mode is active (whether it's force or mobile)
     */
    public get isMobileMode(): boolean {
        return this.isNativeMobileMode || this.isForceMobileMode;
    }

    /**
     * Media objects to be shown in media player.
     */
    public get mediaPlayerGallery(): MessageAttachment[] {
        if(!this.activeChat) return [];
        return this.activeChat.attachments;
    }

    /**
     * Currently active chat.
     */
    public get activeChat(): Chat | null {
        if(!this.activeChatId) return null;
        return this.getChatById({ id: this.activeChatId });
    }

    /**
     * Indicator whether all messages are selected.
     */
    public get isAllMessagesSelected(): boolean {
        if(!this.activeChat || !this.activeChat.dialogs) return false;
        return this.selectedMessages.length ===
            this.activeChat.dialogs.reduce(
                (sum: number, { messages }) => sum + messages.length,
                0,
            );
    }

    /**
     * Sends message to the specific user.
     *
     * @param payload                   Action parameters.
     * @param payload.chatId            ID of the user to send message to.
     * @param payload.message           Message to be sent.
     */
    @chatsModule.Action(SEND_MESSAGE)
    public sendMessageAction: (payload: {
        chatId: string,
        message: Message,
    }) => Promise<void>

    /**
     * Deletes message.
     *
     * @param payload                   Action parameters.
     * @param payload.userId            ID of the user dialog with which
     *                                  contains the message.
     * @param payload.messageId         ID of the message to be deleted.
     */
    @chatsModule.Action(DELETE_MESSAGE)
    public deleteMessageAction: (payload: {
        chatId: string,
        messageId: string,
    }) => Promise<void>

    /**
     * Opens new popup.
     *
     * @param payload                   Action parameters.
     * @param payload.popup             Popup to be opened.
     */
    @popupModule.Action(ADD_POPUP)
    public addPopup: (payload: { popup: IPopup }) => Promise<void>;

    /**
     * Sends message to user.
     *
     * @param payload                   Action parameters.
     * @param payload.userId            ID of the user to send message to.
     * @param payload.message           Message to be sent.
     */
    @chatsModule.Action(SEND_MESSAGE_TO_USER)
    public sendMessageToUserAction: (payload: {
        userId: string,
        message: Message,
    }) => Promise<void>;

    /**
     * Toggles the translation interface. Also, scrolls dialog to the end.
     *
     * @param value                     Indicator whether interface should be
     *                                  visible.
     */
    public transactionHandler(value: boolean): void {
        this.isPayedDialog = value;
        if (this.isPayedDialog) this.smoothlyScrollToEndForTime(200);
    }

    /**
     * Scrolls dialog to the last(newest) message.
     */
    public scrollToEnd(): void {
        const content = this.$refs.chatWindow as HTMLElement;
        if (content) content.scrollTop = content.scrollHeight + 10;
    }

    /**
     * Smoothly scrolls dialog to the last(newest) message.
     */
    public smoothlyScrollToEnd(): void {
        (this.$refs.chatWindow as HTMLElement).classList.add('scroll-smooth');
        this.scrollToEnd();
        (this.$refs.chatWindow as HTMLElement).classList
            .remove('scroll-smooth');
    }

    /**
     * Smoothly scrolls dialog to the last(newest) message for `ms`
     * milliseconds.
     *
     * @param ms                        Amount of time in milliseconds for which
     *                                  container must be scrolled.
     */
    public smoothlyScrollToEndForTime(ms: number): void {
        const time = new Date().getTime();

        const scrollFunc = () => {
            this.smoothlyScrollToEnd();
            if(new Date().getTime() - time < ms) {
                window.requestAnimationFrame(scrollFunc);
            }
        };

        window.requestAnimationFrame(scrollFunc);
    }

    /**
     * Scrolls dialog to the last(newest) message for `ms` milliseconds.
     *
     * @param ms                        Amount of time in milliseconds for which
     *                                  container must be scrolled.
     */
    public scrollToEndForTime(ms: number): void {
        const time = new Date().getTime();

        const scrollFunc = () => {
            this.scrollToEnd();
            if(new Date().getTime() - time < ms) {
                window.requestAnimationFrame(scrollFunc);
            }
        };

        window.requestAnimationFrame(scrollFunc);
    }

    /**
     * Listner that determines whether the message container is scrolled enough
     * to display the scroll bottom button or load new messages.
     */
    public chatWindowListener(): void {
        const chatWindow = this.$refs.chatWindow as HTMLElement;

        const chatWindowScrollHeight = chatWindow.scrollHeight;
        const chatWindowScrollTop = chatWindow.scrollTop;
        const chatWindowHeight = chatWindow.offsetHeight;

        this.isLoadMessagesBorderReached =
            chatWindowScrollTop
            < chatWindowHeight / 2
            && !this.isMessagesLoader;

        this.isScrollBottomButtonVissible =
            chatWindowScrollHeight - chatWindowScrollTop - chatWindowHeight
            > chatWindowHeight * 2;
    }

    /**
     * Opens the camera.
     *
     * @param type                      Indicator whether camera should be
     *                                  opened in video or photo mode.
     */
    public openCamera(type: string): void {
        this.isCameraOpen = true;
        this.$nextTick(() => this.$emit('open-camera', type));
    }

    /**
     * Closes the camera.
     */
    public closeCamera(): void {
        this.isCameraOpen = false;
    }

    /**
     * Opens media player.
     *
     * @param id                        ID of the file that should be visible
     *                                  on open.
     */
    public openVideoPlayer(id: string): void {
        this.mediaPlayerIdOnOpen = id;
        this.isMediaPlayerVisible = true;
    }

    /**
     * Closes media player.
     */
    public closeVideoPlayer(): void {
        this.isMediaPlayerVisible = false;
    }

    /**
     * Sends message to the `activeChat`.
     *
     * @param message                   Message object.
     * @param settings                  Settings of the message.
     * @param settings.id               ID of the chat to send to.
     * @param settings.index            Index of a messages in a row.
     * @param settings.total            Total number of messages being sent
     *                                  at once.
     */
    public sendMessage(
        message: Message,
        settings: {
            id: string,
            index: number,
            total: number,
        } = {
            id: this.activeChatId,
            index: 0,
            total: 1,
        },
    ): void {
       this.sendMessageAction({
           chatId: settings.id || this.activeChatId,
            message,
        }).then(() => {
            if(settings.total > 1 && settings.index == settings.total - 1) {
                this.$emit('message-sent');
            } else if (settings.total === 1) {
                this.$emit('clear-input-field');
            }
        });

        this.$emit('clear-replied-message');
        this.smoothlyScrollToEndForTime(100);
    }

    /**
     * Adds message to the list of selected messages.
     *
     * @param message                   Newly selected message.
     */
    public selectMessage(message: Message): void {
        if(!this.selectedMessages.length) {
            this.setSelectMode(true);
        }

        this.selectedMessages.includes(message)
            ? this.selectedMessages =
                this.selectedMessages.filter(({ id }) => message.id !== id)
            : this.selectedMessages.push(message);
    }

    /**
     * Sets all messages selected.
     */
    public selectAllMessagesHandler(): void {
        if(this.isAllMessagesSelected) {
            this.selectedMessages = [];
        } else {
            if(!this.activeChat) return;
            this.selectedMessages = this.activeChat.dialogs.reduce(
                (
                    messages,
                    dialog,
                ) => messages.concat(dialog.messages),
                [] as Message[],
            );
        }
    }

    /**
     * Sets select mode on or off.
     *
     * @value                           New select mode state.
     */
    public setSelectMode(value: boolean): void {
        this.isSelectMode = !!value;
        if (!value) {
            this.selectedMessages = [];
        }
    }

    /**
     * Deletes selected messages.
     */
    public deleteHandler(): void {
        if(!this.$route.query.id) return;

        this.selectedMessages.forEach(message => this.deleteMessageAction({
            chatId: this.$route.query.id as string,
            messageId: message.id,
        }));
        this.selectedMessages = [];
        this.isSelectMode = false;
    }

    /**
     * Sets forward interface visible.
     */
    public imageForwardHandler(): void {
        this.forwardHandler();
    }

    /**
     * Shows contacts list popup. Also, set's forward type (message/media),
     * sets items to forward.
     * Sends selected messages to selected contacts.
     *
     * @param options                   Forward mode settings.
     * @param options.type              Forward type.
     * @param options.payload           Items to be forwarded.
     */
    public forwardHandler(options: {
        type: 'message' | 'media',
        payload?: MessageAttachment[] | Message[],
    } = {
        payload: this.selectedMessages,
        type: 'message',
    }): void {
        this.itemsToForward =
            options.payload as MessageAttachment[] | Message[]
            || this.selectedMessages;
        this.forwardType = options.type;

        const isMediaMode = options.type === 'media';
        const popupData = new ContactsListPopup({
            confirmCallback: ({ selectedContacts }) => {
                selectedContacts.forEach(contact => {
                    const messages = isMediaMode
                        ? this.itemsToForward.length > 4
                            ? [this.buildMessageToForward({
                                attachments:
                                    <MessageAttachment[]>this.itemsToForward,
                                forwardTo: contact,
                            })]
                            : (<MessageAttachment[]>this.itemsToForward).map(
                                attachment =>this.buildMessageToForward({
                                    attachments: [attachment],
                                    forwardTo: contact,
                                }),
                            )
                        : (<Message[]>this.itemsToForward).map(
                            originalMessage => {
                                return this.buildMessageToForward({
                                    forwardTo: contact,
                                    message: originalMessage,
                                });
                            },
                        );
                        this.forwardMessagesToUser(messages, contact);
                    });

                this.forwardSucceededHandler();
            },
            id: `${new Date().getTime()}${PopupType.Contacts}`,
            settings: {
                align: {
                    horizontal: PopupAlign.Center,
                    vertical: PopupAlign.Center,
                },
                position: {
                    bottom: 0,
                    left: 0,
                    right: 0,
                    top: 0,
                },
                type: PopupType.Contacts,
            },
            state: ContactsListPopupState.Forward,
            textMessage: null,
        });
        this.addPopup({
            popup: popupData,
        });
        this.$root.$once('forward-succeeded', this.forwardSucceededHandler);
    }

    /**
     * Forwards messages to user.
     *
     * @param messages                  Messages to be sent.
     * @param user                      User to send messages to.
     */
    public forwardMessagesToUser(
        messages: Message[],
        user: Contact,
    ): void {
        messages.forEach(message => {
            this.sendMessageToUserAction({
                message ,
                userId: user.id,
            });
        });
    }

    /**
     * Creates forward message.
     *
     * @param options                   Method parameters.
     * @param options.forwardTo         User to forward message to.
     * @param options.message           Message to be forwarded.
     * @param options.attachments       List of attachments to be forwarded.
     */
    public buildMessageToForward(options: {
        forwardTo: Contact,
        message?: Message,
        attachments?: MessageAttachment[],
    }): Message {
        if(options.message) {
            let userInfo = <Contact>this.getUserById({
                id: options.message.userId,
            });
            if(!userInfo) {
                userInfo = options.forwardTo;
            }
            return <Message>{
               ...options.message,
               forwarded: true,
               forwardedFromUser: {
                   id: userInfo.id,
                   name: userInfo.name || null,
                   num: userInfo.num,
               },
               id: options.forwardTo.id.toString()
                   + new Date().getTime().toString(),
               isUserMessage: true,
               num: this.currentAppUserData.num,
               status: 'sent',
               time: new Date().getTime(),
               userId: this.currentAppUserData.id,
           };
        }

        // Should be impossible. Provided for TSLint.
        if(!options.attachments) {
            throw new Error('Invalid options provided to build message to'
                + ' forward. at: ChatWindow.ts');
        }
        return <Message>{
            attachment:
                (<MessageAttachment[]>options.attachments).length === 1
                    ? options.attachments[0]
                    : null,
            forwarded: true,
            forwardedFromUser: {
                id: options.forwardTo.id,
                name: options.forwardTo.name || null,
                num: options.forwardTo.num,
            },
            id: options.forwardTo.id.toString()
                + new Date().getTime().toString(),
            isUserMessage: true,
            mediaGroup:
                (<MessageAttachment[]>options.attachments).length > 1
                    ? options.attachments
                    : null,
            message: '',
            num: this.currentAppUserData.num,
            repliedMessage: null,
            status: 'sent',
            time: new Date().getTime(),
            userId: this.currentAppUserData.id,
        };
    }

    /**
     * Scrolls chat window to bottom.
     * Also, if user forwarded messages, empties `selectedMessages` and sets
     * isSelectMode false.
     */
    public forwardSucceededHandler(): void {
        if(this.selectedMessages.length) this.selectedMessages = [];
        if(this.isSelectMode) this.isSelectMode = false;
        this.smoothlyScrollToEndForTime(150);
    }

    /**
     * Closes forward interface.
     */
    public forwardInterfaceCloseHandler(): void {
        this.isForwardInterfaceVisible = false;
    }

    /**
     * Finds message which contains needed attachment.
     *
     * @param id                        ID of the attachment replied to.
     */
    public replyToAttachmentHandler(id: string): void {
        this.isMediaPlayerVisible = false;
        this.smoothlyScrollToEndForTime(150);
        let message;

        const isAttachmentInMediaGroup = message => {
            return  message.mediaGroup
                    && message.mediaGroup.find(({ id: _id }) => _id === id );
        };

        if(!this.activeChat) return;

        dialogLoop:
        for(const dialog of this.activeChat.dialogs) {
            for(const _message of dialog.messages) {
                if( (_message.attachment && _message.attachment.id === id)
                    || isAttachmentInMediaGroup(_message)) {
                    message = _message;
                    break dialogLoop;
                }
            }
        }
        this.$emit('set-replied-message', message);
    }

    /**
     * Opens chat's or user's profile.
     */
    public openProfile(): void {
        if(!this.activeChat) return;

        let query = {};
        if(this.$route.query) {
            query = { ...this.$route.query };
        }
        query = {
            ...query,
            dsw: true,
            profile: true,
            type: this.activeChat.type,
        };

        this.$router.replace({
            path: this.$route.path,
            query,
        });
    }
    /**
     * Sets height of chat window container to prevent jump of scrolling.
     * Also, sets the indicator whether new messages are loading.
     *
     * @param isLoading                 Indicator whether new messages
     *                                  are loading.
     */
    public showMessagesLoader(isLoading: boolean): void {
        const chatWindow = this.$refs.chatWindow as HTMLElement;
        if (this.isMessagesLoader === null && !isLoading) {
            this.$nextTick(() => {
                this.isMessagesLoader = isLoading;
                chatWindow.scrollTop = chatWindow.scrollHeight;
            });
        } else if (this.isMessagesLoader !== null) {
            this.isMessagesLoader = isLoading;
            this.$nextTick(() => {
                if (isLoading) {
                    this.chatWindowScrollHeightBeforeAppend =
                        chatWindow.scrollHeight;
                } else {
                    chatWindow.scrollTop =
                        chatWindow.scrollTop
                        + (chatWindow.scrollHeight
                            - this.chatWindowScrollHeightBeforeAppend);
                }
            });
        }
    }

    /**
     * Saves last active chat ID to `activeChatId`.
     *
     * @param id                        ID of the active chat.
     */
    @Watch('$route.query.id', { immediate: true })
    watchQueryId(id: string | undefined): void {
        if(id) this.activeChatId = id;
    }

    /**
     * Scrolls dialog to the end.
     *
     * @param newChat                   Selected chat.
     */
    @Watch('activeChat')
    watchSelectedContact(newChat: Chat): void {
        if (newChat !== undefined) this.scrollToEndForTime(100);
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to scroll dialog to the bottom.
     * Also, adds listeners to media player events and chat window.
     */
    public mounted(): void {
        const chatWindow = this.$refs.chatWindow as HTMLElement;
        chatWindow.addEventListener('scroll', this.chatWindowListener);
        this.$root.$on('reply-to-attachment', this.replyToAttachmentHandler);
    }

    /**
     * Hooks `beforeDestroy` Vue lifecycle stage to remove `reply-to-attachment`
     * and `chatWindowListener` events listeners.
     */
    public beforeDestroy(): void {
        this.$root.$off('reply-to-attachment', this.replyToAttachmentHandler);
        const chatWindow = this.$refs.chatWindow as HTMLElement;
        chatWindow.removeEventListener('scroll', this.chatWindowListener);
    }
}
