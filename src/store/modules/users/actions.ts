import { ActionContext, ActionTree } from 'vuex';

import { ProfileMediaItem } from 'models/ProfileMediaItem';
import { User } from 'models/User';

import UsersState from 'store/modules/users/state';
import RootState from 'store/root/state';

import {
    ADD_USER_GALLERY_ITEM_MUTATION,
    ADD_USER_MUTATION,
    CHANGE_USER_NAME_MUTATION,
    DELETE_USER_GALLERY_FILE_MUTATION,
    DELETE_USER_MUTATION,
    SET_USER_AVATAR_MUTATION,
} from 'store/modules/users/mutations';


/**
 * Name of add user action.
 */
export const ADD_USER = 'addUser';

/**
 * Name of delete user action.
 */
export const DELETE_USER = 'deleteUser';

/**
 * Name of add user gallery file action.
 */
export const ADD_USER_GALLERY_FILE = 'addGalleryFile';

/**
 * Name of delete user gallery file.
 */
export const DELETE_USER_GALLERY_FILE = 'deleteGalleryFile';

/**
 * Name of update user avatar action.
 */
export const UPDATE_USER_AVATAR = 'updateUserAvatar';

/**
 * Name of change user name action.
 */
export const CHANGE_USER_NAME: string = 'changeUserName';

/**
 * Adds user core data to app store.
 *
 * @param store                         Users Vuex store.
 * @param payload                       Action parameters.
 * @param.user                          User data to be added.
 */
export function addUser(
    store: ActionContext<UsersState, RootState>,
    payload: {
        user: User,
    },
): void {
    store.commit(ADD_USER_MUTATION, { user: payload.user });
}

/**
 * Deletes user data from app store.
 *
 * @param store                         Users Vuex store.
 * @param payload                       Action parameters.
 * @param payload.user                  User, data of which to be removed.
 */
export function deleteUser(
    store: ActionContext<UsersState, RootState>,
    payload: {
        user: User,
    },
): void {
    store.commit(DELETE_USER_MUTATION, { id: payload.user.id });
}

/**
 * Sets user's avatar.
 *
 * @param store                         Users Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.chatId                ID of the user to be modified.
 * @param payload.avatar                Avatar to be set.
 */
export async function updateUserAvatar(
    store: ActionContext<UsersState, RootState>,
    payload: {
        chatId: string,
        avatar: string,
    },
): Promise<void> {
    store.commit(SET_USER_AVATAR_MUTATION, {
        avatar: payload.avatar,
        id: payload.chatId,
    });
}

/**
 * Adds new item to user's profile gallery.
 *
 * @param store                         Users Vuex Store.
 * @param payload                       Mutation parameters.
 * @param payload.chatId                ID of the user to be modified.
 * @param payload.item                  Media item to be added.
 */
export async function addGalleryFile(
    store: ActionContext<UsersState, RootState>,
    payload: {
        chatId: string,
        item: ProfileMediaItem,
    },
): Promise<void> {
    store.commit(ADD_USER_GALLERY_ITEM_MUTATION, {
        id: payload.chatId,
        item: payload.item,
    });
}

/**
 * Deletes profile media gallery file.
 *
 * @param store                         Users Vuex store.
 * @param payload                       Action parameters.
 * @param payload.id                    ID of the user to be modified.
 * @param payload.itemId                ID of the file to be deleted.
 */
export async function deleteGalleryFile(
    store: ActionContext<UsersState, RootState>,
    payload: {
        id: string,
        itemId: string,
    },
): Promise<void> {
    store.commit(DELETE_USER_GALLERY_FILE_MUTATION, {
        id: payload.id,
        itemId: payload.itemId,
    });
}

/**
 * Changes user's name.
 *
 * @param store                         Users Vuex store.
 * @param payload                       Action parameters.
 * @param payload.id                    ID of the user to be modified.
 * @param payload.name                  New name to be set.
 */
export async function changeUserName(
    store: ActionContext<UsersState, RootState>,
    payload: {
        id: string,
        name: string,
    },
): Promise<void> {
    store.commit(CHANGE_USER_NAME_MUTATION, {
        id: payload.id,
        name: payload.name,
    });
}

export default {
    addGalleryFile,
    addUser,
    changeUserName,
    deleteGalleryFile,
    deleteUser,
    updateUserAvatar,
} as ActionTree<UsersState, RootState>;
