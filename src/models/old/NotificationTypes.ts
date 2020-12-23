import GetFulfill from 'utils/GetFulfill';


/**
 * Notification variety.
 */
export enum NotificationTypes {
    FATAL_ERROR = 'fatal-error',
    RELOAD_REQUIRED = 'reload-required',
}

/**
 * All necessary notification data.
 */
export class NotificationModel {

    /**
     * Uniq notification ID.
     */
    public id: string;

    /**
     * Current notification type.
     */
    public type: NotificationTypes;

    /**
     * Close notification callback. Executes when user clicks the close icon.
     */
    public onClose: (() => void) | null;

    /**
     * Notification body click callback.
     */
    public onClick: (() => void) | null;

    /**
     * Executes while user dont see the page.
     */
    public onNotVisible: (() => void) | null;

    /**
     * Notification constructor.
     *
     * @param type           Notification type.
     * @param onClose        Close notification callback.
     * @param onClick        Notification body click callback.
     * @param onNotVisible   Executes while user dont see the page.
     */
    constructor(
        type: NotificationTypes,
        onClose?: () => void,
        onClick?: () => void,
        onNotVisible?: () => void,
    ) {
        this.id = GetFulfill.id();
        this.type = type;
        this.onClose = onClose !== undefined ? onClose : null;
        this.onClick = onClick !== undefined ? onClick : null;
        this.onNotVisible = onNotVisible !== undefined ? onNotVisible : null;
    }
}

export default NotificationTypes;
