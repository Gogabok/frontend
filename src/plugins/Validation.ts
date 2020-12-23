import { configure, extend, localize, ValidationObserver, ValidationProvider } from 'vee-validate';
import { confirmed, email, max, min, required, required_if } from 'vee-validate/dist/rules.umd';
import Vue from 'vue';

import I18n from 'plugins/I18n';
import CustomValidations from 'utils/CustomValidations';


/**
 * Configuration of vee-validate plugin.
 */
export default class Validation {

    /**
     * Initializes vee-validate plugin with predefined configuration.
     */
    public static async init(): Promise<void> {
        Vue.component('ValidationObserver', ValidationObserver);
        Vue.component('ValidationProvider', ValidationProvider);

        // Add rules
        extend('confirmed', confirmed);
        extend('required_if', required_if);
        extend('email', email);
        extend('max', max);
        extend('min', min);
        extend('required', required);
        CustomValidations.forEach((rule) => extend(rule.name, rule.validator));

        // Set default locale
        localize(I18n.defaultLocale);

        configure({
            defaultMessage: (field, values): string => {
                if (values === undefined) {
                    return '';
                }
                return I18n.t(`validation.messages.${values._rule_}`, values);
            },
        });
    }

    /**
     * Changes the locale of the vee-validate plugin.
     */
    public static changeLocale(code: string): void {
        localize(code);
    }
}
