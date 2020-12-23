import {
    ContactType,
} from 'models/Contact';
import { ProfileMediaItem } from 'models/ProfileMediaItem';
import { UserStatus } from 'models/UserStatus';

/**
 * Fields which exists in any user super type.
 */
export interface UserCore {
    ver: string;
    name: string | null;
    avatarPath: string | null;
    avatarId: string | null;
    id: string;
    num: string;
    status: UserStatus;
    gallery: ProfileMediaItem[];
}

export interface UserPartial extends UserCore {
    lastSeen: number;
    about: string;
    type: 'person' | 'group';
}

export interface User extends UserPartial {
    isBlocked: boolean;
    isMuted: boolean;
    mutedUntil: number | null;
    type: ContactType;
    chatId: string;
    isFavorite: boolean;
    isContact: boolean;
}

export enum Gender {
    male = 'male',
    female = 'female',
}
