import { ActionContext, ActionTree } from 'vuex';

import {
    deleteChat as deleteChatRequest,
    fetchChats as fetchChatsRequest,
    getChatId,
} from 'utils/chatsRequests';

import { ChatPartial } from 'models/Chat';
import { Message } from 'models/Message';
import { User, UserPartial } from 'models/User';
import { UserStatusCode } from 'models/UserStatus';

import ChatsState from 'store/modules/chats/state';
import RootState from 'store/root/state';

import UserModule from 'store/modules/user';
import UsersModule from 'store/modules/users';

import {
    ADD_CHAT_MUTATION,
    ADD_MEMBERS_TO_CHAT_MUTATION,
    ADD_MESSAGE_TO_DIALOG,
    DELETE_ATTACHMENT_MUTATION,
    DELETE_CHAT_MUTATION,
    DELETE_MEMBER_FROM_CHAT_MUTATION,
    DELETE_MESSAGE_FROM_DIALOG,
    SET_CHAT_LEFT_STATE_MUTATION,
    SET_CHATS_MUTATION,
    SET_IS_FETCHED_MUTATION,
} from 'store/modules/chats/mutations';
import { GET_USER_DATA } from 'store/modules/user/getters';
import { ADD_USER } from 'store/modules/users/actions';
import { GET_ALL_USERS, GET_USER_BY_ID } from 'store/modules/users/getters';


/**
 * Name of delete attachment action.
 */
export const DELETE_ATTACHMENT: string = 'deleteAttachment';

/**
 * Name of fetch chats action.
 */
export const FETCH_CHATS: string = 'fetchChats';

/**
 * Name of delete chat action.
 */
export const DELETE_CHAT: string = 'deleteChat';

/**
 * Name of create group action.
 */
export const CREATE_GROUP: string = 'createGroup';

/**
 * Name of add members to chat action.
 */
export const ADD_MEMBERS_TO_CHAT: string = 'addMembersToChat';

/**
 * Name of delete member from chat action.
 */
export const DELETE_MEMBER_FROM_CHAT: string = 'deleteMemberFromChat';

/**
 * Name of change chat avatar action.
 */
export const CHANGE_CHAT_AVATAR: string = 'changeChatAvatar';

/**
 * Name of delete message action.
 */
export const DELETE_MESSAGE: string = 'deleteMessage';

/**
 * Name of send message action.
 */
export const SEND_MESSAGE: string = 'sendMessage';

/**
 * Name of leave chat action.
 */
export const LEAVE_CHAT: string = 'leaveChat';

/**
 * Name of return to chat function.
 */
export const RETURN_TO_CHAT: string = 'returnToChat';

/**
 * Name of kick user from chat action.
 */
export const KICK_USER_FROM_CHAT: string = 'kickUserFromChat';

/**
 * Name of send message to user action.
 */
export const SEND_MESSAGE_TO_USER: string = 'sendMessageToUser';

/**
 * Kicks user from chat.
 * @param store                         Chats Vuex store.
 * @param payload                       Action parameters.
 * @param payload.chatId                ID of the chat to kick user from.
 * @param payload.userId                ID of the user to be kicked.
 */
export async function kickUserFromChat(
    store: ActionContext<ChatsState, RootState>,
    payload: {
        chatId: string,
        userId: string,
    },
): Promise<void> {
    // TODO:    Put server request here to update chat state on kicked user's
    //          client and update chat's participants list on other
    //          participants' clients.
    store.commit(DELETE_MEMBER_FROM_CHAT_MUTATION, {
        payload: payload.chatId,
        userId: payload.userId,
    });
}

/**
 * Leaves chat.
 *
 * @param store                         Chats Vuex store.
 * @param payload                       Action parameters.
 * @param payload.chatId                ID of the chat to leave.
 */
