/**
 * Checks iOS version.
 *
 * @return  Array with iOS version numbers.
 *          Or null if user agent isn't iOS.
 */
export function iOSVersion(): number[] | null {
    if (!/iP(hone|od|ad)/.test(navigator.platform)) {
        return null;
    }
    const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
    if (v === null) {
        return null;
    }
    return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || '0', 10)];
}
