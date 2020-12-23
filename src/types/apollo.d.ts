import { DataProxy } from 'apollo-cache';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import VueApollo from 'vue-apollo';


declare module 'vue/types/options' {
    interface ComponentOptions {
        apolloProvider?: VueApollo;
    }
}

declare interface Apollo {
    client: ApolloClient<NormalizedCacheObject>;

    mockClient: ApolloClient<NormalizedCacheObject>;

    init: (
        link: ApolloLink,
        wsLink?: WebSocketLink,
        options?: Record<string, unknown>,
        mockLink?: ApolloLink,
        mockWsLink?: WebSocketLink,
    ) => VueApollo;

    initHttpLink: (
        accessToken: string | null = null,
        uri: string = '/api/graphql',
        options?: HttpLink.Options,
    ) => ApolloLink;

    updateQueryCache: (
        proxy: DataProxy,
        query: DataProxy.Query<any>, // eslint-disable-line
        callback: (data: any) => any, // eslint-disable-line
    ) => void;

    initWebSocketLink: (
        accessToken: string | null = null,
        uri: string = '/ws',
    ) => WebSocketLink;
}
