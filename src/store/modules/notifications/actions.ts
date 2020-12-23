import { ActionContext, ActionTree } from 'vuex';

import { Notification } from 'models/Notification';

import NotificationsState from 'store/modules/notifications/state';
import RootState from 'store/root/state';

import {
    ADD_NOTIFICATION_MUTATION,
    DELETE_NOTIFICATION_MUTATION,
} from 'store/modules/notifications/mutations';


/**
 * Name of add notification action.
 */
export const ADD_NOTIFICATION: string = 'addNotification';

/**
 * Name of delete notification action.
 */
export const DELETE_NOTIFICATION: string = 'deleteNotification';


/**
 * Adds notification to notifications list.
 *
 * @param store                         Notifications Vuex store.
 * @param payload                       Action payload.
 * @param payload.notification          Notification to be added.
 */
export function addNotification(
    store: ActionContext<NotificationsState, RootState>,
    payload: {
        notification: Notification,
    },
): void {
    store.commit(ADD_NOTIFICATION_MUTATION, payload);
}

/**
 * Deletes notification from notifications list.
 *
 * @param store                         Notifications Vuex store.
 * @param payload                       Action payload.
 * @param payload.id                    ID of the notification to be deleted.
 */
export function deleteNotification(
    store: ActionContext<NotificationsState, RootState>,
    payload: {
        id: string,
    },
): void {
    store.commit(DELETE_NOTIFICATION_MUTATION, payload);
}

export default {
    addNotification,
    deleteNotification,
} as ActionTree<NotificationsState, RootState>;
