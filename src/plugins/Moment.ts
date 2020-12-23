import MomentJs from 'moment';
import Vue from 'vue';

import { WebpackAsyncModuleLoader } from 'utils/WebpackAsyncLoader';


const VueMomentImport = () => import('vue-moment');

/**
 * Configuration of vue-moment plugin.
 */
export default class Moment {

    /**
     * Initializes vue-moment plugin with global moment.js object.
     */
    public static init(): void {
        WebpackAsyncModuleLoader(VueMomentImport)().then((VueMoment) => {
            Vue.use(VueMoment, {
                MomentJs,
            });
        });
    }

    /**
     * Loads locale data into from moment.js dictionaries and updates
     * moment locale configuration.
     *
     * @param locale    Locale to load data for.
     *
     * @return   Promise, that resolves after loading was done.
     */
    public static loadLocale(locale: string): Promise<void> {
        locale = locale === 'en' ? 'en-gb' : locale;
        return WebpackAsyncModuleLoader(
            () => import('moment/locale/' + locale),
        )().then(() => {
            MomentJs.locale(locale);
            return Promise.resolve();
        });
    }
}
