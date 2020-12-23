import { GetterTree } from 'vuex';

import { Notification } from 'models/Notification';

import NotificationsState from 'store/modules/notifications/state';
import RootState from 'store/root/state';

/**
 * Name of notifications getter.
 */
export const GET_NOTIFICATIONS: string = 'getNotifications';


/**
 * Returns notifications list.
 *
 * @param state                         Notifications Vuex state
 */
export function getNotifications(
    state: NotificationsState,
): Notification[] {
    return state.notifications;
}

export default {
    getNotifications,
} as GetterTree<NotificationsState, RootState>;
