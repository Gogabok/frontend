import I18n from 'plugins/I18n';


/**
 * Interface of single validator configuration for JSON metadata object.
 */
export interface VavlidatorConfiguration {
    [key: string]: any; // eslint-disable-line
}

/**
 * Returns object with validation configuration valid for JSON Metadata
 * of RadDataForm. NonEmpty native validation rule.
 */
export function useNonEmptyValidator(): VavlidatorConfiguration {
    return {
        'name': 'NonEmpty',
        'params': {
            'error-message': I18n.t('validation.messages.required'),
        },
    };
}

/**
 * Returns valid JSON metadata validator configuration for
 * MinimumLength native validator.
 *
 * @param min   Minimum length.
 */
export function useMinimumLengthValidator(
    min: number,
): VavlidatorConfiguration {
    return {
        'name': 'MinimumLength',
        'params': {
            'error-message': I18n.t('validation.messages.min', { length: min }),
            'length': min,
        },
    };
}

/**
 * Returns valid JSON metadata configuration for RegEx native validator.
 *
 * @param RegEx         Regular exp in string.
 * @param messageName   Message name in the dict.
 */
export function useRegExValidator(
    RegEx: string,
    messageName: string,
): VavlidatorConfiguration {
    return {
        'name': 'RegEx',
        'params': {
            'errorMessage': I18n.t(`validation.messages.${messageName}`),
            'regEx': RegEx,
        },
    };
}
