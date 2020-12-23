import { User } from 'models/User';
import { Chat } from 'models/Chat';

import chats from 'localdata/chats';
import { users } from 'localdata/users';


/**
 * Mock up get user by id request.
 * TODO: Replace with server request.
 *
 * @param payload       ID of the user information of which should be found.
 */
export async function getUserById(payload: {
    id: string,
}): Promise<User | null> {
    let u = users.find(user => user.id === payload.id) || null;
    if (!u) return null;
    const c = chats.find(chat => chat.id === payload.id) || null;
    if(c) u = { ...u, ...c } as unknown as User;

    return await new Promise(resolve => setTimeout(
        () => resolve(u), 0),
    ).then(res => res as User);
}

/**
 * Adds newly created chat to list of local chats.
 * TODO: Remove this on adding server connection.
 *
 * @param payload       Chat information.
 */
export async function addGroupToLocal(payload: {
    chat: Chat,
}): Promise<void> {
    chats.push(payload.chat);
}
