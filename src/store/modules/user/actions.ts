import { ActionContext, ActionTree } from 'vuex';

import {
    addEmail as addEmailRequest,
    blockUser as blockUserRequest,
    changeAbout as changeAboutRequest,
    changeAvatar as changeAvatarRequest,
    changeEmailPublicity as changeEmailPublicityRequest,
    changeLogin as changeLoginRequest,
    changeName as changeNameRequest,
    deleteEmail as deleteEmailRequest,
    setPassword as setPasswordRequest,
} from 'utils/profileRequests';

import { OwnEmail } from 'models/Mail';
import { ProfileMediaItem } from 'models/ProfileMediaItem';
import { User } from 'models/User';
import { UserStatus } from 'models/UserStatus';

import UserState from 'store/modules/user/state';
import RootState from 'store/root/state';

import TEST_USER from 'localdata/user';
import { users } from 'localdata/users';

import {
    ADD_CUSTOM_STATUS_MUTATION,
    ADD_EMAIL_MUTATION,
    CHANGE_EMAIL_STATUS_MUTATION,
    DELETE_CUSTOM_STATUS_MUTATION,
    DELETE_EMAIL_MUTATION,
    DELETE_PROFILE_GALLERY_ITEM_MUTATION,
    SET_CONTACT_BLOCK_STATE_MUTATION,
    SET_CONTACT_MUTE_STATE_MUTATION,
    SET_EMAIL_PUBLICITY_MUTATION,
    SET_HAS_PASSWORD_MUTATION,
    SET_USER_CONTACT_STATE_MUTATION,
    SET_USER_DATA_MUTATION,
    SET_USER_FAVORITE_STATE_MUTATION,
    UPLOAD_PROFILE_MEDIA_ITEM_MUTATION,
} from 'store/modules/user/mutations';


/**
 * Name of set email verified action.
 */
export const SET_EMAIL_VERIFIED: string = 'setEmailVerified';

/**
 * Name of delete email action.
 */
export const DELETE_EMAIL: string = 'deleteEmail';

/**
 * Name of add email action.
 */
export const ADD_EMAIL: string = 'addEmail';

/**
 * Name of change email publicity action.
 */
export const CHANGE_EMAIL_PUBLICITY: string = 'changeEmailPublicity';

/**
 * Name of fetch user data action.
 */
export const FETCH_USER_DATA: string = 'fetchUserData';

/**
 * Name of set password action.
 */
export const SET_PASSWORD: string = 'setPassword';

/**
 * Name of upload profile item action.
 */
export const UPLOAD_PROFILE_MEDIA_ITEM: string = 'uploadProfileMediaItem';

/**
 * Name of change avatar action.
 */
export const CHANGE_AVATAR: string = 'changeAvatar';

/**
 * Name of change name action.
 */
export const CHANGE_NAME: string = 'changeName';

/**
 * Name of change status action.
 */
export const CHANGE_STATUS = 'changeStatus';

/**
 * Name of change about action.
 */
export const CHANGE_ABOUT: string = 'changeAbout';

/**
 * Name of change login action.
 */
export const CHANGE_LOGIN: string = 'changeLogin';

/**
 * Name of mute user action.
 */
export const MUTE_USER: string = 'muteUser';

/**
 * Name of unmute user action.
 */
export const UNMUTE_USER: string = 'unmuteUser';

/**
 * Name of change user block state action.
 */
export const CHANGE_USER_BLOCK_STATE: string = 'changeUserBlockState';

/**
 * Name of change user data action.
 */
export const CHANGE_USER_DATA: string = 'changeUserData';

/**
 * Name of set user favorite state action.
 */
export const SET_USER_FAVORITE_STATE: string = 'setUserFavoriteState';

/**
 * Name of set user contact state action.
 */
export const SET_USER_CONTACT_STATE: string = 'setUserContactState';

/**
 * Name of delete profile gallery item action.
 */
export const DELETE_PROFILE_GALLERY_ITEM: string = 'deleteGalleryFile';

/**
 * Name of add custom status action.
 */
export const ADD_CUSTOM_STATUS: string = 'addCustomStatus';

/**
 * Name of delete custom status action.
 */
export const DELETE_CUSTOM_STATUS: string = 'deleteCustomStatus';

