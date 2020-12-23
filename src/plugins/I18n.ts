import Vue from 'vue';
import VueI18n from 'vue-i18n';

import Moment from 'plugins/Moment';
import { WebpackAsyncModuleLoader } from 'utils/WebpackAsyncLoader';

import store from 'store';
import { START_LOADING, STOP_LOADING } from 'store/root/actions';
import { LOCALE } from 'store/root/getters';
import { SET_LOCALE } from 'store/root/mutations';


/**
 * Internationalization logic of application.
 * Uses vue-i18n plugin with external locale resources under the hood.
 */
export default class I18n {

    /**
     * Default application locale.
     * It's used as fallback locale when requested one is not available.
     */
    public static readonly defaultLocale: string = 'en';

    /**
     * Locales list, supported by application.
     */
    public static readonly locales: string[] = ['ru', 'en'];

    /**
     * Number formats of localization.
     */
    public static readonly numberFormats: VueI18n.NumberFormats = {
        'en-GB': {
            currency: {
                currency: 'GBP',
                currencyDisplay: 'symbol',
                style: 'currency',
            },
        },
    };

    /**
     * Instance of initialized vue-i18n plugin.
     */
    private static i18n: VueI18n;

    /**
     * Initializes vue-i18n plugin with given priority of locales.
     *
     * Takes each locale by priority, and trying to find it in supported
     * locales list.
     *
     * @param priority   Priority array of locales.
     *
     * @return   Resolved promise with initialized vue-i18n plugin instance.
     */
    public static async init(priority: string[]): Promise<VueI18n> {
        let startLocale = this.defaultLocale;

        for (const locale of priority) {
            if (this.locales.find((value) => value === locale)) {
                startLocale = locale;
                break;
            }
        }

        store.commit(SET_LOCALE, startLocale);

        Vue.use(VueI18n);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const messages = {} as any;
        for (const locale of this.locales) {
            messages[locale] = {};
        }

        this.i18n = new VueI18n({
            fallbackLocale: 'en',
            locale: startLocale,
            messages,
            numberFormats: this.numberFormats,
        });

        return await this.loadLocaleData(this.locales);
    }

    /**
     * Loads locale data and updates vue-i18n
     * dictionaries with it.
     *
     * @param locales    Locales, to load data for.
     *
     * @return   Resolved promise with locale data.
     */
    public static async loadLocaleData(locales: string[]): Promise<VueI18n> {
        store.dispatch(START_LOADING);
        for (const locale of locales) {
            await WebpackAsyncModuleLoader(
                () => import('~assets/i18n/' + locale + '.json'),
            )().then((data) => {
                this.i18n.setLocaleMessage(locale, data);

                store.dispatch(STOP_LOADING);
                return data;
            }).then((data) => {
                if (locale === store.getters[LOCALE]) {
                    return Moment.loadLocale(locale);
                }
                return data;
            });
        }
        return Promise.resolve(this.i18n);
    }

    /**
     * Localize the locale message of key.
     *
     * @param key      Path to message in the dict.
     * @param values   Values for formatting, e.g. min:{value}.
     */
    public static t(key: string, values?: any): string { // eslint-disable-line
        return this.i18n.t(key, values).toString();
    }
}
