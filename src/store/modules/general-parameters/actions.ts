import { ActionContext, ActionTree } from 'vuex';

import { LoaderAction } from 'models/LoaderAction';

import GeneralParametersState from 'store/modules/general-parameters/state';
import RootState from 'store/root/state';

import GeneralParameters from 'store/modules/general-parameters';

import {
    SET_APP_LOADER_ACTIONS_MUTATION,
    SET_APP_LOADER_DESTROY_CALLBACK_MUTATION,
    SET_APP_LOADER_MESSAGE_MUTATION,
    SET_APP_LOADER_MOUNTED_CALLBACK_MUTATION,
    SET_FORCE_MOBILE_STATE,
    SET_IS_LOADING,
    SET_MOBILE_STATE,
} from 'store/modules/general-parameters/mutations';


/**
 * Name of toggle mobile mode action.
 */
export const TOGGLE_MOBILE_MODE: string = 'toggleMobileMode';

/**
 * Name of toggle mobile mode action.
 */
export const SET_MOBILE_MODE: string = 'setMobileMode';

/**
 * Name of toggle mobile mode action.
 */
export const TOGGLE_FORCE_MOBILE_MODE: string = 'toggleForceMobileMode';

/**
 * Name of set app loading state action.
 */
export const SET_APP_LOADING_STATE: string = 'setAppLoadingState';

/**
 * Name of set app loader message action.
 */
export const SET_APP_LOADER_MESSAGE: string = 'setAppLoaderMessage';

/**
 * Name of set app loader message action.
 */
export const SET_APP_LOADER_ACTIONS: string = 'setAppLoaderActions';

/**
 * Name of set app loader mounted callback action.
 */
export const SET_APP_LOADER_MOUNTED_CALLBACK: string =
    'setAppLoaderMountedCallback';

/**
 * Name of set app loader beforeDestroy callback action.
 */
export const SET_APP_LOADER_DESTROY_CALLBACK: string =
    'setAppLoaderDestroyCallback';

/**
 * Sets app loader actions.
 *
 * @param store                         GeneralParameters Vuex store.
 * @param payload                       List of actions of the loader.
 */
export function setAppLoaderActions(
    store: ActionContext<GeneralParametersState, RootState>,
    payload: LoaderAction[],
): void {
    store.commit(
        `${GeneralParameters.vuexName}/${SET_APP_LOADER_ACTIONS_MUTATION}`,
        payload,
        {
            root: true,
        },
    );
}

/**
 * Sets app loader message.
 *
 * @param store                         GeneralParameters Vuex store.
 * @param payload                       Message to be displayed.
 */
export function setAppLoaderMessage(
    store: ActionContext<GeneralParametersState, RootState>,
    payload: string,
): void {
    store.commit(
        `${GeneralParameters.vuexName}/${SET_APP_LOADER_MESSAGE_MUTATION}`,
        payload,
        {
            root: true,
        },
    );
}

/**
 * Sets app loader mounted callback.
 *
 * @param store                         GeneralParameters Vuex store.
 * @param payload                       Callback function to be called on
 *                                      mounted stage.
 */
export function setAppLoaderMountedCallback(
    store: ActionContext<GeneralParametersState, RootState>,
    payload: () => any, //eslint-disable-line
): void {
    store.commit(
        `${GeneralParameters.vuexName}/${
            SET_APP_LOADER_MOUNTED_CALLBACK_MUTATION
        }`,
        payload,
        {
            root: true,
        },
    );
}

/**
 * Sets app loader beforeDestroy callback.
 *
 * @param store                         GeneralParameters Vuex store.
 * @param payload                       Callback function to be called on
 *                                      beforeDestroy stage.
 */
export function setAppLoaderDestroyCallback(
    store: ActionContext<GeneralParametersState, RootState>,
    payload: () => any, //eslint-disable-line
): void {
    store.commit(
        `${GeneralParameters.vuexName}/${
            SET_APP_LOADER_DESTROY_CALLBACK_MUTATION
        }`,
        payload,
        {
            root: true,
        },
    );
}

/**
 * Sets app isLoading state equal to provided value.
 *
 * @param store                         GeneralParameters Vuex store.
 * @param payload                       Action parameters.
 * @param payload.isLoading             Indicator whether app is in loading
 *                                      state.
 */
export function setAppLoadingState(
    store: ActionContext<GeneralParametersState, RootState>,
    payload: {
        isLoading: boolean,
    },
): void {
    store.commit(SET_IS_LOADING, payload.isLoading);
}


/**
 * Toggles the mobile mode of the application.
 *
 * @param store                         GeneralParameters Vuex store.
 */
export function toggleMobileMode(
    store: ActionContext<GeneralParametersState, RootState>,
): void {
    store.commit(
        `${GeneralParameters.vuexName}/${SET_MOBILE_STATE}`,
        !store.state.isMobileMode,
        { root: true },
    );
}

/**
 * Sets the mobile mode of the application.
 *
 * @param store                         GeneralParameters Vuex store.
 * @param payload                       Indicator whether mobile mode should be
 *                                      set on or off.
 */
export function setMobileMode(
    store: ActionContext<GeneralParametersState, RootState>,
    payload: boolean,
): void {
    store.commit(
        `${GeneralParameters.vuexName}/${SET_MOBILE_STATE}`,
        payload,
        { root: true },
    );
}

/**
 * Toggles the force mobile mode of the application.
 *
 * @param store                         GeneralParameters Vuex store.
 */
export function toggleForceMobileMode(
    store: ActionContext<GeneralParametersState, RootState>,
): void {
    store.commit(
        `${GeneralParameters.vuexName}/${SET_FORCE_MOBILE_STATE}`,
        !store.state.isForceMobile,
        { root: true },
    );
}

export default {
    setAppLoaderActions,
    setAppLoaderDestroyCallback,
    setAppLoaderMessage,
    setAppLoaderMountedCallback,
    setAppLoadingState,
    setMobileMode,
    toggleForceMobileMode,
    toggleMobileMode,
} as ActionTree<GeneralParametersState, RootState>;
