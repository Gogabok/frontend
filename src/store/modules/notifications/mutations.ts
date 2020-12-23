import { MutationTree } from 'vuex';

import { Notification } from 'models/Notification';

import NotificationsState from 'store/modules/notifications/state';


/**
 * Name of add notification mutation.
 */
export const ADD_NOTIFICATION_MUTATION: string = 'addNotification';

/**
 * Name of delete notification mutation
 */
export const DELETE_NOTIFICATION_MUTATION: string = 'deleteNotification';


/**
 * Adds notification to notifications list.
 *
 * @param state                         Notifications Vuex state.
 * @param payload                       Mutation payload.
 * @param payload.notification          Notification to be added.
 */
export function addNotification(
    state: NotificationsState,
    payload: {
        notification: Notification,
    },
): void {
    state.notifications = [];
    state.notifications.push(payload.notification);
}

/**
 * Deletes notification from notifications list.
 *
 * @param state                         Notifications Vuex state.
 * @param payload                       Mutation payload.
 * @param payload.id                    ID of the notification to be deleted.
 */
export function deleteNotification(
    state: NotificationsState,
    payload: {
        id: string,
    },
): void {
    state.notifications = state.notifications.filter(item =>
        item.id !== payload.id,
    );
}

export default {
    addNotification,
    deleteNotification,
} as MutationTree<NotificationsState>;
