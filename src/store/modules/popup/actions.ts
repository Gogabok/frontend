import { ActionContext, ActionTree } from 'vuex';

import { IPopup } from 'models/PopupSettings';

import RootState from 'store/root/state';
import PopupState from 'store/modules/popup/state';

import {
    ADD_POPUP_MUTATION,
    REMOVE_POPUP_MUTATION,
} from './mutations';


/**
 * Name of open popup action.
 */
export const ADD_POPUP: string = 'addPopup';

/**
 * Name of close popup action.
 */
export const REMOVE_POPUP: string = 'removePopup';

/**
 * Name of popup agree action.
 */
export const POPUP_AGREE: string = 'popupAgree';

/**
 * Adds popup to popups array.
 *
 * @param store                         Popup Vuex store.
 * @param payload                       Mutation parameters.
 * @param payload.confirmCallback       Popup confirm callback.
 * @param payload.settings              Popup settings.
 * @param payload.textMessage           Popup text message.
 */
export function addPopup(
    store: ActionContext<PopupState, RootState>,
    payload: {
        popup: IPopup,
    },
): void {
    store.commit(ADD_POPUP_MUTATION, payload);
}

/**
 * Removes popup from popups array.
 *
 * @param store                         Popup Vuex store.
 * @param payload                       Mutation parameters.
 * @param payload.id                    Popup id what should be removed.
 */
export function removePopup(
    store: ActionContext<PopupState, RootState>,
    payload: {
        id: string,
    },
): void {
    store.commit(REMOVE_POPUP_MUTATION, payload);
}

/**
 * Triggers popup callback and closes popup.
 *
 * @param store                         Popup Vuex store.
 * @param payload                       Mutation parameters.
 * @param payload.id                    Popup id what should be removed.
 */
export function popupAgree(
    store: ActionContext<PopupState, RootState>,
    payload: {
        id: string,
        data: any, // eslint-disable-line
    },
): void {
    const popup = store.state.popups.find(item => {
        return item.id === payload.id;
    });
    if(popup && popup.confirmCallback) {
        (<(...args: any[]) => void>popup.confirmCallback)(payload.data); // eslint-disable-line
    }
    store.dispatch(REMOVE_POPUP_MUTATION, { id: payload.id });
}

export default {
    addPopup,
    popupAgree,
    removePopup,
} as ActionTree<PopupState, RootState>;
