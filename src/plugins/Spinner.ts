/**
 * Spinner component.
 *
 * Note! It will work only in browser.
 * In server environment it will return null.
 *
 * More info and documentation: {@link https://github.com/dzwillia/vue-simple-spinner}
 */
export const Spinner = (process.browser || process.env.NODE_ENV === 'test')
    ? require('vue-simple-spinner')
    : null;

export default Spinner;
