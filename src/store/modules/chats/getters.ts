import { GetterTree } from 'vuex';

import { Chat, ChatPartial } from 'models/Chat';
import { User, UserPartial } from 'models/User';

import ChatsState from 'store/modules/chats/state';
import RootState from 'store/root/state';

import CallModule from 'store/modules/call';
import UserModule from 'store/modules/user';
import UsersModule from 'store/modules/users';

import { GET_LIVE_ROOMS_IDS } from 'store/modules/call/getters';
import {
    GET_BLOCKED_USERS,
    GET_FAVORITE_CONTACTS,
    GET_MUTED_USERS,
    GET_USER_CONTACTS, GET_USER_DATA,
} from 'store/modules/user/getters';
import { GET_RAW_USER_BY_ID } from 'store/modules/users/getters';


/**
 * Name of get all chats getter.
 */
export const GET_ALL_CHATS = 'getAllChats';

/**
 * Name of get chat by ID getter.
 */
export const GET_CHAT_BY_ID = 'getChatById';

export const GET_RAW_CHATS: string = 'getRawChats';

export const GET_RAW_CHAT_BY_ID: string = 'getRawChatById';

export function getRawChats(
    state: ChatsState,
): ChatPartial[] {
    return state.chats;
}

export function getRawChatById(
    state: ChatsState,
): (payload: {id: string}) => ChatPartial | null {
    return (payload) => state.chats.find(({ id }) => id === payload.id) || null;
}

/**
 * Gets all chats.
 *
 * @param state                         Chats Vuex state.
 * @param getters                       Chats Vuex getters.
 * @param rootState                     Vuex root state.
 * @param rootGetters                   Vuex root getters.
 */
export function getAllChats(
    state: ChatsState,
    getters: Array<() => unknown>,
    rootState: RootState,
    rootGetters: Array<() => unknown>,
): Chat[] {
    const getRichChat = setRichChatSearch(rootGetters);
    return state.chats.map(getRichChat);
}

function setRichChatSearch(rootGetters) {
    const userModule = getter => `${UserModule.vuexName}/${getter}`;
    const usersModule = getter => `${UsersModule.vuexName}/${getter}`;
    const callsModule = getter => `${CallModule.vuexName}/${getter}`;

    const [
        contacts,
        mutedUsers,
        blockedUsers,
        getRawUserById,
        currentUserId,
        favoriteUsers,
    ]: [
        string[],
        Array<{id: string, mutedUntil: number | null}>,
        string[],
        (payload: {id: string}) => UserPartial | null,
        string,
        string[],
    ] = [
        rootGetters[userModule(GET_USER_CONTACTS)],
        rootGetters[userModule(GET_MUTED_USERS)],
        rootGetters[userModule(GET_BLOCKED_USERS)],
        rootGetters[usersModule(GET_RAW_USER_BY_ID)],
        rootGetters[userModule(GET_USER_DATA)].id,
        rootGetters[userModule(GET_FAVORITE_CONTACTS)],
    ];

    return (chat) => {
        const isGroup = chat.type === 'group';

        const coreId = isGroup
            ? chat.id
            : chat.participants.length > 1
                ? chat.participants.find(p => p !== currentUserId)
                : chat.participants[0];
        const core = <User>getRawUserById({ id: coreId });

        const isFavorite = favoriteUsers.includes(chat.id);
        const isMuted = mutedUsers.find(({ id }) => chat.id === id);
        const name = coreId === currentUserId ? 'You' : core.name;
        return {
            ...core,
            ...chat,
            hasOngoingCall: rootGetters[
                callsModule(GET_LIVE_ROOMS_IDS)
            ].includes(chat.id),
            isBlocked: blockedUsers.includes(chat.id),
            isContact: contacts.includes(chat.id),
            isFavorite,
            isMuted: !!isMuted,
            mutedUntil: isMuted ? isMuted.mutedUntil : null,
            name,
        };
    };
}

/**
 * Gets chat by it's ID.
 *
 * @param state                         Chats Vuex state.
 * @param getters                       Chats Vuex getters.
 * @param rootState                     Vuex root state.
 * @param rootGetters                   Vuex root getters.
 */
export function getChatById(
    state: ChatsState,
    getters: Array<() => unknown>,
    rootState: RootState,
    rootGetters: Array<() => unknown>,
): (payload: {id: string}) => Chat | null {
    const getRichChat = setRichChatSearch(rootGetters);
    return (payload: {id: string}) => {
        const chat = state.chats.find(chat => chat.id === payload.id) || null;
        if(!chat) return chat;
        return getRichChat(chat);
    };
}

export default {
    getAllChats,
    getChatById,
    getRawChatById,
    getRawChats,
} as GetterTree<ChatsState, RootState>;
