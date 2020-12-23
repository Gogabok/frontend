/**
 * Sets first string letter to upper case.
 *
 * @param string                        String to be modified.
 */
export function capitalize(string: string): string {
    return string[0].toUpperCase() + string.substring(1);
}

/**
 * Formats user num in `xxxx xxxx xxxx xxxx` format.
 *
 * @param num                           User num to be formatted.
 */
export function formatUserNum(num: string): string {
    const match = num.match(/.{1,4}/g);
    return match ? match.join(' ') : num;
}
