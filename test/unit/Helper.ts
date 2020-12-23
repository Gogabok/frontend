import { ApolloLink, Observable } from 'apollo-link';
import { graphql, print } from 'graphql';
import { addMocksToSchema, makeExecutableSchema } from 'graphql-tools';
import { buildClientSchema, printSchema } from 'graphql/utilities';
import Vue, { VueConstructor } from 'vue';
import { Store } from 'vuex';

import params from 'commonWebVue';
import Apollo from 'plugins/Apollo';
import I18n from 'plugins/I18n';
import Router from 'Router';


/**
 * Helper class with common functions, required fot unit specs.
 */
export default class Helper {

    /**
     * Initializes Vue application instance with rendered given component
     * and locale.
     *
     * @param component     Vue component that will be mounted and rendered
     *                      at the app root level.
     * @param mockStore     Vuex store instance with mocked actions,
     *                      that will be used during the test.
     * @param props         Optional. Specifies component props.
     * @param mount         Optional. Specifies, if component must be mounted
     *                      after the app instance was created.
     *                      If set to "true", the component will be mounted,
     *                      and only then app instance will be returned.
     * @param locale        Optional. Specifies locale, which will be used
     *                      during rendering. Default - en.
     *
     * @return    Resolved promise with Vue application instance.
     */
    public static async initApp(
        component: VueConstructor<Vue>,
        mockStore: Store<any>,
        props: any = {},
        mount: boolean = true,
        locale: string = 'en',
    ): Promise<Vue> {
        const app = new Vue({
            ...params,
            apolloProvider: Apollo.init(await this.initMockedLink()),
            i18n: await I18n.init([locale]),
            render: (h) => h(component, { props }),
            router: new Router({ ssrMode: true }).instance,
            store: mockStore,
        });

        return (mount ? app.$mount() : app);
    }

    /**
     * Initializes mocked Apollo Link instance. Module `api/graphql/mocks`
     * is using as mocked data.
     *
     * @return   Resolved promise with initialized Apollo Client instance.
     */
    private static async initMockedLink(): Promise<ApolloLink> {
        const jsonSchema: any = await import('../../graphql.mock.schema.json');
        const mocks: { IMocks } = await import('api/graphql/mocks');

        const schema = makeExecutableSchema({
            resolverValidationOptions: {
                requireResolversForResolveType: 'ignore',
            },
            typeDefs: printSchema(buildClientSchema(jsonSchema.data)),
        });

        addMocksToSchema({
            mocks: (mocks as any).default,
            preserveResolvers: true,
            schema,
        });

        return new ApolloLink((operation) => {
            return new Observable((observer) => {
                const { query, operationName, variables } = operation;
                graphql(
                    schema,
                    print(query),
                    null,
                    null,
                    variables,
                    operationName,
                ).then((result) => {
                    observer.next(result);
                    observer.complete();
                });
            });
        });
    }
}
