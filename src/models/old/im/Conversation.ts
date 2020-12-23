import Contact from 'models/old/im/Contact';
import Message from 'models/old/im/Message';


/**
 * Conversation from users conversations list.
 */
export default class Conversation {

    /**
     * ID of conversation.
     */
    public id: string;

    /**
     * Amount of unread messages.
     */
    public unreadCount: number;

    /**
     * Flag that true if conversation in favourite list.
     */
    public isFavourite: boolean;

    /**
     * Conversations title.
     */
    public title: string;

    /**
     * Conversations description.
     */
    public description: string;

    /**
     * Conversation status.
     */
    public status: string;

    /**
     * Photo preview of conversation.
     */
    public photo: string;

    /**
     * Users that participate conversation.
     */
    public participants: Contact[];

    /**
     * Conversation messages.
     */
    public messages: Message[];

    /**
     * Are there exist more messages to load.
     */
    public hasMoreMessages: boolean;

    /**
     * Flag, that true if user subscribed to broadcast starting notices.
     * Available only for broadcast's conversation.
     */
    public notices?: boolean;

    /**
     * Date of oldest message into this conversation.
     */
    public messagesFrom?: string | null;

    /**
     * Messages that contains photo attachments.
     */
    public photoAttachments: Array<Message | undefined>;

    /**
     * Total photo attachments count.
     */
    public photoAttachmentsCount: number;

    /**
     * Initializes conversation item with given required properties.
     *
     * @param id                ID of broadcast of contact.
     * @param unreadCount       Amount of unread messages.
     * @param isFavourite       Flag, that true if conversation in favourite
     *                          list of user.
     * @param title             Contact name or broadcast's author name.
     * @param description       Contact last message or broacast's description.
     * @param status            User status.
     * @param photo             Photo preview of conversation.
     * @param messages          Conversation messages.
     * @param hasMoreMessages   Are there exist more messages to load.
     * @param notices           Is user subscribed to broadcast starting
     *                          notices.
     * @param participants      Conversation participants.
     * @param messagesFrom      Date of oldest message.
     */
    public constructor(
        id: string,
        unreadCount: number,
        isFavourite: boolean,
        title: string,
        description: string,
        status: string,
        photo: string,
        messages: Message[],
        hasMoreMessages: boolean,
        notices?: boolean,
        participants?: Contact[],
        messagesFrom?: string,
    ) {
        this.id = id;
        this.unreadCount = unreadCount;
        this.isFavourite = isFavourite;
        this.title = title;
        this.description = description;
        this.status = status;
        this.photo = photo;
        this.messages = messages;
        this.photoAttachments = []; // TODO
        this.photoAttachmentsCount = 0; // TODO
        this.hasMoreMessages = hasMoreMessages;
        this.notices = notices;
        this.participants = participants || [];
        this.messagesFrom = messagesFrom;
    }
}
