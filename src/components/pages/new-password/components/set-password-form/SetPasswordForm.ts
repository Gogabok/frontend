import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { Validator } from 'models/Validator';

import { isFilled } from 'utils/Validations';


/**
 * Set new password form component.
 */
@Component
export default class SetPasswordForm extends Vue {
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
                errorMessage: 'Please repeat new password',
                fieldName: 'repeatPassword',
                id: '1',
                validate: (value: string) => isFilled(value),
                value: this.repeatPasswordValue,
            },
            {
                errorMessage: 'Please enter new password',
                fieldName: 'newPassword',
                id: '2',
                validate: (value: string) => isFilled(value),
                value: this.passwordValue,
            },
            {
                dependsOn: ['1', '2'],
                errorMessage: 'Passwords do not match',
                fieldName: 'repeatPassword',
                id: '3',
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
     * Validates form. Appends error to errors list if some validators doesnt
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
     * Moves focus to repeat password field.
     */
    public newPassEnter(): void {
        const repeatPasswordInput = this.$refs.repeatPassInput as HTMLElement;
        repeatPasswordInput.focus();
    }
}