/**
 * Creates custom status and adds it to user's list of statuses.
 *
 * @param store                         User Vuex store.
 * @param payload                       Action parameters.
 * @param payload.status                Status to be added.
 */
export function addCustomStatus(
    store: ActionContext<UserState, RootState>,
    payload: {
        status: UserStatus,
    },
): UserStatus {
    // TODO: Put server request there.
    const status = {
        ...payload.status,
        id: 'status-' + new Date().getTime().toString(),
    };

    store.commit(ADD_CUSTOM_STATUS_MUTATION, { status });
    return status;
}

/**
 * Deletes custom status from user's list of statuses.
 *
 * @param store                         User Vuex store.
 * @param payload                       Action parameters.
 */
export function deleteCustomStatus(
    store: ActionContext<UserState, RootState>,
    payload: {
        statusId: string,
    },
): void {
    store.dispatch(CHANGE_STATUS, { statusId: store.state.statusesList[0].id });
    store.commit(DELETE_CUSTOM_STATUS_MUTATION, { statusId: payload.statusId });
}

/**
 * Adds new media item to user's profile gallery.
 *
 * @param store                         User Vuex store.
 * @param payload                       Action parameters.
 * @param payload.item                  New profile gallery media item.
 */
export function uploadProfileMediaItem(
    store: ActionContext<UserState, RootState>,
    payload: { item: ProfileMediaItem },
): void {
    store.commit(UPLOAD_PROFILE_MEDIA_ITEM_MUTATION, { item: payload.item });
}

/**
 * Fetches user data from the server.
 *
 * @param store                         User Vuex store.
 */
export async function fetchUserData(
    store: ActionContext<UserState, RootState>,
): Promise<void> {
    // TEMPORARY REPLACEMENT OF AUTHENTICATION FOR CALLS
    const options = [
        'andrey',
        'kirill',
        'alexey',
        'roman',
    ];

    let option = localStorage.getItem('user');
    if(!option) {
        try {
            option = prompt(`Choose user:\n${options.join(', ')}`) || 'andrey';
        } catch(e) {
            option = options[0];
        }
        localStorage.setItem('user', option);
    }

    const protoUser = users.find(
        user => user.id.includes(<string>option),
    ) || users[0];
    const res = await new Promise(
        r => setTimeout(() => r({
                ...TEST_USER,
                ...protoUser,
                contacts: TEST_USER.contacts.filter(
                    user => user !== protoUser.id,
                ),
            }),
            0,
        ),
    );

    store.commit(SET_USER_DATA_MUTATION, { data: res });
}

/**
 * Links email to user's profile.
 *
 * @param store                         User Vuex store.
 * @param payload                       Action parameters.
 * @param payload.email                 Email to be linked to profile.
 */
export async function addEmail(
    store: ActionContext<UserState, RootState>,
    payload: { email: string },
): Promise<void> {
    // TODO: Put server request there.
    await addEmailRequest({
        email: payload.email,
        id: store.state.id,
    });
    store.commit(ADD_EMAIL_MUTATION, {
        email: {
            isPublic: true,
            isVerified: false,
            value: payload.email,
        },
    });
}

/**
 * Changes email publicity.
 *
 * @param store                         User Vuex store.
 * @param payload                       Action parameters.
 * @param payload.email                 Email to be modified.
 * @param payload.isPublic              Indicator whether email is public.
 */
export async function changeEmailPublicity(
    store: ActionContext<UserState, RootState>,
    payload: {
        email: OwnEmail,
        isPublic: boolean,
    },
): Promise<void> {
    await changeEmailPublicityRequest({
        email: payload.email.value,
        isPublic: payload.isPublic,
    });

    store.commit(
        SET_EMAIL_PUBLICITY_MUTATION,
        {
            email: payload.email,
            isPublic: payload.isPublic,
        },
    );
}

/**
 * Sets email verified.
 *
 * @param store                         User Vuex module.
 * @param payload                       Action parameters.
 * @param payload.email                 Email to be set verified.
 */
export async function setEmailVerified(
    store: ActionContext<UserState, RootState>,
    payload: { email: OwnEmail },
): Promise<void> {
    // TODO: Put server request there.
    store.commit(CHANGE_EMAIL_STATUS_MUTATION, {
        email: payload.email,
        isVerified: true,
    });
}

