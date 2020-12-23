import 'core-js/modules/es.promise.finally';
import intl from 'intl';
import 'intl/locale-data/jsonp/en.js';
import 'intl/locale-data/jsonp/ru.js';
import padStart from 'string.prototype.padstart';
import 'unfetch/polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';
// import * as Sentry from '@sentry/browser';
// import { Vue as VueIntegration } from '@sentry/integrations';

import 'class-component/hooks'; // must be imported first
import params from 'commonWebVue';
import Apollo from 'plugins/Apollo';
import I18n from 'plugins/I18n';
import 'plugins/ToBlobPolyfill';
import Router from 'Router';
import store from 'store';

import Vuebar from 'vuebar';
import Vue2TouchEvents from 'vue2-touch-events';

Vue.use(Vuebar);
Vue.use(Vue2TouchEvents);

// Sentry.init({
//     dsn: 'https://9a20adb89eae4878b39ea37098f30ca6@sentry.whost14.net/9',
//     integrations: [
//         new VueIntegration({ Vue, attachProps: true, logErrors: true }),
//     ],
// });

(async () => {
    params.apolloProvider = Apollo.init(
        Apollo.initHttpLink(),
        undefined,
        undefined,
        Apollo.initHttpLink(undefined, '/mock-api'),
    );

    if (!global.Intl) {
        global.Intl = intl;
    }
    padStart.shim();

    params.router = new Router().instance;

    params.i18n = await I18n.init([
        store.state.locale,
        navigator.language,
    ]);

    if (!params.router || !params.store) {
        return;
    }

    const router: VueRouter = params.router;

    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to);
        const prevMatched = router.getMatchedComponents(from);

        let diffed = false;
        const activated = matched.filter(
            (component: any | Vue, index: number) => { // eslint-disable-line
                return diffed || (diffed = (prevMatched[index] !== component));
            },
        );
        if (!activated.length) {
            return next();
        }

        Promise.all(activated.map((component: any | Vue) => { // eslint-disable-line
            if (component.options && component.options.asyncData) {
                return component.options.asyncData(
                    { route: router, store },
                );
            }
        }))
        .then(() => next())
        .catch(next);
    });

    new Vue(params).$mount('#app', true);
})();
