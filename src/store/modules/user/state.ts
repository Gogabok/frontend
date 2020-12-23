import { OwnEmail } from 'models/Mail';
import { ProfileMediaItem } from 'models/ProfileMediaItem';
import { UserStatus, UserStatusCode } from 'models/UserStatus';


/**
 * User module state.
 */
export default class UserState {
    /**
     * User's id.
     */
    public id: string;

    /**
     * User's num.
     */
    public num: string;

    /**
     * User's current status ID.
     */
    public statusId: string;

    /**
     * User's name.
     */
    public name: string;

    /**
     * Avatar path.
     */
    public avatarPath: string;

    /**
     * ID of the image used as avatar.
     */
    public avatarId: string;

    /**
     * User's login.
     */
    public login: string;

    /**
     * User's emails list.
     */
    public emails: OwnEmail[];

    /**
     * Indicator whether user has password set.
     */
    public hasPassword: boolean;

    /**
     * User's last activity time (UNIX time).
     */
    public lastSeen: number;

    /**
     * User's about information.
     */
    public about: string;

    /**
     * User's profile gallery.
     */
    public gallery: ProfileMediaItem[];

    /**
     * List of user's statuses.
     */
    public statusesList: UserStatus[];

    /**
     * Blocked users ids list.
     */
    public blockedUsers: string[];

    /**
     * Muted users list.
     */
    public mutedUsers: Array<{id: string, mutedUntil: number}>;

    /**
     * List of user's contacts IDs.
     */
    public contacts: string[];

    /**
     * List of user's favorite contacts IDs.
     */
    public favoriteContacts: string[];

    /**
     * User's model version.
     */
    public ver: string = 'v1';

    /**
     * Creates initial user module state.
     */
    constructor() {
        this.id = `uid-${Math.floor(Math.random() * 1000)}`;
        this.num = `&user-${Math.floor(1000000 + Math.random() * 1000000)}`;
        this.statusesList = [
            {
                code: UserStatusCode.Online,
                description: null,
                id: 'system-online',
                title: 'Last visit information (by default)',
            },
            {
                code: UserStatusCode.Away,
                description: null,
                id: 'system-away',
                title: 'Away',
            },
            {
                code: UserStatusCode.Private,
                description: 'Last visit information is disabled',
                id: 'system-private',
                title: 'Private',
            },
        ];
        this.statusId = this.statusesList[0].id;
        this.name = '';
        this.avatarPath = '';
        this.emails = [];
        this.login = '';
        this.hasPassword = false;
        this.lastSeen = new Date().getTime();
        this.about = '';
        this.gallery = [];
        this.blockedUsers = [];
        this.contacts = [];
        this.favoriteContacts = [];
        this.mutedUsers = [];
    }
}