/**
 * Deletes email from user's profile.
 *
 * @param store                         User Vuex store.
 * @param payload                       Action parameters.
 * @param payload.email                 Email to be deleted.
 */
export async function deleteEmail(
    store: ActionContext<UserState, RootState>,
    payload: { email: OwnEmail },
): Promise<void> {
    if(!store.state.emails) return;
    await deleteEmailRequest({
        email: payload.email.value,
    });
    store.commit(DELETE_EMAIL_MUTATION, { email: payload.email });
}

/**
 * Changes user's name.
 *
 * @param store                         User Vuex store.
 * @param payload                       Action parameters.
 * @param payload.name                  New name of the user.
 */
export async function changeName(
    store: ActionContext<UserState, RootState>,
    payload: { name: string },
): Promise<void> {
    await changeNameRequest({
        id: store.state.id,
        name: payload.name,
    });
    store.commit(SET_USER_DATA_MUTATION, { data: { name: payload.name } });
}

/**
 * Changes user's status.
 *
 * @param store                         User Vuex store.
 * @param payload                       Action parameters.
 * @param payload.status                Status to be set.
 */
export async function changeStatus(
    store: ActionContext<UserState, RootState>,
    payload: { statusId: string },
): Promise<void> {
    // TODO: Put server request there.
    // await changeStatusRequest({
    //     id: store.state.id,
    //     status: payload.status,
    // });
    store.commit(
        SET_USER_DATA_MUTATION,
        { data: { statusId: payload.statusId } },
    );
}

/**
 * Changes provided fields in the state.
 *
 * @param store                         User Vuex store.
 * @param payload                       Action parameters.
 * @param payload.data                  Record of fields to be updated.
 */
export async function changeUserData(
    store: ActionContext<UserState, RootState>,
    payload: { data: User },
): Promise<void> {
    Object.entries(payload.data).forEach(([parameter, value]) => {
        store.commit(SET_USER_DATA_MUTATION, {
            data: { [parameter]: value },
        });
    });
}

/**
 * Changes user's avatar.
 *
 * @param store                         User Vuex store.
 * @param payload                       Action parameters.
 * @param payload.avatarPath            Avatar to be set.
 * @param payload.imageId               ID of the image to be set as avatar.
 */
export async function changeAvatar(
    store: ActionContext<UserState, RootState>,
    payload: {
        avatarPath: string,
        imageId: string,
    },
): Promise<void> {
    // TODO: Put server request there.
    await changeAvatarRequest({
        id: store.state.id,
        imageData: payload.avatarPath,
    });
    store.commit(SET_USER_DATA_MUTATION, {
        data: {
            avatarId: payload.imageId,
            avatarPath: payload.avatarPath,
        },
    });
}

/**
 * Changes user's about information.
 *
 * @param store                         User Vuex store.
 * @param payload                       Action parameters.
 * @param payload.about                 About information to be set.
 */
export async function changeAbout(
    store: ActionContext<UserState, RootState>,
    payload: { about: string },
): Promise<void> {
    // TODO: Put server request there.
    await changeAboutRequest({
        about: payload.about,
        id: store.state.id,
    });
    store.commit(SET_USER_DATA_MUTATION, { data: { about: payload.about } });
}

/**
 * Changes user's login.
 *
 * @param store                         User Vuex store.
 * @param payload                       Action parameters.
 * @param payload.login                 Login to be set.
 */
export async function changeLogin(
    store: ActionContext<UserState, RootState>,
    payload: { login: string },
): Promise<void> {
    // TODO: Put server request there.
    await changeLoginRequest({
        id: store.state.id,
        login: payload.login,
    });
    store.commit(SET_USER_DATA_MUTATION, { data: { login: payload.login } });
}

/**
 * Changes user's password.
 *
 * @param store                         User Vuex store.
 * @param payload                       Action parameters.
 * @param payload.password              Password to be set.
 */
export async function setPassword(
    store: ActionContext<UserState, RootState>,
    payload: { password: string },
): Promise<void> {
    await setPasswordRequest({
        id: store.state.id,
        password: payload.password,
    });
    store.commit(SET_HAS_PASSWORD_MUTATION, { hasPassword: true });
}

