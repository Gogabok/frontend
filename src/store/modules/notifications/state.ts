import { Notification } from 'models/Notification';


/**
 * Notifications Vuex state.
 */
export default class NotificationsState {
    /**
     * User's notifications.
     */
    public notifications: Notification[] = [];
}
