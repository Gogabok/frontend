import { WebSocketLink } from 'apollo-link-ws';

import ApolloCore from 'plugins/apollo/Core';


/**
 * Configuration of vue-apollo plugin.
 *
 * More info and documentation:
 * {@link https://github.com/Akryum/vue-apollo/tree/next}
 */
export default class Apollo extends ApolloCore {

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
        accessToken: string | null = null, // eslint-disable-line
        uri: string = '/ws', // eslint-disable-line
    ): WebSocketLink | undefined {
        // const protocol =
        //     (document.location.protocol === 'https:' ? 'wss' : 'ws');
        // return new WebSocketLink({
        //     options: {
        //         connectionParams: { accessToken },
        //         reconnect: true,
        //     },
        //     uri: `${protocol}://${uri}`,
        // });
        // TODO: create correct WsLink for apollo and NativeScript
        return undefined;
    }

}
