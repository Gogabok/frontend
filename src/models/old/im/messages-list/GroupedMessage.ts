import Message from 'models/old/im/Message';


/**
 * Extended message for easy message grouping.
 */
export default class GroupedMessage extends Message {

    /**
     * Grouped messages list.
     */
    public grouped: Message[];

    /**
     * JS date object.
     */
    public date: Date;

    /**
     * Defines is there be a day separator.
     */
    public dateSeparator: boolean;

    /**
     * Show message group action flag.
     */
    public showActions: boolean;

    /**
     * Status tooltip text.
     */
    public statusTooltip?: boolean;

    /**
     * Delivered flag.
     */
    public delivered?: boolean;

    /**
     * Read flag.
     */
    public read?: boolean;

}
