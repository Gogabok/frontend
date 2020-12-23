import { MutationTree } from 'vuex';

import { IPopup } from 'models/PopupSettings';

import PopupState from 'store/modules/popup/state';

/**
 * Name of add popup mutation.
 */
export const ADD_POPUP_MUTATION: string = 'addPopup';

/**
 * Name of remove popup mutation.
 */
export const REMOVE_POPUP_MUTATION: string = 'removePopup';

/**
 * Adds popup to popups array.
 *
 * @param state                         Vuex popup state.
 * @param payload                       Mutation parameters.
 * @param payload.confirmCallback       Popup confirm callback.
 * @param payload.settings              Popup settings.
 * @param payload.textMessage           Popup text message.
 */
export function addPopup(
    state: PopupState,
    payload: {
        popup: IPopup,
    },
): void {
    state.popups.push(payload.popup);
}

/**
 * Removes popup from popups array.
 *
 * @param state                         Popup Vuex state.
 * @param payload                       Mutation parameters.
 * @param payload.id                    Popup id what should be removed.
 */
export function removePopup(
    state: PopupState,
    payload: {
        id: string,
    },
): void {
    state.popups = state.popups.filter(item => {
        return item.id !== payload.id;
    });
}

export default {
    addPopup,
    removePopup,
} as   MutationTree<PopupState>;
