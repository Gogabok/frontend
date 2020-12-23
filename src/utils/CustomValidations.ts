/**
 * All available validation rule names.
 */
export enum RULE_NAMES {
    NUM = 'num',
    EMAIL = 'email',
    LOGIN = 'login',
    NAME = 'name',
    PASSWORD = 'password',
}

/**
 * String identifying and validation rules.
 */
export const rules = [
    {
        name: RULE_NAMES.NUM,
        validator: {
            validate: (value: string): boolean => {
                const re = /^[1-9][0-9]{12}$/;
                return re.test(value);
            },
        },
    },
    {
        name: RULE_NAMES.EMAIL,
        validator: {
            validate: (value: string): boolean => {
                // TODO: add advanced validation rule
                const re = /^.*@[a-zA-Z]+\.[a-zA-Z]+$/;
                return re.test(value);
            },
        },
    },
    {
        name: RULE_NAMES.LOGIN,
        validator: {
            validate: (value: string): boolean => {
                const re = /^[a-z0-9][a-z0-9_-]{1,18}[a-z0-9]$/i;
                const re2 = /^.*\D.*$/;
                return re.test(value) && re2.test(value);
            },
        },
    },
    {
        name: RULE_NAMES.NAME,
        validator: {
            validate: (value: string): boolean => {
                const re = /^[^\s].{0,98}[^\s]$/;
                return re.test(String(value));
            },
        },
    },
    {
        name: RULE_NAMES.PASSWORD,
        validator: {
            validate: (value: string): boolean => {
                const re = /^[^\s].{4,248}[^\s]$/;
                return re.test(value);
            },
        },
    },
];

/**
 * Validate passed string to be a valid Base64 string.
 *
 * @param str   String to be validated.
 */
export const isBase64 = (str: string): boolean => {
    if (str === '' || str.trim() === '') {
        return false;
    }
    try {
        return btoa(atob(str)) === str;
    } catch (err) {
        return false;
    }
};

/**
 * Identify passed value as num/email/login and returns
 * object that accords its key name with the value.
 *
 * @param value   String that will be identified.
 */
export function getRightObject(
    value: string,
): { [RULE_NAMES.NUM]: GraphQLScalars.Num }
    | { [RULE_NAMES.EMAIL]: GraphQLScalars.UserEmail }
    | { [RULE_NAMES.LOGIN]: GraphQLScalars.UserLogin }
    | null {
    const types = [RULE_NAMES.NUM, RULE_NAMES.EMAIL, RULE_NAMES.LOGIN];
    const rightObject = rules
        .filter(({ name }) => types.includes(name))
        .reduce((res, rule) => {
            if ((Object.keys(res).length === 0)
                && (rule.validator.validate(value))
            ) {
                res[rule.name] = value;
            }
            return res;
        }, {});

    if (Object.keys(rightObject).length === 0) {
        return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rightObject as any;
}

export default rules;
