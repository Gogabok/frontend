import fetch from 'node-fetch';
import Vue from 'vue';
import VueRouter from 'vue-router';
import { Store } from 'vuex';

import 'class-component/hooks'; // must be imported first
import params from 'commonWebVue';
import Apollo from 'plugins/Apollo';
import I18n from 'plugins/I18n';
import Router from 'Router';


export default async (context: any) => { // eslint-disable-line
    type FetchType = (
        input: RequestInfo,
        init?: RequestInit | undefined,
    ) => Promise<Response>;
    params.apolloProvider = Apollo.init(
        Apollo.initHttpLink(
            null,
            process.env.CONF_API_URL,
            { fetch: fetch as unknown as FetchType },
        ),
        undefined,
        { ssrMode: true },
        Apollo.initHttpLink(
            null,
            process.env.CONF_MOCK_API_URL,
            { fetch: fetch as unknown as FetchType },
        ),
    );

    params.router = new Router({ ssrMode: true }).instance;

    return new Promise((resolve, reject) => {

        if (!params.router || !params.store) {
            return reject();
        }

        const router: VueRouter = params.router;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const store: Store<any> = params.store;

        router.push(context.url);

        params.router.onReady(() => {
            const matchedComponents = router.getMatchedComponents();

            if (!matchedComponents.length) {
                reject({ code: 404 });
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Promise.all(matchedComponents.map((component: any | Vue) => {
                if (component && component.options.asyncData) {
                    return component.options.asyncData(
                        { route: router.currentRoute, store },
                    );
                }
            })).then(() => {
                return I18n.init(context.accept_languages).then((i18n) => {
                    params.i18n = i18n;
                });
            }).then(() => {
                const app = new Vue(params);

                context.state = store.state;
                context.meta = app.$meta();

                resolve(app);
            }).catch(reject);
        });
    });
};