export async function leaveChat(
    store: ActionContext<ChatsState, RootState>,
    payload: {
        chatId: string,
    },
): Promise<void> {
    // TODO:    Put server request here to notify other participants about
    //          leave.
    store.commit(
        SET_CHAT_LEFT_STATE_MUTATION,
        {
            chatId: payload.chatId,
            isLeft: true,
        },
    );
}

/**
 * Returns to chat.
 *
 * @param store                         Chats Vuex store.
 * @param payload                       Action parameters.
 * @param payload.chatId                ID of the chat to return to.
 */
export async function returnToChat(
    store: ActionContext<ChatsState, RootState>,
    payload: {
        chatId: string,
    },
): Promise<void> {
    // TODO:    Put server request here to fetch all missed data and notify
    //          other participants about returning.
    store.commit(
        SET_CHAT_LEFT_STATE_MUTATION,
        {
            chatId: payload.chatId,
            isLeft: false,
        },
    );
}

/**
 * Deletes member from the chat.
 *
 * @param store                         Chats Vuex store.
 * @param payload                       Action parameters.
 * @param payload.id                    ID of the chat to be removed.
 */
export async function deleteChat(
    store: ActionContext<ChatsState, RootState>,
    payload: { id: string },
): Promise<void> {
    await deleteChatRequest({ id: payload.id });
    store.commit(DELETE_CHAT_MUTATION, { id: payload.id });
}

/**
 * Deletes attachment from the message.
 *
 * @param store                         Message Vuex store.
 * @param payload                       Action parameters.
 * @param payload.id                    ID of attachment to be removed.
 * @param payload.targetId              ID of the chat to remove attachment in.
 */
export function deleteAttachment(
    store: ActionContext<ChatsState, RootState>,
    payload: {
        id: string,
        targetId: string,
    },
): void {
    store.commit(
        DELETE_ATTACHMENT_MUTATION,
        {
            chatId: payload.targetId,
            id: payload.id,
        },
    );
}

/**
 * Creates group, that consists of provided users.
 *
 * @param store                         Chats list Vuex store.
 * @param payload                       Action parameters.
 * @param payload.ids                   IDs of users to create group of.
 */
export async function createGroup(
    store: ActionContext<ChatsState, RootState>,
    payload: {
        ids: string[],
    },
): Promise<string> {
    const usersModule = getter => `${UsersModule.vuexName}/${getter}`;

    const usersList = store.rootGetters[usersModule(GET_ALL_USERS)];
    const usersIds = [...payload.ids];
    if(!usersIds.includes(store.rootState['user'].id)) {
        usersIds.push(store.rootState['user'].id);
    }
    const users = usersIds
        .map(id => usersList.find(contact => contact.id === id))
        .filter(Boolean) as User[];
    const id = new Date().getTime().toString();
    store.dispatch(
        usersModule(ADD_USER),
        {
            user: <UserPartial> {
                about: '',
                avatarId: null,
                avatarPath: null,
                gallery: [],
                id: 'chid-' + id,
                lastSeen: new Date().getTime(),
                name: users.map(user => user.num).join(','),
                num: 'group-' + id,
                status: {
                    code: UserStatusCode.Online,
                    description: null,
                    id: 'system-online',
                    title: '',
                },
                type: 'group',
                ver: '1',
            },
        },
        { root: true },
    );
    const chat: ChatPartial = {
        attachments: [],
        dialogs: [],
        id: 'chid-' + id,
        isKicked: false,
        isLeft: false,
        participants: [...payload.ids, store.rootState['user'].id],
        type: 'group',
        ver: '1',
    };

    store.commit(ADD_CHAT_MUTATION, { chat });
    return chat.id;
}

/**
 * Fetches chats from the server.
 *
 * @param store                         Chats Vuex store.
 */
export async function fetchChats(
    store: ActionContext<ChatsState, RootState>,
): Promise<void> {
    const userModule = getter => `${UserModule.vuexName}/${getter}`;
    const chats = await fetchChatsRequest(
        { id: store.rootGetters[userModule(GET_USER_DATA)].id },
    );

    store.commit(SET_CHATS_MUTATION, { chats });
    store.commit(SET_IS_FETCHED_MUTATION, { isFetched: true });
}

