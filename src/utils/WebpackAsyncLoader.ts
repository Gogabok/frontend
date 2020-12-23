import store from 'store';

import { IS_CHUNK_LOADING_FAILED } from 'store/root/getters';
import { SET_IS_CHUNK_LOADING_FAILED } from 'store/root/mutations';


/**
 * Max loading retries for the chuck.
 */
const MAX_LOADING_RETRIES: number = 1;

/**
 * Webpack async vue component loader wrapper function.
 * Retrying on fail.
 *
 * @param chunkImportFn    Webpack async import vue component function.
 * @param checkDocument    Optional, is document required for the component.
 * @param maxRetryCount    Optional, custom retry count.
 *
 * @return    Function, that returns resolved promise with
 *            required vue component.
 */
export function WebpackAsyncLoader(
    chunkImportFn: () => Promise<typeof import ('*.vue')>,
    checkDocument: boolean = false,
    maxRetryCount: number = MAX_LOADING_RETRIES,
): () => Promise<typeof import ('*.vue')> {
    return WebpackAsyncModuleLoader<typeof import ('*.vue')>(
        chunkImportFn,
        checkDocument,
        maxRetryCount,
    );
}

/**
 * Webpack async module loader wrapper function.
 * Retrying on fail.
 *
 * @param chunkImportFn    Webpack async module import function.
 * @param checkDocument    Optional, is document required for the module.
 * @param maxRetryCount    Optional, custom retry count.
 * @param retryNumber      Current retry iteration, for selfcall counter.
 *
 * @return    Function, that returns resolved promise with required module.
 */
export function WebpackAsyncModuleLoader<Result>(
    chunkImportFn: () => Promise<Result>,
    checkDocument: boolean = false,
    maxRetryCount: number = MAX_LOADING_RETRIES,
    retryNumber: number = 0,
): () => Promise<Result> {
    return () => (checkDocument && typeof document === 'undefined')
        ? Promise.reject()
        : chunkImportFn().catch(() => {
            if (store.getters[IS_CHUNK_LOADING_FAILED]) {
                return Promise.reject();
            }
            if (retryNumber > maxRetryCount) {
                store.commit(SET_IS_CHUNK_LOADING_FAILED, true);
                return Promise.reject();
            }
            return WebpackAsyncModuleLoader<Result>(
                chunkImportFn,
                checkDocument,
                maxRetryCount,
                ++retryNumber,
            )();
        });
}

/**
 * Webpack async vue filter loader wrapper.
 * Retrying on fail.
 *
 * @param NAME             Vue filter name.
 * @param filters          Optional, Vue filters object to check is it already
 *                         exists.
 * @param maxRetryCount    Optional, custom retry count.
 *
 * @return    Resolved promise.
 */
export function LoadAsyncFilter(
    NAME: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    filters?: { [key: string]: Function },
    maxRetryCount: number = MAX_LOADING_RETRIES,
): Promise<void> {
    if (filters && filters[NAME] !== undefined) {
        return Promise.resolve();
    }
    return WebpackAsyncModuleLoader(
        () => import(`filters-async/${NAME}`),
        false,
        maxRetryCount,
    )().catch((e) => {
        return Promise.reject(e);
    });
}

export default WebpackAsyncLoader;
