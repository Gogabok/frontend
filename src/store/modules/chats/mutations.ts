import { MutationTree } from 'vuex';

import { ChatPartial } from 'models/Chat';
import { Message } from 'models/Message';
import { User } from 'models/User';

import ChatsState from 'store/modules/chats/state';


/**
 * Adds message to dialog.
 */
export const ADD_MESSAGE_TO_DIALOG: string = 'addMessageToDialog';

/**
 * Removes message from the dialog.
 */
export const DELETE_MESSAGE_FROM_DIALOG: string = 'deleteMessage';

/**
 * Updates the user client is chatting with.
 */
export const UPDATE_ACTIVE_DIALOG_CONTACT_ID: string =
    'updateActiveDialogContactId';

/**
 * Name of delete attachment mutation.
 */
export const DELETE_ATTACHMENT_MUTATION: string = 'deleteAttachment';

/**
 * Name of add chat mutation.
 */
export const ADD_CHAT_MUTATION: string = 'addChat';

/**
 * Name of set chats mutation.
 */
export const SET_CHATS_MUTATION: string = 'setChats';

/**
 * Name of set `isFetched` mutations.
 */
export const SET_IS_FETCHED_MUTATION: string = 'setIsFetched';

/**
 * Name of delete chat mutation.
 */
export const DELETE_CHAT_MUTATION: string = 'deleteChat';

/**
 * Name of add members to chat mutation.
 */
export const ADD_MEMBERS_TO_CHAT_MUTATION = 'addMembersToChat';

/**
 * Name of delete member from chat mutation.
 */
export const DELETE_MEMBER_FROM_CHAT_MUTATION = 'deleteMemberFromChat';

/**
 * Name of set chat left state mutation.
 */
export const SET_CHAT_LEFT_STATE_MUTATION: string = 'setChatLeftState';

/**
 * Name of set chat kicked state mutation.
 */
export const SET_CHAT_KICKED_STATE_MUTATION: string = 'setChatKickedState';

/**
 * Sets chat `isKicked` state.
 *
 * @param state                         Chats Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.chatId                ID of the chat user has been kicked
 *                                      or returned to.
 * @param payload.isKicked              Indicator whether user is kicked from
 *                                      the chat.
 */
export function setChatKickedState(
    state: ChatsState,
    payload: {
        chatId: string,
        isKicked: boolean,
    },
): void {
    const chat = state.chats.find(chat => chat.id === payload.chatId);
    if(!chat) return;

    chat.isKicked = payload.isKicked;
}

/**
 * Sets chat `isLeft` state.
 *
 * @param state                         Chats Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.chatId                ID of the chat user left or returned to.
 * @param payload.isLeft                Indicator whether user left chat.
 */
export function setChatLeftState(
    state: ChatsState,
    payload: {
        chatId: string,
        isLeft: boolean,
    },
): void {
    const chat = state.chats.find(chat => chat.id === payload.chatId);
    if(!chat) return;
    chat.isLeft = payload.isLeft;
}

/**
 * Adds members to chat.
 *
 * @param state                         Chats Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.chatId                ID of the chat to be modified.
 * @param payload.users                 Users to be added to chat
 */
export function addMembersToChat(
    state: ChatsState,
    payload: {
        chatId: string,
        users: User[],
    },
): void {
    const chat = state.chats.find(chat => chat.id === payload.chatId);
    if(!chat) return;
    chat.participants = Array.from(new Set([
        ...chat.participants,
        ...payload.users.map(user => user.id),
    ]));
}

/**
 * Deletes member from the chat.
 *
 * @param state                         Chats Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.chatId                ID of the chat to be modified.
 * @param payload.userId                ID of the user to be removed.
 */
export function deleteMemberFromChat(
    state: ChatsState,
    payload: {
        chatId: string,
        userId: string,
    },
): void {
    const chat = state.chats.find(chat => chat.id === payload.chatId);

    if(!chat) return;

    chat.participants =
        (<string[]>chat.participants).filter(
            user => user !== payload.userId,
        );
}


/**
 * Sets user's chats list.
 *
 * @param state                         Chats Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.chats                 Chats of the user.
 */
export function setChats(
    state: ChatsState,
    payload: {chats: ChatPartial[]},
): void {
    state.chats = payload.chats;
}

/**
 * Deletes chat history of the user and removes it from chats list.
 *
 * @param state                         Chats Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of the chat to be removed.
 */
export function deleteChat(
    state: ChatsState,
    payload: {id: string},
): void {
    state.chats = state.chats.filter(chat => chat.id !== payload.id);
}

/**
 * Sets `isFetched` state.
 *
 * @param state                         Chats Vuex state.
 * @param payload                       Mutation parameters
 * @param payload.isFetched             Indicator whether chats were fetched
 *                                      from the server.
 */
export function setIsFetched(
    state: ChatsState,
    payload: {isFetched: boolean},
): void {
    state.isFetched = payload.isFetched;
}

/**
 * Deletes attachment from the message.
 *
 * @param state                         Chats Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of the attachment to be deleted.
 * @param payload.chat                  ID of the chat to remove attachment id.
 */
