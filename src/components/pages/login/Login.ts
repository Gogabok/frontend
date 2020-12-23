import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { MetaInfo } from 'models/MetaInfo';

import AccessRecovery from './components/access-recovery/AccessRecovery.vue';
import LoginHeader from './components/login-header/LoginHeader.vue';
import LoginForm from './components/login-form/LoginForm.vue';
import Facebook from './components/social/facebook/Facebook.vue';


/**
 * Login page component.
 */
@Component({
    components: {
        'access-recovery': AccessRecovery,
        'facebook-login': Facebook,
        'login-form': LoginForm,
        'login-header': LoginHeader,
    },
})
export default class Login extends Vue {
    /**
     * Page meta information:
     * - title;
     * - meta tags content;
     * - etc.
     */
    public get metaInfo(): MetaInfo {
        return {
            meta: [
                { content: 'Login page description', name: 'description' },
                { content: 'Login, page, keywords', name: 'keywords' },
            ],
            title: 'Login',
        };
    }
}
