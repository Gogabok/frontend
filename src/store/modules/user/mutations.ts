import { MutationTree } from 'vuex';

import { OwnEmail } from 'models/Mail';
import { ProfileMediaItem } from 'models/ProfileMediaItem';
import { User } from 'models/User';
import { UserStatus } from 'models/UserStatus';

import UserState from 'store/modules/user/state';


/**
 * Name of set user data mutation.
 */
export const SET_USER_DATA_MUTATION: string = 'setUserData';

/**
 * Name of add email mutation.
 */
export const ADD_EMAIL_MUTATION: string = 'addEmail';

/**
 * Name of set email publicity mutation.
 */
export const SET_EMAIL_PUBLICITY_MUTATION: string = 'setEmailPublicity';

/**
 * Name pf delete email mutation.
 */
export const DELETE_EMAIL_MUTATION: string = 'deleteEmail';

/**
 * name of change email status mutation.
 */
export const CHANGE_EMAIL_STATUS_MUTATION: string = 'changeEmailStatus';

/**
 * Name of upload profile media item mutation.
 */
export const UPLOAD_PROFILE_MEDIA_ITEM_MUTATION: string
    = 'uploadProfileMediaItem';

/**
 * Name of set `hasPassword` mutation.
 */
export const SET_HAS_PASSWORD_MUTATION: string = 'setHasPassword';

/**
 * Name of set contact mute state mutation.
 */
export const SET_CONTACT_MUTE_STATE_MUTATION: string = 'setContactMuteState';

/**
 * Name of set contact block state mutation.
 */
export const SET_CONTACT_BLOCK_STATE_MUTATION: string = 'setContactBlockState';

/**
 * Name of set user favorite state mutation.
 */
export const SET_USER_FAVORITE_STATE_MUTATION: string = 'setContactFavorite';

/**
 * Name of set user contacts state mutation.
 */
export const SET_USER_CONTACT_STATE_MUTATION: string = 'setContactState';

/**
 * Name of delete profile gallery item mutation.
 */
export const DELETE_PROFILE_GALLERY_ITEM_MUTATION: string = 'deleteGalleryFile';

/**
 * Name of add custom status mutation.
 */
export const ADD_CUSTOM_STATUS_MUTATION: string = 'addCustomStatus';

/**
 * Name of delete custom status mutation.
 */
export const DELETE_CUSTOM_STATUS_MUTATION: string = 'deleteCustomStatus';

/**
 * Adds custom status to user's list of statuses.
 *
 * @param state                         User Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.status                Status to be added.
 */
export function addCustomStatus(
    state: UserState,
    payload: {
        status: UserStatus,
    },
): void {
    state.statusesList.push(payload.status);
}

/**
 * Removes custom status from user's list of statuses.
 *
 * @param state                         User Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.statusId              ID of the status to be removed.
 */
export function deleteCustomStatus(
    state: UserState,
    payload: {
        statusId: string,
    },
): void {
    state.statusesList = state.statusesList.filter(
        status => status.id !== payload.statusId,
    );
}

/**
 * Adds/removes user from list of muted users.
 *
 * @param state                         User Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of the user to be muted/unmuted.
 * @param payload.isMuted               Indicator whether user is muted.
 * @param payload.mutedUntil            Timestamp which user is muted until.
 */
export function setContactMuteState(
    state: UserState,
    payload: {
        id: string,
        isMuted: boolean,
        mutedUntil: number | null,
    } = {
        id: '',
        isMuted: false,
        mutedUntil: null,
    },
): void {
    payload.isMuted
        ? state.mutedUsers.push({
            id: payload.id,
            mutedUntil: payload.mutedUntil as number,
        })
        : state.mutedUsers = state.mutedUsers.filter(
            user => user.id !== payload.id,
        );
}

/**
 * Adds/removes user from list of blocked users.
 *
 * @param state                         User Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of the user to be blocked/unblocked.
 * @param payload.isBlocked             Indicator whether user is blocked.
 */
export function setContactBlockState(
    state: UserState,
    payload: {
        id: string,
        isBlocked: boolean,
    },
): void {
    payload.isBlocked
        ? state.blockedUsers.push(payload.id)
        : state.blockedUsers = state.blockedUsers.filter(
            id => id !== payload.id,
        );
}

/**
 * Sets `hasPassword` indicator state.
 *
 * @param state                         User Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.hasPassword           Indicator whether user has password.
 */
