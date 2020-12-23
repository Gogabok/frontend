import User from './User';


/**
 * Logged active user.
 * Repeat fields {@link https://social.io.instrumentisto.com/backend/edge/docs/api/myuser.doc.html}.
 */
export default class MyUser extends User {

    /**
     * Confirmed email address of user.
     */
    public email: GraphQLScalars.UserEmail | null;

    /**
     * Unique login of the user.
     */
    public login: GraphQLScalars.UserLogin | null;

    /**
     * Newly set email address of user that requires confirmation.
     */
    public unconfirmedEmail: GraphQLScalars.UserEmail | null;

    /**
     * Name of the user.
     */
    public name: GraphQLScalars.UserName | null;

    /**
     * Indicator that the user has password.
     */
    public hasPassword: boolean;

    /**
     * Setting of how this `MyUser`'s name is displayed in client applications.
     * Default is `MyUser.num`.
     */
    public displayNameSetting: UserDisplayNameSetting;

    /**
     * Creates `MyUser` instance.
     *
     * @param data   Object that contains `MyUser` data.
     */
    constructor(data: {
        __typename: 'MyUser',
        id: GraphQLScalars.UserId,
        userNum: GraphQLScalars.Num,
        login?: GraphQLScalars.UserLogin | null,
        email?: GraphQLScalars.UserEmail | null,
        unconfirmedEmail?: GraphQLScalars.UserEmail | null,
        name?: GraphQLScalars.UserName | null,
        hasPassword?: boolean,
        ver: GraphQLScalars.Version,
    }) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        super({ ...data, __typename: 'User', displayName: data.num });

        this.login = data?.login !== undefined ? data.login : null;
        this.email = data?.email !== undefined ? data.email : null;
        this.unconfirmedEmail =
            data?.unconfirmedEmail !== undefined ? data.unconfirmedEmail : null;
        this.name = data?.name !== undefined ? data.name : null;
        this.hasPassword = data.hasPassword || false;
        this.displayNameSetting = UserDisplayNameSetting.NUM;
    }
}

/**
 * Type of setting for displaying MyUser's name in client applications.
 */
export enum UserDisplayNameSetting {
    NUM = 'userNum',
    NAME = 'name',
    LOGIN = 'login',
    EMAIL = 'email'
}
