import MyUser from 'models/old/user/MyUser';
import Session from 'models/old/user/Session';


/**
 * Saved user account.
 */
class SavedAccount {

    /**
     * Last date when account was used for login, in ISO 8601 format.
     */
    lastDate: string;

    /**
     * User instance.
     */
    user: MyUser;

    /**
     * Remembered session.
     */
    rememberedSession: Session | null;

    /**
     * New instance constructor.
     *
     * @param data   Object with required data for SavedUser instance.
     */
    constructor(data: {
        lastDate: string,
        rememberedSession: Session | null,
        user: MyUser,
    }) {
        this.lastDate = data.lastDate;
        this.rememberedSession = data.rememberedSession;
        this.user = data.user;
    }
}

export default SavedAccount;
