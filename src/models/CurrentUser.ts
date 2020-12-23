import { OwnEmail } from 'models/Mail';
import { UserCore } from 'models/User';

/**
 * Current app user.
 */
export interface CurrentUser extends UserCore {
    login: string;
    about: string;
    lastSeen: number;
    emails: OwnEmail[];
    hasPassword: boolean;
    blockedUsers: string[];
    chatId: string;
    mutedUsers: Array<{id: string, mutedUntil: number}>;
    favoriteContacts: string[];
    contacts: string[];
    isContact: boolean;
}
