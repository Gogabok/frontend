import { GetterTree } from 'vuex';

import { getChatId } from 'utils/chatsRequests';

import { CurrentUser } from 'models/CurrentUser';
import { UserStatus } from 'models/UserStatus';

import UserState from 'store/modules/user/state';
import RootState from 'store/root/state';


/**
 * Name of user data getter.
 */
export const GET_USER_DATA: string = 'getUserData';

/**
 * Name of blocked users getter.
 */
export const GET_BLOCKED_USERS: string = 'getBlockedUsers';

/**
 * Name of muted users getter.
 */
export const GET_MUTED_USERS: string = 'getMutedUsers';

/**
 * Name of favorite contacts getter.
 */
export const GET_FAVORITE_CONTACTS: string = 'getFavoriteUsers';

/**
 * Name of user contacts getters.
 */
export const GET_USER_CONTACTS: string = 'getContacts';

/**
 * Name of user statuses list getter.
 */
export const GET_USER_STATUSES_LIST: string = 'getStatusesList';

/**
 * Returns current user data.
 *
 * @param state                         User Vuex state.
 */
export function getUserData(
    state: UserState,
): CurrentUser {
    return {
        about: state.about,
        avatarId: state.avatarId,
        avatarPath: state.avatarPath,
        blockedUsers: state.blockedUsers,
        chatId: `chid-${getChatId(state.id, state.id)}`,
        contacts: state.contacts,
        emails: state.emails,
        favoriteContacts: state.favoriteContacts,
        gallery: state.gallery,
        hasPassword: state.hasPassword,
        id: state.id,
        isContact: state.contacts.includes(state.id),
        lastSeen: state.lastSeen,
        login: state.login,
        mutedUsers: state.mutedUsers,
        name: state.name,
        num: state.num,
        status: <UserStatus>state.statusesList.find(
            status => status.id === state.statusId,
        ),
        ver: state.ver,
    };
}

/**
 * Returns list of user's statuses.
 *
 * @param state                         User Vuex state.
 */
export function getStatusesList(
    state: UserState,
): UserStatus[] {
    return state.statusesList;
}

/**
 * Returns list of muted users.
 *
 * @param state                         User Vuex state.
 */
export function getMutedUsers(
    state: UserState,
): Array<{id: string, mutedUntil: number}> {
    return state.mutedUsers;
}

/**
 * Returns list of blocked users.
 *
 * @param state                         User Vuex state.
 */
export function getBlockedUsers(
    state: UserState,
): string[] {
    return state.blockedUsers;
}

/**
 * Returns list of favorite users.
 *
 * @param state                         User Vuex state.
 */
export function getFavoriteUsers(
    state: UserState,
): string[] {
    return state.favoriteContacts;
}

/**
 * Returns list of user's contacts.
 *
 * @param state                         User Vuex state.
 */
export function getContacts(
    state: UserState,
): string[] {
    return state.contacts;
}


export default {
    getBlockedUsers,
    getContacts,
    getFavoriteUsers,
    getMutedUsers,
    getStatusesList,
    getUserData,
} as GetterTree<UserState, RootState>;
