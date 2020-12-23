import { MutationTree } from 'vuex';

import GeneralParametersState from 'store/modules/general-parameters/state';
import { LoaderAction } from 'models/LoaderAction';


/**
 * Name of set mobile state mutation.
 */
export const SET_MOBILE_STATE: string = 'setMobileState';

/**
 * Name of set force mobile state mutation.
 */
export const SET_FORCE_MOBILE_STATE: string = 'setForceMobileState';

/**
 * Name of set isLoading state mutation.
 */
export const SET_IS_LOADING: string = 'setIsLoading';

/**
 * Name of set app loader message mutation.
 */
export const SET_APP_LOADER_MESSAGE_MUTATION: string =
    'setAppLoaderMessageMutation';

/**
 * Name of set app loader message mutation.
 */
export const SET_APP_LOADER_ACTIONS_MUTATION: string =
    'setAppLoaderActionsMutation';

/**
 * Name of set app loader mounted callback mutation.
 */
export const SET_APP_LOADER_MOUNTED_CALLBACK_MUTATION: string =
    'setAppLoaderMountedCallbackMutation';

/**
 * Name of set app loader beforeDestroy callback mutation.
 */
export const SET_APP_LOADER_DESTROY_CALLBACK_MUTATION: string =
    'setAppLoaderDestroyCallbackMutation';

/**
 * Sets app beforeDestroy hook.
 *
 * @param state         GeneralParameters Vuex state.
 * @param callback      Callback to be called on beforeDestroy.
 */
export function setAppLoaderDestroyCallbackMutation(
    state: GeneralParametersState,
    callback: () => any, // eslint-disable-line
): void {
    state.loaderBeforeDestroy = callback;
}

/**
 * Sets app mounted hook.
 *
 * @param state         GeneralParameters Vuex state.
 * @param callback      Callback to be called on mounted.
 */
export function setAppLoaderMountedCallbackMutation(
    state: GeneralParametersState,
    callback: () => any, // eslint-disable-line
): void {
    state.loaderMounted = callback;
}

/**
 * Sets app mounted hook.
 *
 * @param state         GeneralParameters Vuex state.
 * @param actionsList   List of actions of the loader.
 */
export function setAppLoaderActionsMutation(
    state: GeneralParametersState,
    actionsList: LoaderAction[],
): void {
    state.loaderActions = actionsList;
}

/**
 * Sets app mounted hook.
 *
 * @param state         GeneralParameters Vuex state.
 * @param message       Message to be displayed.
 */
export function setAppLoaderMessageMutation(
    state: GeneralParametersState,
    message: string,
): void {
    state.loaderMessage = message;
}

/**
 * Sets app loading state.
 *
 * @param state             GeneralParameters Vuex state.
 * @param isLoadingState    Indicator whether app is loading something.
 */
export function setIsLoading(
    state: GeneralParametersState,
    isLoadingState: boolean,
): void {
    state.isLoading = isLoadingState;
}

/**
 * Sets mobile mode state of the application.
 *
 * @param state              GeneralParameters Vuex state.
 * @param mobileModeState    Indicator whether mobile mode should be set.
 */
export function setMobileState(
    state: GeneralParametersState,
    mobileModeState: boolean,
): void {
    state.isMobileMode = mobileModeState;
}

/**
 * Sets force mobile state of the application.
 *
 * @param state                 GeneralParameters Vuex state.
 * @param forceMobileModeState  Indicator whether mobile mode is forced or not.
 */
export function setForceMobileState(
    state: GeneralParametersState,
    forceMobileModeState: boolean,
): void {
    state.isForceMobile = forceMobileModeState;
}

export default {
    setAppLoaderActionsMutation,
    setAppLoaderDestroyCallbackMutation,
    setAppLoaderMessageMutation,
    setAppLoaderMountedCallbackMutation,
    setForceMobileState,
    setIsLoading,
    setMobileState,
} as MutationTree<GeneralParametersState>;
