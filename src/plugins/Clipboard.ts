import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';


/**
 * Configuration of vue clipboard plugin.
 */
export default class Clipboard {

    /**
     * Initializes vue clipboard plugin.
     * More info:
     * {@link https://github.com/Inndy/vue-clipboard2}
     */
    public static init(): void {
        Vue.use(VueClipboard);
    }
}
