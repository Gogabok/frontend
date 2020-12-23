import { Chat, ChatPartial } from 'models/Chat';

import chats from 'localdata/chats';
import { users } from 'localdata/users';


export async function fetchChats({ id }: {id: string}): Promise<ChatPartial[]> {
    const ch = chats;
    const interlocutors = users.filter(u => u.type === 'person');

    for(let i = 0; i < interlocutors.length; i++) {
        const chatId = getChatId(interlocutors[i].id, id);
        if (interlocutors[i].id === id) {
            ch.push({
                attachments: [],
                dialogs: [],
                id: `chid-${chatId}`,
                isKicked: false,
                isLeft: false,
                participants: [id],
                type: 'person',
                ver: '1',
            });
            continue;
        }
        if(!ch.find(chat => chat.id === `chid-${chatId}`)) {
            ch.push({
                attachments: [],
                dialogs: [],
                id: `chid-${chatId}`,
                isKicked: false,
                isLeft: false,
                participants: [id, interlocutors[i].id],
                type: 'person',
                ver: '1',
            });
        }
    }
    return ch;
}

export function getChatId(id1: string, id2: string): string {
    return (getWeight(id1) + getWeight(id2)).toString().padStart(8, '0');
}

function getWeight(id: string): number {
    return id
        .split('')
        .reduce(
            (
                sum,
                letter,
                index,
            ) => sum + letter.charCodeAt(0) + index,
            0,
        );
}

export async function createChat(payload: {chat: Chat}): Promise<void> {
    await new Promise<{ok: boolean}>(r =>
        setTimeout(() => r({ ok: true }), 1000),
    );
    chats.push(payload.chat);
}

export async function getChatById(payload: {
    id: string,
}): Promise<ChatPartial | null> {
    const chat = chats.find(chat => chat.id === payload.id) || null;
    await new Promise<{ok: boolean}>(r =>
        setTimeout(() => r({ ok: true }), 1000),
    );
    return chat;
}

export async function deleteChat(payload: {
    id: string,
}): Promise<boolean> {
    const res = await new Promise<{ok: boolean, data: {id: string}}>(r =>
        setTimeout(() => r({ data: payload, ok: true }), 1000),
    );
    return res.ok;
}

export async function addChatProfileImage(): Promise<boolean> {
    const res = await new Promise<{ok: boolean}>(r =>
        setTimeout(() => r({ ok: true }), 1000),
    );
    return res.ok;
}