export function deleteAttachment(
    state: ChatsState,
    payload: {
        id: string,
        chatId: string,
    },
): void {
    let [chatIndex, dialogIndex, messageIndex, mediaGroupIndex] =
        [-1, -1, -1, -1];

    const findAttachmentInMediaGroup = ({ mediaGroup :group }) =>
        group ?
            group.findIndex(attachment => attachment.id === payload.id)
            : undefined;

    const findAttachment = (message): boolean =>
        (message.attachment && message.attachment.id === payload.id);

    function setIndexes(
        ui: number,
        di: number,
        mi: number,
        mgi?: number,
    ): void {
        chatIndex = ui;
        dialogIndex = di;
        messageIndex = mi;
        if(mgi) mediaGroupIndex = mgi;
    }

    contactLoop:
    for(
        const [cIndex,chat] of Object.entries(state.chats)
        ) {
        const dialogs = chat.dialogs;
        for(const [dIndex, dialog] of Object.entries(dialogs)) {
            for(const  [mIndex, message] of Object.entries(dialog.messages)) {
                if(findAttachment(message)) {
                    const indexes =
                        [cIndex, dIndex, mIndex].map(i => parseInt(i));
                    setIndexes(indexes[0], indexes[1], indexes[2]);
                    break contactLoop;
                } else {
                    const index =
                        findAttachmentInMediaGroup(message as Message);
                    if(index !== -1 && index !==undefined) {
                        const indexes =
                            [cIndex, dIndex, mIndex, index]
                                .map(i => parseInt(i));
                        setIndexes(
                            indexes[0],
                            indexes[1],
                            indexes[2],
                            indexes[3],
                        );
                        break contactLoop;
                    }
                }
            }
        }
    }

    const message = state
        .chats[chatIndex]
        .dialogs[dialogIndex]
        .messages[messageIndex];

    if(mediaGroupIndex !== -1) {
        if(message.mediaGroup === null) return;
        message.mediaGroup = (message.mediaGroup)
            .filter((_, index) => index !== mediaGroupIndex);
    } else {
        message.attachment = null;
    }

    const chat = state.chats[chatIndex];
    if(!chat) return;
    chat.attachments =
        chat.attachments.filter(attachment => attachment.id !== payload.id);
}

/**
 * Adds chat to user's chats list.
 *
 * @param state                         Chats Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.chat                  Chat to be added to chats list.
 */
export function addChat(
    state: ChatsState,
    payload: { chat: ChatPartial },
): void {
    state.chats.push(payload.chat);
}

/**
 * Adds message to the dialog.
 *
 * @param state                         Chats vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of the chat to be modified.
 * @param payload.message               Message to be added to the dialog.
 */
export function addMessageToDialog(
    state: ChatsState,
    payload: {
        chatId: string,
        message: Message,
    },
): void {
    const chat = state.chats.find(({ id }) => id === payload.chatId);
    if(chat) {
        const lastDialog = chat.dialogs[chat.dialogs.length - 1];
        if( lastDialog
            && new Date(lastDialog.date).getDay() === new Date().getDay()) {
            lastDialog.messages.push(payload.message);
        } else {
            chat.dialogs.push({
                date: new Date().getTime(),
                messages: [payload.message],
            });
        }
        if( payload.message.attachment
            && payload.message.attachment.type !== 'audio'
        ) {
            chat.attachments.push(payload.message.attachment);
        } else if (payload.message.mediaGroup) {
            chat.attachments = [
                ...chat.attachments,
                ...payload.message.mediaGroup,
            ];
        }
    }
    state.chats = recreateChats(state.chats, payload.chatId);
}

function recreateChats(chats: ChatPartial[], id: string): ChatPartial[] {
    const chat = chats.find(chat => chat.id === id) as ChatPartial;
    return [chat, ...chats.filter(chat => chat.id !== id)];
}

/**
 * Removes message from the dialog.
 *
 * @param state                         Chats vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.chatId                ID of the chat to remove message in.
 * @param payload.messageId             ID of the message to be removed.
 */
export function deleteMessage(
    state: ChatsState,
    payload: {
        chatId: string,
        messageId: string,
    },
): void {
    const chat = state.chats.find(({ id }) => {
        return id === payload.chatId;
    });
    if(chat) {
        const dialog = chat.dialogs
            .find(({ messages }) => {
                return messages.find(
                    ({ id }) => id === payload.messageId,
                ) !== undefined;
            });

        if(dialog) {
            dialog.messages =
                dialog.messages.filter(({ id }) => id !== payload.messageId);
            if(dialog.messages.length === 0) {
                chat.dialogs = chat.dialogs.filter(d => d.date !== dialog.date);
            }
        }
    }
}

export default {
    addChat,
    addMembersToChat,
    addMessageToDialog,
    deleteAttachment,
    deleteChat,
    deleteMemberFromChat,
    deleteMessage,
    setChatKickedState,
    setChatLeftState,
    setChats,
    setIsFetched,
} as MutationTree<ChatsState>;
