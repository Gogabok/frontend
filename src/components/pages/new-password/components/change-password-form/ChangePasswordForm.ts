import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { Validator } from 'models/Validator';

import { isFilled } from 'utils/Validations';


/**
 * Change password form component.
 */
@Component
export default class ChangePasswordForm extends Vue {
    /**
     * Old password input value.
     */
    public oldPasswordValue: string = '';

    /**
     * Password input value.
     */
    public passwordValue: string = '';

    /**
     * Repeat password input value.
     */
    public repeatPasswordValue: string = '';

    /**
     * List of errors to be displayed.
     */
    public errors: Record<string, string[]> = {
        newPassword: [],
        oldPassword: [],
        repeatPassword: [],
    };

    /**
     * List of passed validators IDs.
     */
    public passedValidators: string[] = [];

    /**
     * Form validators.
     */
    public get validators(): Validator[] {
        return [
            {
                errorMessage: 'Please, enter old password',
                fieldName: 'oldPassword',
                id: '1',
                validate: (value: string) => isFilled(value),
                value: this.oldPasswordValue,
            },
            {
                dependsOn: ['1'],
                errorMessage: 'Old password is incorrect',
                fieldName: 'oldPassword',
                id: '2',
                validate: async (value: string) =>
                    await this.verifyOldPassword(value),
                value: this.oldPasswordValue,
            },
            {
                errorMessage: 'Please repeat new password',
                fieldName: 'repeatPassword',
                id: '3',
                validate: (value: string) => isFilled(value),
                value: this.repeatPasswordValue,
            },
            {
                errorMessage: 'Please enter new password',
                fieldName: 'newPassword',
                id: '4',
                validate: (value: string) => isFilled(value),
                value: this.passwordValue,
            },
            {
                dependsOn: ['3', '4'],
                errorMessage: 'Passwords do not match',
                fieldName: 'repeatPassword',
                id: '5',
                validate: (value: string) => this.repeatPasswordValue === value,
                value: this.passwordValue,
            },
        ];
    }


    /**
     * Validates form. Redirects to `/chats` page if it's valid.
     */
    public async next(): Promise<void> {
        for(const key in this.errors) {
            this.errors[key] = [];
        }
        this.passedValidators = [];

        if(await this.validate()) {
            this.$router.push('/chats');
        }
    }

    /**
     * Checks, whether old password is correct.
     *
     * @param value                     Old password, entered by user.
     */
    public async verifyOldPassword(value: string): Promise<boolean> {
        return await new Promise((resolve, reject) => setTimeout(
            () => value === 'password'
                ? resolve()
                : reject(),
            900,
        )).then(() => true).catch(() => false);
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
     * Moves focus to new password field.
     */
    public oldPassEnter(): void {
        (this.$refs.newPassInput as HTMLElement).focus();
    }

    /**
     * Moves focus to repeat password field.
     */
    public newPassEnter(): void {
        (this.$refs.repeatPassInput as HTMLElement).focus();
    }
}
