import Sizes from 'utils/Sizes';


/**
 * Helper for easily using Modernizr library.
 *
 * More info and documentation: {@link https://modernizr.com/docs}
 */
export default class Modernizr {

    /**
     * Media query for mobile devices.
     */
    private static mqMobile = `(max-width: ${Sizes.screen.mobile.width}px)`;

    /**
     * Returns flag, that determines if current device is mobile.
     *
     * @return   Flag, that determines if current device is mobile.
     */
    public static isMobileDevice(): boolean {
        if (TNS_ENV) {
            return true;
        }
        return process.browser ? this.getMdr().mq(this.mqMobile) : false;
    }

    /**
     * Return true if system supports touch screen.
     *
     * @return   Flag, that determines if current device is use touch screen.
     */
    public static isTouchDevice(): boolean {
        if (!process.browser || !document) {
            return false;
        }
        return 'ontouchstart' in document.documentElement;
    }

    /**
     * Returns true if system supports native emoji. Based on Modernizr Emoji
     * test with some improvements:
     * - implement support detection for particular Emoji;
     * - improve Emoji support detection in Firefox
     *   (https://github.com/Modernizr/Modernizr/issues/1688).
     *
     * @param emoji   Emoji unicode.
     */
    public static isSupportEmoji(emoji?: string): boolean {
        if (typeof document === 'undefined') {
            return false;
        }
        const node = document.createElement('canvas');
        const ctx = node.getContext('2d');
        if (!ctx) {
            return false;
        }
        ctx.fillStyle = '#f00';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.font = '32px Arial';
        ctx.fillText(
            emoji ? emoji : '\ud83d\udc28',
            0,
            0,
        );
        return ctx.getImageData(0, 0, 1, 1).data[0] !== 0;
    }

    /**
     * Fetches Modernizr from Yarn dependencies.
     *
     * @return   Fetched Modernizr API via `require` statement.
     */
    private static getMdr(): ModernizrAPI {
        return require('modernizr');
    }
}
