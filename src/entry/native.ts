import RadListView from 'nativescript-ui-listview/vue';
import RadSideDrawer from 'nativescript-ui-sidedrawer/vue';
import RadDataForm from 'nativescript-ui-dataform/vue';
import Vue from 'nativescript-vue';
import { isAndroid } from 'tns-core-modules/platform';

import Apollo from 'plugins/Apollo';
import NativeFeedback from 'plugins/ns/Feedback';
import I18n from 'plugins/I18n';

import store from 'store';

import App from 'components/app/ns/App.vue';
import MenuSidebar from 'components/common/sidebars/menu-sidebar/ns/MenuSidebar.vue';
import Home from 'components/pages/home/ns/Home.vue';


(async () => {
    // Init `ns-feedback` plugin.
    NativeFeedback.init();

    const i18n = await I18n.init([
        store.state.locale,
        'en',
    ]);
    const apolloProvider = Apollo.init(
        // TODO: Replace hardlink with a meaningful one!
        Apollo.initHttpLink(undefined, 'http://10.0.2.2/api/graphql'),
        undefined,
        undefined,
        Apollo.initHttpLink(undefined, TNS_CONF_API_URL),
    );
    Vue.config.silent = (TNS_ENV === 'production');
    Vue.prototype.$isAndroid = isAndroid;

    // Register nativescript-vue ui components.
    Vue.use(RadSideDrawer);
    Vue.use(RadListView);
    Vue.use(RadDataForm);

    // Register specific ui components from nativescript-ui.
    Vue.registerElement(
        'DropDown',
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        () => require('nativescript-drop-down/drop-down').DropDown,
    );

    new Vue({
        apolloProvider,
        i18n,
        render: (h) => h(
            App,
            [
                h(MenuSidebar, { slot: 'drawerContent' }),
                h(Home, { slot: 'mainContent' }),
            ],
        ),
        store,
    }).$start();
})();

