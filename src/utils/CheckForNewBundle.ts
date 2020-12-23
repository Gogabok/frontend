import store from 'store';

import * as RootMutations from 'store/root/mutations';


/**
 * Interval to check for updates in milliseconds.
 */
export const checkBundleHashInterval: number = 1000 * 60;

/**
 * Load JSON file with hash of actual bundle.
 *
 * @param url        JSON file url location.
 * @param callback   Executing on successful download with status text passing.
 */
export function loadJSON<CallbackData>(
    url: string,
    callback: (data: CallbackData | null) => void,
): void {
    const xobj = new XMLHttpRequest();
    xobj.overrideMimeType('application/json');
    xobj.open('GET', url, true);
    xobj.onreadystatechange = () => {
        if (xobj.readyState === 4) {
            if (xobj.status !== 200) {
                return callback(null);
            }
            let result;
            try {
                result = JSON.parse(xobj.responseText);
            } catch (e) {
                result  = null;
            }
            callback(result);
        }
    };
    xobj.send(null);
}

/**
 * Wraps JSON getting in the Promise.
 *
 * @param url   JSON file url location.
 *
 * @return   Parsed object from loaded JSON file.
 */
export function getJSONInPromise<Result>(url: string): Promise<Result> {
    return new Promise<Result>((resolve, reject) => {
        loadJSON<Result>(url, (data) => {
            if (data !== null) {
                resolve(data);
            }
            reject('Unable to fetch JSON');
        });
    });
}

/**
 * Call JSON file load and set `isNeedReload` in the store if hash been changed.
 *
 * @return   Bundle build hash.
 */
export function checkBundleHash(): Promise<string | null> {
    if (process.env.IS_DEV_SERVER) {
        return Promise.resolve(null);
    }
    return getJSONInPromise<{ hash: string }>(
        `/bundle-hash.json?v=${Math.random()}`,
    ).then((data) => {
        if (__webpack_hash__ !== data.hash) {
            store.commit(RootMutations.SET_IS_NEED_RELOAD, true);
        }
        return data.hash;
    }).catch(() => {
        store.commit(RootMutations.SET_IS_CHUNK_LOADING_FAILED, true);
        return null;
    });
}

export default checkBundleHash;
