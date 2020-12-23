import { GetterTree } from 'vuex';

import { LoaderAction } from 'models/LoaderAction';

import GeneralParametersState from 'store/modules/general-parameters/state';
import RootState from 'store/root/state';


/**
 * Name of mobile mode getter.
 */
export const IS_MOBILE_MODE: string = 'getMobileModeState';

/**
 * Name of force mobile mode getter.
 */
export const IS_FORCE_MOBILE_MODE: string = 'getForceMobileModeState';

/**
 * Name of app loading state getter.
 */
export const IS_APP_LOADING: string = 'getIsLoading';

/**
 * Name of app loader message getter.
 */
export const LOADER_MESSAGE: string = 'getLoaderMessage';

/**
 * Name of app loader actions getter.
 */
export const LOADER_ACTIONS: string = 'getLoaderActions';

/**
 * Name of app loader mounted callback getter.
 */
export const LOADER_MOUNTED_CALLBACK: string = 'getLoaderMounted';

/**
 * Name of loader beforeDestroy callback getter.
 */
export const LOADER_DESTROY_CALLBACK: string = 'getLoaderDestroy';

/**
 * Returns current loader actions.
 *
 * @param state     GeneralParameters VuexState
 */
export function getLoaderDestroy(
    state: GeneralParametersState,
): () => any { //eslint-disable-line
    return state.loaderBeforeDestroy;
}

/**
 * Returns current loader actions.
 *
 * @param state     GeneralParameters VuexState
 */
export function getLoaderMounted(
    state: GeneralParametersState,
): () => any { //eslint-disable-line
    return state.loaderMounted;
}

/**
 * Returns current loader actions.
 *
 * @param state     GeneralParameters VuexState
 */
export function getLoaderActions(
    state: GeneralParametersState,
): LoaderAction[] {
    return state.loaderActions;
}

/**
 * Returns current loader message.
 *
 * @param state     GeneralParameters VuexState
 */
export function getLoaderMessage(
    state: GeneralParametersState,
): string {
    return state.loaderMessage;
}

/**
 * Returns current app loading state.
 *
 * @param state     GeneralParameters VuexState
 */
export function getIsLoading(
    state: GeneralParametersState,
): boolean {
    return state.isLoading;
}

/**
 * Returns current mobile mode state.
 *
 * @param state    GeneralParameters Vuex state.
 */
export function getMobileModeState(
    state: GeneralParametersState,
): boolean {
    return state.isMobileMode;
}

/**
 * Returns current force mobile mode state.
 *
 * @param state    GeneralParameters Vuex state.
 */
export function getForceMobileModeState(
    state: GeneralParametersState,
): boolean {
    return state.isForceMobile;
}

export default {
    getForceMobileModeState,
    getIsLoading,
    getLoaderActions,
    getLoaderDestroy,
    getLoaderMessage,
    getLoaderMounted,
    getMobileModeState,
} as GetterTree<GeneralParametersState, RootState>;
