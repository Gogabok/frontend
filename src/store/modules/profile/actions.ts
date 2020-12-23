import { ActionContext, ActionTree } from 'vuex';

import UserAPI, { ProfileData } from 'api/User';

import ProfileState from 'store/modules/profile/state';
import RootState from 'store/root/state';

import * as mutations from 'store/modules/profile/mutations';


/**
 * Name of fetch user action.
 */
export const FETCH_USER_PROFILE: string = 'fetchUserProfile';

/**
 * Fetches user's profile information.
 *
 * @param store                         Profile Vuex store.
 * @param payload                       Action parameters.
 */
export function fetchUserProfile(
    store: ActionContext<ProfileState, RootState>,
    payload: { id: string, photosLimit: number },
): Promise<ProfileData> {
    const { id, photosLimit } = payload;
    return UserAPI.getProfileData(id, photosLimit).then((data: ProfileData) => {
        store.commit(mutations.SET_USER_PROFILE, data);
        return data;
    });
}

export default {
    fetchUserProfile,
} as ActionTree<ProfileState, RootState>;
