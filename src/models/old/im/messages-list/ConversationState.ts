import MessageMenuContext from 'models/old/im/messages-list/MessageMenuContext';
import { MessageMenuStateTypes, TranslateMessageStateTypes } from 'models/old/im/messages-list/StateTypes';


/**
 * Name of conversation scroll state.
 */
export const CONVERSATION_SCROLL: string = 'conversationScroll';

/**
 * Name of message menu context conversation state.
 */
export const MESSAGE_MENU_CONTEXT: string = 'messageMenuContext';

/**
 * Name of message menu state.
 */
export const MESSAGE_MENU: string = 'messageMenu';

/**
 * Name of translate message state.
 */
export const TRANSLATE_MESSAGE: string = 'translateMessage';

/**
 * Name of editable content HTML state.
 */
export const EDITABLE_CONTENT_HTML: string = 'editableContentHTML';

/**
 * Name of messages loading state.
 */
export const MESSAGES_LOADING: string = 'messagesLoading';

/**
 * Selected conversation state.
 */
export default class ConversationState {

    /**
     * Conversation ID.
     */
    public id: string;

    /**
     * Saved conversation scroll value from bottom to top.
     */
    public conversationScroll: number | undefined;

    /**
     * Conversation message, message IDs list or message text (if not sended)
     * menu context state.
     */
    public messageMenuContext: MessageMenuContext | undefined;

    /**
     * Conversation message menu state.
     */
    public messageMenu: MessageMenuStateTypes | undefined;

    /**
     * Conversation translate message state.
     */
    public translateMessage: TranslateMessageStateTypes | undefined;

    /**
     * Editable content that must be sent.
     */
    public editableContentHTML: string | undefined;

    /**
     * Is messages loading state.
     */
    public messagesLoading: boolean | undefined;

    /**
     * Init conversation state instance.
     *
     * @param id    Conversation ID.
     */
    public constructor(id: string) {
        this.id = id;
    }
}
