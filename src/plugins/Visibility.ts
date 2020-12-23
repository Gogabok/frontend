/**
 * `visibilityjs` is a wrapper for the Page Visibility API.
 *
 * More info: {@link https://www.npmjs.com/package/visibilityjs}
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const Visibility: null | { [prop: string]: Function } =
    typeof window !== 'undefined'
    ? require('visibilityjs')
    : null;

export default Visibility;
