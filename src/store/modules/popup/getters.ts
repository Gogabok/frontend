import { GetterTree } from 'vuex';

import { IPopup } from 'models/PopupSettings';

import RootState from 'store/root/state';
import PopupState from 'store/modules/popup/state';


/**
 * Name of popup visibility getter.
 */
export const GET_POPUPS: string = 'getPopups';

/**
 * Returns list of popups.
 *
 * @param state                         Popup Vuex state.
 */
export function getPopups(
    state: PopupState,
): IPopup[] {
    return state.popups;
}

export default {
    getPopups,
} as GetterTree<PopupState, RootState>;
