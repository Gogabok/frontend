import { GetterTree } from 'vuex';

import { getChatId } from 'utils/chatsRequests';

import { ChatPartial } from 'models/Chat';
import { User, UserPartial } from 'models/User';

import UsersState from 'store/modules/users/state';
import RootGetters from 'store/RootGetters';
import VuexRootState from 'store/VuexRootState';

import ChatsModule from 'store/modules/chats';
import UserModule from 'store/modules/user';

import { GET_RAW_CHAT_BY_ID } from 'store/modules/chats/getters';
import {
    GET_BLOCKED_USERS,
    GET_FAVORITE_CONTACTS,
    GET_MUTED_USERS,
    GET_USER_CONTACTS,
    GET_USER_DATA,
} from 'store/modules/user/getters';


/**
 * Name of get user by ID getter.
 */
export const GET_USER_BY_ID: string = 'getUserById';

/**
 * Name of get all users getter.
 */
export const GET_ALL_USERS: string = 'getAllUsers';

/**
 * Name of get raw user by ID getter.
 */
export const GET_RAW_USER_BY_ID: string = 'getRawUserById';

/**
 * Name of get user by chat ID getter.
 */
export const GET_USER_BY_CHAT_ID: string = 'getUserByChatId';

/**
 * Name of is contact getter.
 */
export const GET_IS_USER_IN_CONTACTS: string = 'isContact';


/**
 * Returns raw user data by ID.
 *
 * @param state                         Users Vuex state.
 */
export function getRawUserById(
    state: UsersState,
): (payload: { id: string }) => UserPartial | null {
    return (payload: { id: string }) => state.users.find(
        user => user.id === payload.id,
    ) || null;
}

/**
 * Checks whether user with provided ID is a contact.
 *
 * @param state                         Users Vuex state.
 * @param getters                       Users Vuex getters.
 * @param rootState                     Vuex root state.
 * @param rootGetters                   Vuex root getters.
 */
export function isContact(
    state: UsersState,
    getters: keyof typeof UsersGetters,
    rootState: VuexRootState,
    rootGetters: RootGetters,
): (payload: { id: string }) => boolean {
    const userModule = (name) => `${UserModule.vuexName}/${name}`;
    const contactsList = rootGetters[userModule(GET_USER_CONTACTS)];

    return (payload: { id: string }) => {
        return contactsList.includes(payload.id);
    };
}


/**
 * Returns data of all users.
 *
 * @param state                         Users Vuex state.
 * @param getters                       Users Vuex getters.
 * @param rootState                     Vuex root state.
 * @param rootGetters                   Vuex root getters.
 */
export function getAllUsers(
    state: UsersState,
    getters: keyof typeof UsersGetters,
    rootState: VuexRootState,
    rootGetters: RootGetters,
): UserPartial[] {
    const getRichUser = setRichUserSearch(rootGetters);
    return state.users.map(getRichUser);
}

/**
 * Returns data of a user by provided ID.
 *
 * @param state                         Users Vuex state.
 * @param getters                       Users Vuex getters.
 * @param rootState                     Vuex root state.
 * @param rootGetters                   Vuex root getters.
 */
export function getUserById(
    state: UsersState,
    getters: keyof typeof UsersGetters,
    rootState: VuexRootState,
    rootGetters: RootGetters,
): (payload: { id: string }) => User | null {
    const getRichUser = setRichUserSearch(rootGetters);

    return (payload: { id: string }) => {
        const user = state.users.find(user => user.id === payload.id) || null;
        if(!user) return user;
        return getRichUser(user);
    };
}

export function getUserByChatId(
    state: UsersState,
    getters: keyof typeof UsersGetters,
): (payload: { id: string }) => User | null {
    return (payload: { id: string }) => {
        return getters[GET_ALL_USERS].find(user => user.chatId === payload.id)
            || null;
    };
}

/**
 * Returns function that will find all available information about user (chat
 * related to it, information about whether user is in contacts list, blocked
 * or muted).
 *
 * @param rootGetters                   Vuex root getters.
 */
function setRichUserSearch(rootGetters) {
    const userModule = getter => `${UserModule.vuexName}/${getter}`;
    const chatsModule = getter => `${ChatsModule.vuexName}/${getter}`;

    const [
        contacts,
        blockedUsers,
        favoriteContacts,
        mutedUsers,
        getRawChatById,
        currentUserId,
    ]: [
        string[],
        string[],
        string[],
        Array<{id: string, mutedUntil: number | null}>,
        (payload: { id: string }) => ChatPartial | null,
        string,
    ] = [
        rootGetters[userModule(GET_USER_CONTACTS)],
        rootGetters[userModule(GET_BLOCKED_USERS)],
        rootGetters[userModule(GET_FAVORITE_CONTACTS)],
        rootGetters[userModule(GET_MUTED_USERS)],
        rootGetters[chatsModule(GET_RAW_CHAT_BY_ID)],
        rootGetters[userModule(GET_USER_DATA)].id,
    ];

    return (user) => {
        const isMuted = mutedUsers.find(({ id }) => user.id === id);

        const richUser = {
            ...user,
            chatId: user.type === 'group'
                ? user.id
                : `chid-${getChatId(currentUserId, user.id)}`,
            isBlocked: blockedUsers.includes(user.id),
            isContact: contacts.includes(user.id),
            isFavorite: favoriteContacts.includes(user.id),
            isMuted: !!isMuted,
            mutedUntil: isMuted ? isMuted.mutedUntil : null,
        };

        const chatData = getRawChatById({ id: richUser.chatId }) || null;
        return chatData
            ? { ...richUser, ...chatData, id: richUser.id }
            : richUser;
    };
}

const UsersGetters: GetterTree<UsersState, VuexRootState> = {
    getAllUsers,
    getRawUserById,
    getUserByChatId,
    getUserById,
    isContact,
};

export default UsersGetters;
