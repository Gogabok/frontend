import { GetterTree } from 'vuex';

import { CurrentUser } from 'models/CurrentUser';

import ProfileState from 'store/modules/profile/state';
import RootState from 'store/root/state';


/**
 * Name of user profile getter.
 */
export const USER_PROFILE: string = 'userProfile';

/**
 * Returns user profile.
 */
export function userProfile(state: ProfileState): CurrentUser {
    return state.userProfile;
}

export default {
    userProfile,
} as GetterTree<ProfileState, RootState>;
