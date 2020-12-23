import { MutationTree } from 'vuex';

import { ProfileMediaItem } from 'models/ProfileMediaItem';
import { User } from 'models/User';

import UsersState from 'store/modules/users/state';


/**
 * Name of add user mutation.
 */
export const ADD_USER_MUTATION: string = 'addUser';

/**
 * Name of delete user mutation.
 */
export const DELETE_USER_MUTATION: string = 'deleteUser';

/**
 * Name of add profile gallery item mutation.
 */
export const ADD_USER_GALLERY_ITEM_MUTATION: string = 'addProfileGalleryItem';

/**
 * Name of set avatar mutation.
 */
export const SET_USER_AVATAR_MUTATION: string = 'setAvatar';

/**
 * Name of delete user gallery file mutation.
 */
export const DELETE_USER_GALLERY_FILE_MUTATION: string = 'deleteGalleryFile';

/**
 * Name of change user name mutation.
 */
export const CHANGE_USER_NAME_MUTATION: string = 'changeUserNameMutation';

/**
 * Adds user core data to app store.
 *
 * @param state                         Users Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.user                  User information to be added.
 */
export function addUser(
    state: UsersState,
    payload: {
        user: User,
    },
): void {
    state.users.push(payload.user);
}

/**
 * Deletes user data from the app store.
 *
 * @param state                         Users Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of the user, data of which should be
 *                                      removed.
 */
export function deleteUser(
    state: UsersState,
    payload: {
        id: string,
    },
): void {
    state.users = state.users.filter(user => user.id !== payload.id);
}

/**
 * Sets user's avatar.
 *
 * @param state                         Users Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of the user to be modified.
 * @param payload.avatar                Avatar to be set.
 */
export function setAvatar(
    state: UsersState,
    payload: {
        id: string,
        avatar: string,
    },
): void {
    const chat = state.users.find(user => user.id === payload.id);
    if(!chat || chat.type !== 'group') return;

    chat.avatarPath = payload.avatar;
}

/**
 * Adds new item to user's profile gallery.
 *
 * @param state                         Users Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of the user to be modified.
 * @param payload.item                  Media item to be added.
 */
export function addProfileGalleryItem(
    state: UsersState,
    payload: {
        id: string,
        item: ProfileMediaItem,
    },
): void {
    const chat = state.users.find(user => user.id === payload.id);
    if(!chat || chat.type !== 'group') return;

    chat.gallery.unshift(payload.item);
}

/**
 * Deletes profile media gallery item.
 *
 * @param state                         Users Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of the user to be modified.
 * @param payload.itemId                ID of the item to be deleted.
 */
export function deleteGalleryFile(
    state: UsersState,
    payload: {
        id: string,
        itemId: string,
    },
): void {
    const user = state.users.find(user => user.id === payload.id);
    if(!user) return;

    user.gallery = user.gallery.filter(item => item.id === payload.itemId);
}

/**
 * Sets user name.
 *
 * @param state                         Users Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of the user to be modified.
 * @param payload.name                  New name to be set.
 */
export function changeUserNameMutation(
    state: UsersState,
    payload: {
        id: string,
        name: string,
    },
): void {
    const user = state.users.find(user => user.id === payload.id);
    if(!user) return;

    user.name = payload.name;
}

export default{
    addProfileGalleryItem,
    addUser,
    changeUserNameMutation,
    deleteGalleryFile,
    deleteUser,
    setAvatar,
} as MutationTree<UsersState>;
