import User from 'models/old/User';


/**
 * Contact, that user can chat, call etc with.
 *
 * @extends User
 */
export default class Contact extends User {

    /**
     * Count of unread notifications, messages etc., that belongs to contact.
     */
    public unreadCount: number = 0;

    /**
     * Flag, that indicates if contact requested access for the first time
     * with the current user.
     */
    public isRequested: boolean = false;

    /**
     * Flag, that indicates if contact has new unread notifications.
     */
    public isNew: boolean = false;

    /**
     * Flag, that indicates if contact is marked as favourite.
     */
    public isFavourite: boolean = false;

    /**
     * Flag, that indicates if contact is blocked by me.
     */
    public isBlockedByMe: boolean = false;

    /**
     * Flag, that indicates if me is blocked by this contact.
     */
    public isMeBlocked: boolean = false;

    /**
     * Сontact name alias.
     */
    public alias: string;

    /**
     * Initializes contact with specified required properties.
     *
     * @param user          User, that contact belongs to.
     * @param alias         Contact's alias.
     * @param unreadCount   Count of unread notifications, messages etc.,
     *                      that belongs to contact.
     * @param isRequested   Flag, that indicates if contact requested access for
     *                      the first time with current user.
     * @param isNew         Flag, that indicates if contact has new unread
     *                      notifications.
     * @param isFavourite   Flag, that indicates if contact is marked as
     *                      favourite.
     * @param isBlockedByMe Flag, that indicates if contact is blocked by me.
     * @param isMeBlocked   Flag, that indicates if me is blocked
     *                      by this contact.
     */
    public constructor(
        user: User,
        alias?: string,
        unreadCount?: number,
        isRequested?: boolean,
        isNew?: boolean,
        isFavourite?: boolean,
        isBlockedByMe?: boolean,
        isMeBlocked?: boolean,
    ) {
        super(
            user.num,
            user.login,
            user.name,
            user.photo,
            user.status,
        );

        this.alias = (alias !== undefined)
            ? alias
            : user.name;
        if (unreadCount !== undefined) {
            this.unreadCount = unreadCount;
        }
        if (isRequested !== undefined) {
            this.isRequested = isRequested;
        }
        if (isNew !== undefined) {
            this.isNew = isNew;
        }
        if (isFavourite !== undefined) {
            this.isFavourite = isFavourite;
        }
        if (isBlockedByMe !== undefined) {
            this.isBlockedByMe = isBlockedByMe;
        }
        if (isMeBlocked !== undefined) {
            this.isMeBlocked = isMeBlocked;
        }
    }
}
