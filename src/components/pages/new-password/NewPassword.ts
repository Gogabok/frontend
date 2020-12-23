import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { MetaInfo } from 'models/MetaInfo';

import ChangePasswordForm from './components/change-password-form/ChangePasswordForm.vue';
import PasswordHeader from './components/header/Header.vue';
import RecoveryForm from './components/recovery-form/RecoveryForm.vue';
import SetPasswordForm from './components/set-password-form/SetPasswordForm.vue';


/**
 * New password page component.
 */
@Component({
    components: {
        'change-password-form': ChangePasswordForm,
        'password-header': PasswordHeader,
        'recovery-form': RecoveryForm,
        'set-password-form': SetPasswordForm,
    },
})
export default class NewPassword extends Vue {
    /**
     * New password page type.
     */
    public pageType: string = '';

    /**
     * Returns meta information of page, such as:
     * title, meta tags content etc.
     *
     * @return                          Object, that contains page meta info.
     */
    public get metaInfo(): MetaInfo {
        return {
            meta: [
                { content: 'Password description', name: 'description' },
                { content: 'Password keywords', name: 'keywords' },
            ],
            title: 'Password',
        };
    }

    /**
     * New password page title.
     */
    public get pageTitle(): string {
        const types = {
            'default': '',
            'new-password': 'Change password',
            'recovery': 'Account access recovery',
            'set-password': 'Set password',
        };

        return types[this.pageType] || types.default;
    }

    /**
     * Indicator whether arrow is visible.
     */
    public get isArrowVisible(): boolean {
        return this.pageType === 'recovery';
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to set page type.
     */
    public mounted(): void {
        this.pageType = <string>this.$route.query.type || '';
    }
}