export function setHasPassword(
    state: UserState,
    payload: { hasPassword: boolean },
): void {
    state.hasPassword = payload.hasPassword;
}

/**
 * Adds profile media item to user's profile gallery.
 *
 * @param state                         User Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.item                  Profile media item to be added.
 */
export function uploadProfileMediaItem(
    state: UserState,
    payload: { item: ProfileMediaItem },
): void {
    state.gallery.unshift(payload.item);
}

/**
 * Sets user account information.
 *
 * @param state                         User Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.data                  Fields to be set {Record<name, value>}.
 */
export function setUserData(
    state: UserState,
    payload: { data: User },
): void {
    Object.entries(payload.data).forEach(
        ([key, value]) => state[key]  = value,
    );
}

/**
 * Adds email to list of user's emails.
 *
 * @param state                         User Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.email                 Email to be added.
 */
export function addEmail(
    state: UserState,
    payload: { email: OwnEmail },
): void {
    state.emails.push(payload.email);
}

/**
 * Sets email publicity.
 *
 * @param state                         User Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.email                 Email to be modified.
 * @param payload.isPublic              Indicator whether email is public.
 */
export function setEmailPublicity(
    state: UserState,
    payload: {
        email: OwnEmail,
        isPublic: boolean,
    },
): void {
    const email = state.emails.find(
        email => email.value === payload.email.value,
    );

    if(!email) return;
    email.isPublic = payload.isPublic;
}

/**
 * Deletes email from user's emails list.
 *
 * @param state                         User Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.email                 Email to be deleted.
 */
export function deleteEmail(
    state: UserState,
    payload: { email: OwnEmail },
): void {
    state.emails = state.emails.filter(
        email => email.value !== payload.email.value,
    );
}

/**
 * Changes email verification status.
 *
 * @param state                         User Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.email                 Email to be modified.
 * @param payload.isVerified             Indicator whether email is verified.
 */
export function changeEmailStatus(
    state: UserState,
    payload: {
        email: OwnEmail,
        isVerified: boolean,
    },
): void {
    const email = state.emails.find(
        email => email.value === payload.email.value,
    );
    if(!email) return;
    email.isVerified = payload.isVerified;
}

/**
 * Adds/removes user from client's favorite state.
 *
 * @param state                         User Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of the user to be added/removed from
 *                                      favorites.
 * @param payload.isFavorite            Indicator whether user should be in a
 *                                      favorites list.
 * @param payload.to                    Index at which to place the element.
 */
export function setContactFavorite(
    state: UserState,
    payload: {
        id: string,
        isFavorite: boolean,
        to: number,
    },
): void {
    const isFavorite = state.favoriteContacts.includes(payload.id);

    if (isFavorite && payload.to !== undefined) {

        state.favoriteContacts.splice(
            state.favoriteContacts.findIndex(userId => userId === payload.id),
            1,
        );

        state.favoriteContacts.splice(payload.to, 0, payload.id);
    } else {
        payload.isFavorite
            ? state.favoriteContacts.splice(payload.to, 0, payload.id)
            : state.favoriteContacts = state.favoriteContacts.filter(
                    userId => userId !== payload.id,
                );
    }
}

/**
 * Adds/removes user from client's contacts list.
 *
 * @param state                         User Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of the user to be added/removed from
 *                                      contacts.
 * @param payload.isContact             Indicator whether user should be in a
 *                                      contacts list.
 */
export function setContactState(
    state: UserState,
    payload: {
        id: string,
        isContact: boolean,
    },
): void {
    const isContact = state.contacts.includes(payload.id);

    if(isContact === payload.isContact) return;

    payload.isContact
        ? state.contacts = [...state.contacts, payload.id]
        : state.contacts
            = state.contacts.filter(contactId => contactId !== payload.id);
}

/**
 * Deletes profile gallery media item.
 *
 * @param state                         User Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of the item to be deleted.
 */
export function deleteGalleryFile(
    state: UserState,
    payload: {
        id: string,
    },
): void {
    state.gallery = state.gallery.filter(item => item.id !== payload.id);
}

export default {
    addCustomStatus,
    addEmail,
    changeEmailStatus,
    deleteCustomStatus,
    deleteEmail,
    deleteGalleryFile,
    setContactBlockState,
    setContactFavorite,
    setContactMuteState,
    setContactState,
    setEmailPublicity,
    setHasPassword,
    setUserData,
    uploadProfileMediaItem,
} as MutationTree<UserState>;
