import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import AppCore from 'components/app/App.core';

import UserModule from 'store/modules/user';

import MenuSidebar from 'components/common/sidebars/menu-sidebar/ns/MenuSidebar.vue';
import Home from 'components/pages/home/ns/Home.vue';
import ConversationList from 'components/pages/im/components/conversation-list/ns/ConversationList.vue';
import ApplicationSettings from 'components/pages/ns/application-settings/ApplicationSettings.vue';


const userModule = namespace(UserModule.vuexName);

/**
 * Base application component, that contains general properties
 * of all views and components. Used in native mobile app.
 *
 * Also, represents a basic application template.
 */
@Component({
    components: {
        ApplicationSettings,
        ConversationList,
        Home,
        MenuSidebar,
    },
})
export default class App extends AppCore {

    /**
     * Authenticates by passed login and password.
     *
     * @param payload                   Action parameters.
     * @param payload.login             Login to login wth.
     * @param payload.password          Password to login with.
     *
     * @return                          Resolved promise with access token.
     */
    @userModule.Action('AUTH')
    public login: (payload: {
        login: string,
        password: string,
    }) => Promise<string>;

    /**
     * Signs in.
     *
     * @param payload                   Action parameters.
     * @param payload.fromLogin         Login to sign in with.
     * @param payload.password          Password to sign in with.
     * @param payload.remember          Indicator whether session must be
     *                                  remembered.
     */
    @userModule.Action('SIGN_IN')
    public signIn: (payload: {
        formLogin: string,
        password: string,
        remember: boolean,
    }) => void;

    /**
     * Hooks to `mounted` Vue lifecycle stage to authenticate the user.
     */
    public mounted(): void {
        // this.login({ login: '1', password: '12' });
        this.signIn({
            formLogin: 'qwerty1',
            password: 'newpass',
            remember: false,
        });
    }
}
