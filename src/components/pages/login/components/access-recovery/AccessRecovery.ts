import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { Validator } from 'models/Validator';

import { isFilled } from 'utils/Validations';

import PlusIcon from 'components/icons/PlusIcon.vue';


/**
 * Access recovery form component.
 */
@Component({
    components: {
        'plus-icon': PlusIcon,
    },
})
export default class AccessRecovery extends Vue {
    /**
     * Indicator whether recovery code has been sent.
     */
    public hasCodeBeenSent: boolean = false;

    /**
     * Login input value.
     */
    public loginValue: string = '';

    /**
     * Recovery code value.
     */
    public codeValue: string = '';

    /**
     * List of errors to be displayed.
     */
    public errors: Record<string, string[]> = {
        code: [],
        login: [],
    };

    /**
     * List of passed validators IDs.
     */
    public passedValidators: string[] = [];

    /**
     * Access recovery validators.
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
                validate: async (value: string) =>await this.verifyLogin(
                    value,
                ),
                value: this.loginValue,
            },
            {
                errorMessage: 'Please enter Security code',
                fieldName: 'code',
                id: '3',
                validate: (value: string) => !this.hasCodeBeenSent
                        || isFilled(value),
                value: this.codeValue,
            },
            {
                dependsOn: ['3'],
                errorMessage: 'Incorrect Security code',
                fieldName: 'code',
                id: '4',
                validate: async (value: string) => !this.hasCodeBeenSent
                        || await this.verifyCode(value),
                value: this.codeValue,
            },
        ];
    }

    /**
     * Checks whether login is correct.
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
     * Checks whether recovery code is correct.
     *
     * @param value                     Recovery code, entered by user.
     */
    public async verifyCode(value: string): Promise<boolean> {
        return await new Promise((resolve, reject) => setTimeout(
            () => value === 'code'
                ? resolve()
                : reject(),
            900,
        ))
            .then(() => true)
            .catch(() => false);
    }

    /**
     * Validates access recovery form.
     * Redirects to `/new-password?type=recovery` page if it's valid.
     */
    public async next(): Promise<void> {
        for(const key in this.errors) {
            this.errors[key] = [];
        }
        this.passedValidators = [];


        if(await this.validate()) {
            if (this.hasCodeBeenSent) {
                this.$router.push('/new-password?type=recovery');
            } else {
                this.hasCodeBeenSent = true;
                setTimeout(() => {
                    const codeInput = this.$refs.codeInput as HTMLElement;
                    codeInput.focus();
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
     * Cancels the access recovery process by returning `hasCodeBeenSent` to
     * `false`.
     */
    public cancel(): void {
        this.hasCodeBeenSent = false;
        for(const key in this.errors) {
            this.errors[key] = [];
        }
        this.passedValidators = [];
    }
}
