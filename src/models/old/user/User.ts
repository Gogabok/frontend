/**
 * User model.
 * Repeat fields {@link https://social.io.instrumentisto.com/backend/edge/docs/api/user.doc.html}.
 */
export default class User {

    /**
     * Unique ID of user.
     */
    public readonly id: GraphQLScalars.UserId;

    /**
     * Public unique user number.
     */
    public readonly userNum: GraphQLScalars.Num;

    /**
     * Version of user's state.
     */
    public readonly ver: GraphQLScalars.Version;

    /**
     * Display name of user.
     */
    public displayName: string;

    /**
     * These two fields were created to calm down TSLint.
     * TODO: Implement logic for these fields.
     */
    public photo: string;
    public status: string;

    /**
     * Creates `User` instance.
     *
     * @param data   Object that contains `User` data.
     */
    constructor(data: {
        __typename: 'User',
        id: GraphQLScalars.UserId,
        num: GraphQLScalars.Num,
        displayName: string,
        ver: GraphQLScalars.Version,
    }) {
        this.id = data.id;
        this.userNum = data.num;
        this.ver = data.ver;
        this.displayName = data.displayName;
    }
}