/**
 * Mutes user.
 *
 * @param store                         User Vuex store.
 * @param payload                       Action parameters.
 * @param payload.id                    ID of the user to be muted.
 * @param payload.duration              Mute duration in milliseconds.
 */
export async function muteUser(
    store: ActionContext<UserState, RootState>,
    payload: {
        id: string,
        duration: number,
    },
): Promise<number> {
    const mutedUntil = new Date().getTime() + payload.duration;
    store.commit(SET_CONTACT_MUTE_STATE_MUTATION, {
        id: payload.id,
        isMuted: true,
        mutedUntil,
    });

    return mutedUntil;
}

/**
 * Blocks/unblock user.
 *
 * @param store                         User Vuex store.
 * @param payload                       Action parameters.
 * @param payload.id                    ID of the user to be blocked/unblocked.
 * @param payload.isBlocked             Indicator whether user id blocked.
 */
export async function changeUserBlockState(
    store: ActionContext<UserState, RootState>,
    payload: {
        id: string,
        isBlocked: boolean,
    },
): Promise<void> {
    await blockUserRequest({
        id: store.state.id,
        isBlocked: payload.isBlocked,
        targetId: payload.id,
    });

    store.commit(SET_CONTACT_BLOCK_STATE_MUTATION, {
        id: payload.id,
        isBlocked: payload.isBlocked,
    });
}

/**
 * Unmutes user.
 *
 * @param store                         User Vuex Store.
 * @param payload                       Action parameters.
 * @param payload.id                    ID of the user to be unmuted.
 */
export async function unmuteUser(
    store: ActionContext<UserState, RootState>,
    payload: {
        id: string,
    },
): Promise<void> {
    store.commit(SET_CONTACT_MUTE_STATE_MUTATION, {
        id: payload.id,
        isMuted: false,
        mutedUntil: null,
    });
}

/**
 * Adds/removes user from client's contacts list.
 *
 * @param store                         User Vuex store.
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of the user to be added/removed from
 *                                      contacts.
 * @param payload.isContact             Indicator whether user should be in a
 *                                      contacts list.
 */
export async function setUserContactState(
    store: ActionContext<UserState, RootState>,
    payload: {
        id: string,
        isContact: boolean,
    },
): Promise<void> {
    store.commit(SET_USER_CONTACT_STATE_MUTATION, {
        id: payload.id,
        isContact: payload.isContact,
    });
}

/**
 * Adds/removes user from client's favorite state.
 *
 * @param store                         User Vuex store.
 * @param payload                       Mutation parameters.
 * @param payload.id                    ID of the user to be added/removed from
 *                                      favorites.
 * @param payload.isFavorite            Indicator whether user should be in a
 *                                      favorites list.
 */
export async function setUserFavoriteState(
    store: ActionContext<UserState, RootState>,
    payload: {
        id: string,
        isFavorite: boolean,
        to: number,
    },
): Promise<void> {
    store.commit(SET_USER_FAVORITE_STATE_MUTATION, {
        id: payload.id,
        isFavorite: payload.isFavorite,
        to: payload.to,
    });
}

/**
 * Deletes profile gallery item.
 *
 * @param store                         User Vuex store.
 * @param payload                       Action parameters.
 * @param payload.id                    ID of the item to be deleted.
 */
export async function deleteGalleryFile(
    store: ActionContext<UserState, RootState>,
    payload: {
        id: string,
    },
): Promise<void> {
    store.commit(DELETE_PROFILE_GALLERY_ITEM_MUTATION, { id: payload.id });
    const profileItem =
        store.state.gallery.find(item => item.id === payload.id);
    if(profileItem && store.state.avatarPath === profileItem.id) {
        store.commit(CHANGE_AVATAR, { avatar: '' });
    }
}


export default {
    addCustomStatus,
    addEmail,
    changeAbout,
    changeAvatar,
    changeEmailPublicity,
    changeLogin,
    changeName,
    changeStatus,
    changeUserBlockState,
    changeUserData,
    deleteCustomStatus,
    deleteEmail,
    deleteGalleryFile,
    fetchUserData,
    muteUser,
    setEmailVerified,
    setPassword,
    setUserContactState,
    setUserFavoriteState,
    unmuteUser,
    uploadProfileMediaItem,
} as ActionTree<UserState, RootState>;
