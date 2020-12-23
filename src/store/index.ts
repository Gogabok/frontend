import Vue from 'vue';
import Vuex, { Plugin, Store } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import CallModule from 'store/modules/call';
import ChatsModule from 'store/modules/chats';
import GeneralParametersModule from 'store/modules/general-parameters';
import MobileScrollModule from 'store/modules/mobile-scroll-controller';
import NotificationsModule from 'store/modules/notifications';
import PopupModule from 'store/modules/popup';
import ProfileModule from 'store/modules/profile';

import RootState from 'store/root/state';

import UserModule from 'store/modules/user';
import UsersModule from 'store/modules/users';

import actions from 'store/root/actions';
import getters from 'store/root/getters';
import mutations from 'store/root/mutations';


Vue.use(Vuex);

const plugins: Array<Plugin<RootState>> = [];

if (!TNS_ENV && process.browser) {
    try {
        plugins.push(createPersistedState({
            paths: [
                'locale',
                'quickAccessSidebarActive',
                `${UserModule.vuexName}.authorizedUser`,
                `${UserModule.vuexName}.broadcasting`,
                `${UserModule.vuexName}.accessToken`, // TODO refactor
                `${UserModule.vuexName}.savedAccounts`,
                `${UserModule.vuexName}.session`,
                `${UserModule.vuexName}.rememberedSession`,
            ],
        }));
    } catch (e) {} // eslint-disable-line
}

/**
 * Vuex store instance, initialized with required root store,
 * modules and plugins.
 */
export const store: Store<RootState> = new Store<RootState>({
    actions,
    getters,
    modules: {
        [CallModule.vuexName]: new CallModule(),
        [PopupModule.vuexName]: new PopupModule(),
        [UserModule.vuexName]: new UserModule(),
        [ProfileModule.vuexName]: new ProfileModule(),
        [MobileScrollModule.vuexName]: new MobileScrollModule(),
        [NotificationsModule.vuexName]: new NotificationsModule(),
        [ChatsModule.vuexName]: new ChatsModule(),
        [GeneralParametersModule.vuexName]: new GeneralParametersModule(),
        [UsersModule.vuexName]: new UsersModule(),
    },
    mutations,
    plugins,
    state: new RootState(),
});

export default store;
