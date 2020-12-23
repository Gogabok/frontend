/**
 * Describes values for user gender.
 */
export enum Gender {
    male = 'male',
    female = 'female',
}

/**
 * Application user.
 *
 * TODO: Deprecated user type, remove after components will be refactored.
 *       With backend API will be used models/user/MyUser model.
 */
export default class User {

    /**
     * Online user status name.
     */
    public static readonly statusOnline: string = 'online';

    /**
     * Offline user status name.
     */
    public static readonly statusOffline: string = 'offline';

    /**
     * Busy user status name.
     */
    public static readonly statusBusy: string = 'busy';

    /**
     * Away user status name.
     */
    public static readonly statusAway: string = 'away';

    /**
     * Status name, when user is in call process.
     */
    public static readonly statusCalled: string = 'called';

    /**
     * List of all available global user statuses, that can be changed by user.
     */
    public static readonly statuses: string[] = [
        User.statusOnline,
        // User.statusBusy,
        User.statusAway,
        User.statusOffline,
    ];

    /**
     * List of all available user marital statuses.
     */
    // public maritalStatuses: string[];

    /**
     * User gender.
     */
    public gender: Gender.male | Gender.female;

    /**
     * User num.
     */
    public num: string;

    /**
     * Login, picked by user.
     */
    public login: string;

    /**
     * User slogan.
     */
    public slogan: string;

    /**
     * Client name.
     */
    public name: string;

    /**
     * User avatar image URL.
     */
    public photo: string;

    /**
     * Current user status name.
     */
    public status: string;

    /**
     * User birth date as ISO string.
     */
    public birth: string;

    /**
     * User current location.
     */
    public location: string;

    /**
     * User education.
     */
    public education: string;

    /**
     * User job.
     */
    public job: string;

    /**
     * User language.
     */
    public language: string;

    /**
     * User marital status.
     */
    public maritalStatus: string;

    /**
     * User account balance.
     */
    public funds: number;

    /**
     * User email addresses list.
     */
    public emails: string[];

    /**
     * Is user already set password.
     */
    public isPasswordSet: boolean;

    /**
     * An identifier that be displayed to other users in a list of
     * messages/contacts, etc.
     */
    public defaultId: string;

    /**
     * Default ID type name.
     */
    public defaultIdType: string;

    // /**
    //  * Number of user followers.
    //  */
    // public followers: number;

    // /**
    //  * Flag, that specifies if user is currently followed by authorized user.
    //  */
    // public isFollowedByMe: boolean = false;

    /**
     * Initializes user with given required properties.
     *
     * @param userNum          User num.
     * @param login            Login, picked by user.
     * @param name             User name.
     * @param photo            User avatar image URL.
     * @param status           User status name - one of the `status*`
     *                         constants.
     * @param followers        Optional, number if user followers.
     * @param slogan           Optional, user slogan string.
     * @param funds            Optional, user account balance.
     * @param email            Optional, user email address.
     * @param isPasswordSet    Optional, is user set password.
     */
    public constructor(
        num: string,
        login: string,
        name: string,
        photo: string,
        status: string,
        followers?: number,
        slogan?: string,
        funds?: number,
        email?: string,
        isPasswordSet?: boolean,
    ) {
        this.num = num;
        this.login = login;
        this.name = name;
        this.photo = photo;
        this.status = status;
        this.slogan = slogan || '';
        this.funds = funds || 0;
        this.emails = email !== undefined ? [email] : [];
        this.isPasswordSet = isPasswordSet || false;

        this.defaultId = num;
        this.defaultIdType = 'gapopa-id';

        if (followers !== undefined) {
            // this.followers = followers;
        }
    }
}
