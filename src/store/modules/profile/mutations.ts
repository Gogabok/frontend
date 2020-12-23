import { MutationTree } from 'vuex';

import ProfileState from 'store/modules/profile/state';


/**
 * Name of set user profile mutation.
 */
export const SET_USER_PROFILE: string = 'setUserProfile';

/**
 * Sets user profile.
 */
export function setUserProfile(
    state: ProfileState,
    profile: any, // eslint-disable-line
): void {
    state.userProfile = profile;
}

export default {
    setUserProfile,
} as MutationTree<ProfileState>;
