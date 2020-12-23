import Message from 'models/old/im/Message';


/**
 * Message menu types. Shows type of the stored menu context.
 */
export enum MessageMenuContextTypes {
    LIST,
    SENDING,
    SINGLE,
}

/**
 * Message menu context type.
 */
export default class MessageMenuContext {

    /**
     * Menu target type.
     */
    public type: MessageMenuContextTypes;

    /**
     * Messages list if menu target type is LIST.
     */
    public list: Message[] | undefined;

    /**
     * Single message if menu target type is SINGLE.
     */
    public single: Message | undefined;

    /**
     * Sending message text if menu target type is SENDING.
     */
    public sending: string | undefined;

}
