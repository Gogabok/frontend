/**
 * Result of the share mutations.
 */
export default class ShareResult {

    /**
     * Is there exists same link.
     */
    public alreadyExist: boolean | null;

    /**
     * Link exceeds max length.
     */
    public exceedsMaxLength: boolean | null;

    /**
     * Link is empty.
     */
    public isEmpty: boolean | null;

    /**
     * Full link to share.
     */
    public link: string | null;

    /**
     * Link contains not valid chars.
     */
    public notValid: boolean | null;

    /**
     * Success link share.
     */
    public success: boolean | null;

}
