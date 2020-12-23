/**
 * User session.
 */
export default class Session {

    /**
     * Unique authentication token of this `Session`.
     */
    public token: GraphQLScalars.AccessToken | GraphQLScalars.RememberToken;

    /**
     * Datetime of this `Session` expiration in [RFC 3339] format.
     */
    public expireAt: GraphQLScalars.DateTimeUtc;

    /**
     * Version of this `Session`'s state.
     */
    public ver: GraphQLScalars.Version;

    /**
     * Creates `Session` instance.
     *
     * @param data   Object that contains `Session` data.
     */
    public constructor(data: {
        __typename: 'Session' | 'RememberedSession',
        token: GraphQLScalars.AccessToken | GraphQLScalars.RememberToken,
        expireAt: GraphQLScalars.DateTimeUtc,
        ver: GraphQLScalars.Version,
    }) {
        this.token = data.token;
        this.expireAt = data.expireAt;
        this.ver = data.ver;
    }

    /**
     * Checks if `Session` is expired at this moment.
     *
     * @param session   Session to be checked.
     */
    public static isExpired(session: Session): boolean {
        const expireAtDate = new Date(session.expireAt);
        const diff = expireAtDate.getTime() - Date.now();
        return diff < 0;
    }
}
