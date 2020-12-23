import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { Validator } from 'models/Validator';

import { isFilled } from 'utils/Validations';

import PlusIcon from 'components/icons/PlusIcon.vue';


/**
 * Login form component.
 */
@Component({
    components: {
        'plus-icon': PlusIcon,
    },
})
export default class LoginForm extends Vue {
    /**
     * Indicator whether user login is verified.
     */
    public isLoginVerified: boolean = false;

    /**
     * Login input value.
     */
    public loginValue: string = '';

    /**
     * Password input value.
     */
    public passwordValue: string = '';

    /**
     * Errors to be displayed.
     */
    public errors: Record<string, string[]> = {
        login: [],
        password: [],
    };
    /**
     * List of passed validators IDs.
     */
    public passedValidators: string[] = [];

    /**
     * Login validators.
     */
    public get validators(): Validator[] {
        return [
            {
                errorMessage: `
                    Please indicate GapopaID,
                    Login, E-mail, or Phone number
                `,
                fieldName: 'login',
                id: '1',
                validate: (value: string) => isFilled(value),
                value: this.loginValue,
            },
            {
                dependsOn: ['1'],
                errorMessage: 'Indicated account is not found',
                fieldName: 'login',
                id: '2',
                validate: async (value: string) =>
                    await this.verifyLogin(value),
                value: this.loginValue,
            },
            {
                errorMessage: 'Please enter Password',
                fieldName: 'password',
                id: '3',
                validate: (value: string) => {
                    return !this.isLoginVerified
                        || isFilled(value);
                },
                value: this.passwordValue,
            },
            {
                dependsOn: ['3'],
                errorMessage: 'Incorrect Password',
                fieldName: 'password',
                id: '4',
                validate: async (value: string) => {
                    return !this.isLoginVerified
                        || await this.verifyPassword(value);
                },
                value: this.passwordValue,
            },
        ];
    }

    /**
     * Checks, whether login is correct.
     *
     * @param value                     Login, entered by user.
     */
    public async verifyLogin(value: string): Promise<boolean> {
        return await new Promise((resolve, reject) => setTimeout(
            () => value === 'login'
                ? resolve()
                : reject(),
            900,
        ))
            .then(() => true)
            .catch(() => false);
    }

    /**
     * Checks, whether password is correct.
     *
     * @param value                     Password, entered by user.
     */
    public async verifyPassword(value: string): Promise<boolean> {
        return await new Promise((resolve, reject) => setTimeout(
            () => value === 'password'
                ? resolve()
                : reject(),
            900,
        ))
            .then(() => true)
            .catch(() => false);
    }

    /**
     * Validates login form. Redirects to `/chats` page if it's valid.
     */
    public async next(): Promise<void> {
        for(const key in this.errors) {
            this.errors[key] = [];
        }
        this.passedValidators = [];


        if(await this.validate()) {
            if (this.isLoginVerified) {
                this.$router.push('/chats');
            } else {
                this.isLoginVerified = true;
                setTimeout(() => {
                    const passwordInput =
                        this.$refs.passwordInput as HTMLElement;
                    passwordInput.focus();
                }, 50);
            }
        }
    }


    /**
     * Validates form. Appends error to errors list if some validators doesn't
     * pass a check.
     */
    public async validate(): Promise<boolean> {
        let isValid = true;
        for (const validator of this.validators) {
            if(validator.dependsOn
                && validator.dependsOn.length
                && !validator.dependsOn.every(id => {
                    return this.passedValidators.includes(id);
                })
            ) {
                continue;
            }
            if(!await validator.validate(validator.value)) {
                this.errors[validator.fieldName].push(validator.errorMessage);
                isValid && (isValid = false);
            } else {
                this.passedValidators.push(validator.id);
            }
        }
        return isValid;
    }

    /**
     * Cancels the login process by returning login verification state to
     * `false`.
     */
    public cancel(): void {
        this.isLoginVerified = false;
        for(const key in this.errors) {
            this.errors[key] = [];
        }
        this.passedValidators = [];
    }
}
