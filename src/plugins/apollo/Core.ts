import { DataProxy } from 'apollo-cache';
import { InMemoryCache, IntrospectionFragmentMatcher, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { Subscription } from 'apollo-client/util/Observable';
import { ApolloLink, Observable as LinkObservable, split } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { createHttpLink, HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { createUploadLink } from 'apollo-upload-client';
import { getMainDefinition } from 'apollo-utilities';
import { DocumentNode, OperationDefinitionNode } from 'graphql';
import Vue from 'vue';
import VueApollo from 'vue-apollo';

import Apollo from 'plugins/Apollo';
import mockSchema from '../../../graphql.mock.schema.json';
import schema from '../../../graphql.schema.json';


/**
 * Configuration of vue-apollo plugin.
 *
 * More info and documentation:
 * {@link https://github.com/Akryum/vue-apollo/tree/next}
 */
export default class ApolloCore {

    /**
     * Initialized Apollo client.
     *
     * More info and documentation:
     * {@link https://github.com/apollographql/apollo-client}
     */
    public static client: ApolloClient<NormalizedCacheObject>;

    /**
     * TODO: Temporary second mock API client,
     *       until integration with social/backend will be complete
     */
    public static mockClient: ApolloClient<NormalizedCacheObject>;

    /**
     * Array of all subscriptions, that was added by `subscribe()` function.
     * It's using for having only one instance of the subscription of each name.
     * If subscription with given name is already exists, it would be
     * unsubscribed and replaced with the new one.
     */
    private static subscriptions: { [key: string]: Subscription } = {};

    /**
     * Initializes Apollo client and provider, and returns initialized provider
     * instance to use in Vue app configuration.
     *
     * @param link         Apollo Link instance — interface for fetching and
     *                     modifying control flow of GraphQL requests. It can be
     *                     HTTP implementation ({@link https://goo.gl/Xh4LX1}),
     *                     or common Apollo Client
     *                     ({@link https://goo.gl/TvAgNy}).
     * @param wsLink       Apollo Link instance to allow sending a request
     *                     over a web socket. More:
     *                     {@link https://goo.gl/i4peyn}.
     * @param options      Apollo Client configuration options.
     *
     *                     TODO: Temporary, for second mock client, until
     *                      integration with social/backend will be complete:
     * @param mockLink     Mock API link.
     * @param mockWsLink   Mock API ws link.
     *
     * @return   Initialized Apollo provider instance.
     */
    public static init(
        link: ApolloLink,
        wsLink?: WebSocketLink,
        options?: Record<string, unknown>,
        mockLink: ApolloLink = Apollo.initHttpLink('123', '/mock-api'),
        mockWsLink: WebSocketLink | undefined =
            (global.TNS_WEBPACK || process.env.VUE_ENV === 'server')
                ? undefined
                : Apollo.initWebSocketLink('123', '/mock-ws'),
    ): VueApollo {
        if (wsLink) {
            link = split(
                ({ query }) => {
                    const { kind, operation } =
                        getMainDefinition(query) as OperationDefinitionNode;
                    return ((kind === 'OperationDefinition')
                            && (operation === 'subscription'));
                },
                wsLink,
                link,
            );
        }
        const schemaData = schema;
        const fragmentMatcher = new IntrospectionFragmentMatcher({
            introspectionQueryResultData: schemaData.data,
        });

        const cache = new InMemoryCache({ fragmentMatcher });

        this.client = new ApolloClient({
            cache,
            link,
            ...options,
        });

        Vue.use(VueApollo);

        // TODO: Temporary need to integrate real API
        if (mockLink) {
            if (mockWsLink) {
                mockLink = split(
                    ({ query }) => {
                        const { kind, operation } =
                            getMainDefinition(query) as OperationDefinitionNode;
                        return ((kind === 'OperationDefinition')
                                && (operation === 'subscription'));
                    },
                    mockWsLink,
                    mockLink,
                );
            }
            const mockSchemaData = mockSchema;
            const mockFragmentMatcher = new IntrospectionFragmentMatcher({
                introspectionQueryResultData: mockSchemaData.data,
            });

            this.mockClient = new ApolloClient({
                cache:
                    new InMemoryCache({ fragmentMatcher: mockFragmentMatcher }),
                link: mockLink,
                ...options,
            });
        }

        return new VueApollo({
            clients: {
                client: this.client,
                mock: this.mockClient,
            },
            defaultClient: this.client,
        });
    }

    /**
     * Initializes instance of HTTP implementation of Apollo Client.
     *
     * More info and documentation: {@link https://goo.gl/Xh4LX1})
     *
     * @param accessToken   Optional access token.
     * @param uri           Optional API endpoint uri, that Apollo client will
     *                      send requests to. Default value: `/api/graphql`.
     * @param options       Optional options of Apollo HTTP Link.
     *
     * @return   Initialized Apollo Link instance.
     */
    public static initHttpLink(
        accessToken: string | null = null,
        uri: string = '/api/graphql',
        options?: HttpLink.Options,
    ): ApolloLink {
        if (uri === '/api/graphql'
            || uri === 'http://10.0.2.2/api/graphql'
        ) { // TODO: refactor LINK creation!
            const httpLink = createHttpLink({ uri, ...options });

            /**
             * Should use apollo-link-error,
             * but it's impossible due next issue unresolved:
             * {@link: https://github.com/apollographql/apollo-link/issues/194}
             *
             * apollo-link-error docs:
             * {@link: https://www.apollographql.com/docs/link/links/error/}
             */
            const suppressErrors = new ApolloLink(
                (operation, forward) => {
                    return new LinkObservable(observer => {
                        const sub = forward(operation).subscribe({
                            complete: () => {
                                observer.complete.bind(observer)();
                            },
                            error: networkErr => {
                                // If network error has data property it means
                                // that mutation/query returns correct operation
                                // result, but with returning non-200 HTTP
                                // status code, like 403, 401 etc.
                                if (networkErr.result.data) {
                                    // If error has data property, then returns
                                    // result object similar to normal mutation
                                    // result object.
                                    observer.next({
                                        data: networkErr.result.data,
                                    });
                                    observer.complete();
                                } else {
                                    observer.error(networkErr);
                                }
                            },
                            next: result => {
                                observer.next(result);
                            },
                        });
                        return () => {
                            if (sub) {
                                sub.unsubscribe();
                            }
                        };
                    });
            });
            const authLink = setContext((_, { headers }) => {
                return {
                    headers: {
                        ...headers,
                        ...(accessToken ? {
                            'Authorization': 'Bearer ' + accessToken,
                        } : {}),
                    },
                };
            });

            return ApolloLink.from([
                suppressErrors,
                authLink,
                httpLink,
            ]);
        }

        const httpLink = createUploadLink({ uri, ...options });

        const accessHeaders = accessToken
            ? {
                'Access-Token': accessToken,
                'Authorization': 'Basic c29jOndlcjMyMQ==',
            }
            : { Authorization: 'Basic c29jOndlcjMyMQ==' };

        const authLink = setContext((_, { headers }) => {
            return {
                headers: {
                    ...headers,
                    ...accessHeaders,
                },
            };
        });

        return authLink.concat(httpLink);
    }

    /**
     * Initializes instance of WebSocket implementation of Apollo Client.
     *
     * More info and documentation: {@link https://goo.gl/i4peyn}
     *
     * @param accessToken   Optional access token.
     * @param uri           Optional API endpoint uri, that client socket will
     *                      send requests to. Default value: `WS_ENDPOINT` env
     *                      variable.
     *
     * @return   Initialized Apollo WebSocket Client instance.
     */
    public static initWebSocketLink(
        accessToken: string | null = null,
        uri: string = '/ws',
    ): WebSocketLink | undefined {

        const protocol =
            (document.location.protocol === 'https:' ? 'wss' : 'ws');
        // Need for passing correct host under dev server.
        const wsHost = process.env.IS_DEV_SERVER
            ? 'ws://localhost:80'
            : `${protocol}://${document.location.host}`;
        return new WebSocketLink({
            options: {
                connectionParams: { accessToken },
                reconnect: true,
            },
            uri: `${wsHost}${uri}`,
        });
    }

    /**
     * Adds GraphQL subscription with given name, query and callback functions.
     *
     * More info and documentation:
     * {@link https://github.com/Akryum/vue-apollo/tree/next#subscribe}
     *
     * @param name          Subscription name, that it will be saved by.
     *                      This name is using for having only one instance
     *                      of the subscription of each name. If subscription
     *                      with given name is already exists, it would be
     *                      unsubscribed and replaced with the new one.
     * @param query         GraphQL query of subscription.
     * @param next          Callback function, that will be called on
     *                      subscription triggering.
     * @param variables     Optional query variables.
     * @param error         Optional error callback, that will be called on
     *                      subscription execution error.
     */
    public static subscribe(
        name: string,
        query: DocumentNode,
        next: (data: any) => void, // eslint-disable-line
        variables?: {
            [key: string]: any, // eslint-disable-line
        },
        error?: (reason: any) => void, // eslint-disable-line
    ): void {
        if (ApolloCore.subscriptions[name]) {
            ApolloCore.subscriptions[name].unsubscribe();
        }

        ApolloCore.subscriptions[name] = Apollo.client
            .subscribe({ query, variables })
            .subscribe({ error, next: (data) => next(data.data) });
    }

    /**
     * Update Apollo cache for specified query with specified data.
     *
     * More info and documentation:
     * {@link https://www.apollographql.com/docs/react/features/caching.html}
     *
     * @param proxy     Instance of Apollo DataProxy object.
     * @param query     Specified query options.
     * @param callback  Callback for modify cache data. Must return
     *                  modified data.
     */
    public static updateQueryCache(
        proxy: DataProxy,
        query: DataProxy.Query<any>, // eslint-disable-line
        callback: (data: any) => any, // eslint-disable-line
    ): void {
        let data: any; // eslint-disable-line
        try {
            data = proxy.readQuery(query);
        } catch (_) {
            global.console.log('Cache of query not found.');
            return;
        }
        proxy.writeQuery({ ...query, data: callback(data) });
    }
}