/**
 * Removes message from the provided chat.
 *
 * @param store                         Chats list Vuex store.
 * @param payload                       Action parameters.
 * @param payload.chatId                ID of the chat to remove message in.
 * @param payload.messageId             ID of the message to be removed.
 */
export function deleteMessage(
    store: ActionContext<ChatsState, RootState>,
    payload: {
        chatId: string,
        messageId: string,
    },
): void {
    store.commit(DELETE_MESSAGE_FROM_DIALOG, payload);
}

/**
 * Sends message to the provided chat.
 *
 * @param store                         Chats list Vuex store.
 * @param payload                       Action parameters.
 * @param payload.chatId                ID of the chat to send message to.
 * @param payload.message               Message to be sent.
 */
export function sendMessage(
    store: ActionContext<ChatsState, RootState>,
    payload: {
        chatId: string,
        message: Message,
    },
): void {
    store.commit(ADD_MESSAGE_TO_DIALOG, {
        chatId: payload.chatId,
        message: payload.message,
    });
}

/**
 * Sends message to user.
 *
 * @param store                         Chats Vuex store.
 * @param payload                       Action parameters.
 * @param payload.userId                ID of the user to send message to.
 * @param payload.message               Message to be sent.
 */
export function sendMessageToUser(
    store: ActionContext<ChatsState, RootState>,
    payload: {
        userId: string,
        message: Message,
    },
): void {
    const userModule = getter => `${UserModule.vuexName}/${getter}`;

    const userId = store.rootGetters[userModule(GET_USER_DATA)].id;
    let chat = store.state.chats.find(chat => chat.id === payload.userId);
    if (!chat) {
        const chatId =`chid-${getChatId(userId, payload.userId)}`;
        chat = store.state.chats.find(chat => chat.id === chatId);

        if(!chat) return;
    }

    store.commit(
        ADD_MESSAGE_TO_DIALOG,
        {
            chatId: chat.id,
            message: payload.message,
        },
    );
}

/**
 * Adds member to provided chat.
 *
 * @param store                         Chats Vuex store.
 * @param payload                       Action parameters.
 * @param payload.chatId                ID of the chat to add members to.
 * @param payload.ids                   IDs of the user to be added.
 */
export async function addMembersToChat(
    store: ActionContext<ChatsState, RootState>,
    payload: {
        chatId: string,
        ids: string[],
    },
): Promise<void> {
    const usersModule = getter => `${UsersModule.vuexName}/${getter}`;
    const users = payload.ids
        .map(
            id => store.rootGetters[usersModule(GET_USER_BY_ID)]({ id }),
        )
        .filter(Boolean);
    store.commit(ADD_MEMBERS_TO_CHAT_MUTATION, {
        chatId: payload.chatId,
        users,
    });
}

/**
 * Deletes member from provided chat.
 *
 * @param store                         Chats Vuex store.
 * @param payload                       Action parameters.
 * @param payload.chatId                ID of the chat to delete member from.
 * @param payload.userId                ID of the user to be removed.
 */
export async function deleteMemberFromChat(
    store: ActionContext<ChatsState, RootState>,
    payload: {
        chatId: string,
        userId: string,
    },
): Promise<void> {
    store.commit(DELETE_MEMBER_FROM_CHAT_MUTATION, {
        chatId: payload.chatId,
        userId: payload.userId,
    });
}

export default {
    addMembersToChat,
    createGroup,
    deleteAttachment,
    deleteChat,
    deleteMemberFromChat,
    deleteMessage,
    fetchChats,
    kickUserFromChat,
    leaveChat,
    returnToChat,
    sendMessage,
    sendMessageToUser,
} as ActionTree<ChatsState, RootState>;
