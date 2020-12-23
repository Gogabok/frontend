import Contact from 'models/old/im/Contact';
import Attachment from 'models/old/im/MessageAttachment';
import GetFulfill from 'utils/GetFulfill';


/**
 * Message, sent from one user to another in internal messaging system (chat).
 */
export default class Message {

    /**
     * Conversation belonging.
     */
    public conversationId: string;

    /**
     * Is message has been deleted.
     */
    public deleted: boolean;

    /**
     * When message has been deleted in ISO 8601 format or `await` value.
     */
    public deletedAt: string | null;

    /**
     * Shows possibility to delete message.
     */
    public deletable: boolean;

    /**
     * Is notification message type.
     */
    public isNotification: boolean;

    /**
     * Is status message type.
     */
    public isStatus: boolean;

    /**
     * Is message send by self user.
     */
    public mine: boolean;

    /**
     * Unique message ID.
     */
    public id: string;

    /**
     * Contact, if message is transfered.
     */
    public transferedFrom: Contact | null;

    /**
     * Time, when message has been sent in ISO 8601 format.
     */
    public sentAt: string;

    /**
     * Contact, that message has been sent by. Null if mine true.
     */
    public sender: Contact | null;

    /**
     * Message text.
     */
    public text: string | null;

    /**
     * Files, that have been attached to the message (except images).
     */
    public attachment: Attachment | null;

    /**
     * Message status. Allowed values:
     *  - `new`             - new, just created message, yet not try sent;
     *  - `sent`            - success sent to server, but not read;
     *  - `fail`            - failed to sent;
     *  - `resent`          - tried to resend message after send fail;
     *  - `cancel-resend`   - canceled resend message after send fail;
     *  - `delivered`       - message was delivered to receiver`s device;
     *  - `read`            - message was read;
     */
    public status: string;

    /**
     * Indicator whether message must be translated.
     */
    public translate: boolean;

    /**
     * Initializes message with given required properties.
     *
     * @param mine              Is message send by active user.
     * @param conversationId    Conversation belonging.
     * @param text              Optional, message text.
     * @param translate         Optional, is message must be translate.
     * @param attachment        Optional, files attached to message.
     * @param sender            Optional, if sender not an active user.
     * @param transferedFrom    Optional, if message is transfered from original
     *                          sender.
     * @param deletable         Optional, is message can be deleted
     *                          by active user.
     * @param deleted           Optional, is the message already deleted.
     * @param isNotification    Optional, is it a notification.
     * @param isStatus          Optional, is it a status.
     */
    public constructor(
        mine: boolean,
        conversationId: string,
        text?: string,
        translate?: boolean,
        attachment?: Attachment,
        sender?: Contact,
        transferedFrom?: Contact,
        deletable?: boolean,
        deleted?: boolean,
        isNotification?: boolean,
        isStatus?: boolean,
    ) {
        this.id = GetFulfill.id();
        this.mine = mine;
        this.conversationId = conversationId;

        this.text = text !== undefined ? text : null;
        this.translate = translate || false;
        this.attachment = attachment !== undefined ? attachment : null;
        this.sender = sender !== undefined ? sender : null;
        this.transferedFrom =
            transferedFrom !== undefined ? transferedFrom : null;
        this.deleted = deleted || false;
        this.deletable = deletable !== undefined ? deletable : true;
        this.isNotification = isNotification || false;
        this.isStatus = isStatus || false;

        this.status = 'new';
        this.sentAt = new Date().toISOString();
        this.deletedAt = null;
    }
}
