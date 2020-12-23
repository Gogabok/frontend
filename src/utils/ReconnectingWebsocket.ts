import { clamp } from 'utils/math';
import { capitalize } from 'utils/strings';


/**
 * Function that increments backoff value.
 *
 * @param attemptCounter                Sequence number of the reconnect
 *                                      attempt.
 * @param currentBackoff                Current backoff value.
 */
type BackoffIncFunction = (
    attemptCounter: number,
    currentBackoff: number,
) => number;

interface IWebSocket {
    send(message: string): void;
    onmessage(event: Event): void;
    onclose(event: Event): void;
    onopen(): void;
    onerror(): void;
}

interface IReconnectingWebsocket {
    onreconnect(): void;
    ondrop(): void;
}

type ReconnectingWebsocketOptions = {
    /**
     * Name of the connection. Used for logging.
     *
     * @default Connection URL.
     */
    name?: string,

    /**
     * Initial backoff value.
     *
     * @default `7000`.
     */
    initialBackoff: number,

    /**
     * Max backoff value in milliseconds, after which connection should be
     * dropped.
     *
     * @default `Infinity`.
     */
    maxBackoff?: number,

    /**
     * Max amount of reconnect attempts after which connection should be
     * dropped.
     *
     * @default `Infinity`.
     */
    maxRetries?: number,

    /**
     * Backoff increment function.
     *
     * @default `(count, backoffValue) => backoffValue`.
     */
    backoffIncFunction?: BackoffIncFunction,

    /**
     * Indicator whether WebSocket should try to open connection (not reconnect,
     * but establish an initial connection) if it couldn't establish it on the
     * first try.
     *
     * @default `true`.
     */
    connectAfterInitError?: boolean,

    /**
     * Amount of milliseconds in which WebSocket should send `ping` message to
     * the server to keep the connection alive.
     *
     * @default `7_000`.
     */
    pingInterval?: number,
}

type ErrorMessages = {
    AttemptLimitReached: string,
    BackoffLimitReached: string,
    FailedToConnect: string,
    FailedToReconnect: (reason: string) => string,
    SocketClosedWithCode : (code: number) => string,
    ConnectionDropped: string,
}

type Messages = {
    ConnectionRestored: string,
    ReconnectingWithBackoff: (backoff: number) => string,
    SocketIsOpen: string,
}

const defaultOptions: ReconnectingWebsocketOptions = {
    backoffIncFunction: (_, currentBackoff) => currentBackoff,
    connectAfterInitError: true,
    initialBackoff: 7000,
    maxBackoff: Infinity,
    maxRetries: Infinity,
    pingInterval: 7000,
};


/**
 * Wrapper over WebSocket class that automatically tries to reconnect to the
 * server if connection has benn lost.
 */
export default class ReconnectingWebsocket implements
    IWebSocket,
    IReconnectingWebsocket {
    /**
     * Indicator whether WebSocket should try to open connection (not reconnect,
     * but establish an initial connection) if it wasn't establish on the first
     * try.
     *
     * @default `true`.
     */
    private readonly connectAfterInitError: boolean;

    /**
     * Backoff increment function.
     *
     * @default `(count, backoffValue) => backoffValue`.
     */
    private readonly backoffIncFunc: BackoffIncFunction;

    /**
     * Amount of milliseconds in which WebSocket should send `ping` message to
     * the server to keep the connection alive.
     *
     * @default `7_000`.
     */
    private readonly pingInterval: number;

    /**
     * Connection name, used in logs.
     *
     * @default WebSocket URL without query parameters.
     */
    private readonly connectionName: string;

    /**
     * Max amount of reconnect attempts after which connection should be
     * dropped.
     *
     * @default `Infinity`.
     */
    private readonly maxRetries: number;

    /**
     * Max backoff value `in milliseconds, after which connection should be
     * dropped.
     *
     * @default `Infinity`.
     */
    private readonly maxBackoff: number;

    /**
     * Initial `backoff value` in milliseconds.
     *
     * @default 7000.
     */
    private readonly initialBackoff: number;

    /**
     * The sequence number of last reconnect attempt.
     */
    private reconnectAttempt: number;

    /**
     * Current reconnect backoff value.
     */
    private reconnectBackoff: number;

    /**
     * Instance of WebSocket.
     */
    private socket: WebSocket;

    /**
     * Socket ping interval.
     */
    private pingIntervalFunc: number;

    /**
     * Callback, called whenever WebSocket message comes in.
     */
    private _user_on_message: (event: Event) => void;

    /**
     * Callback, called whenever WebSocket connection established.
     */
    private _user_on_open: () => void;

    /**
     * Callback, called on WebSocket connection loss.
     */
    private _user_on_close: (event: Event) => void;

    /**
     * Callback, called whenever WebSocket connection is established after being
     * lost.
     */
    private _user_on_reconnect: () => void;

    /**
     * Callback, called whenever WebSocket connection was closed and
     * `ReconnectingWebsocket` reached its limit on reconnects (`MaxAttempts`
     * limit or `MaxBackoff` limit).
     */
    private _user_on_drop: () => void;

    /**
     * Callback, called whenever WebSocket error appears.
     */
    private _user_on_error: () => void;

    /**
     * Creates new instance of `ReconnectingWebsocket` class.
     *
     * @param connectionUrl             URL to connect to.
     * @param options                   Reconnect options.
     */
    constructor(
        private connectionUrl: string,
        options: ReconnectingWebsocketOptions = defaultOptions,
    ) {
        options = {
            ...defaultOptions,
            ...options,
        };
        this.initialBackoff = options.initialBackoff;
        this.maxRetries = <number>options.maxRetries;
        this.maxBackoff = <number>options.maxBackoff;
        this.pingInterval = <number>options.pingInterval;
        this.connectAfterInitError = <boolean>options.connectAfterInitError;
        this.backoffIncFunc = <BackoffIncFunction>options.backoffIncFunction;
        this.connectionName = options.name || connectionUrl.split('?')[0];
        this.reconnectAttempt = 0;
        this.reconnectBackoff = options.initialBackoff;

        this.init_connection();
    }

    /**
     * Record of error messages used for logging.
     */
    private get ErrorMessage(): ErrorMessages {
        const name = capitalize(this.connectionName);

        return {
            AttemptLimitReached:
                `Reconnect attempts limit reached on ${name} WebSocket.`,

            BackoffLimitReached: `Max backoff reached no ${name} WebSocket.`,

            ConnectionDropped: `${name} WebSocket connection dropped`,

            FailedToConnect: `${name} WebSocket couldn't connect to server`,

            FailedToReconnect: (
                reason: string,
            ) => `${name} WebSocket couldn't reconnect to server.\n${reason}`,

            SocketClosedWithCode: (
                code: number,
            ) => `${name} WebSocket is closed with code ${code}`,
        };
    }

    /**
     * Record of messages used for logging.
     */
    private get Message(): Messages {
        const name = capitalize(this.connectionName);
        return {
            ConnectionRestored: `${name} WebSocket connection restored`,

            ReconnectingWithBackoff: (
                backoff: number,
            ) => `${name} WebSocket is reconnecting to the server with`
                + ` ${backoff} ms backoff.`,

            SocketIsOpen: `${name} WebSocket is open`,
        };
    }

    /**
     * Sets `_user_on_message` callback that will be called whenever a new
     * WebSocket message comes in.
     *
     * @param callback                  Callback to be called whenever a new
     *                                  WebSocket message comes in.
     */
    public set onmessage(callback: (event: Event) => void) {
        this._user_on_message = callback;
    }

    /**
     * Sets `_user_on_close` callback that will be called whenever WebSocket
     * connection is lost.
     *
     * @param callback                  Callback to be called whenever WebSocket
     *                                  connection is lost.
     */
    public set onclose(callback: (event: Event) => void) {
        this._user_on_close = callback;
    }

    /**
     * Sets `_user_on_open` callback that will be called whenever WebSocket
     * connection is established.
     *
     * @param callback                  Callback to be called whenever WebSocket
     *                                  connection is established.
     */
    public set onopen(callback: () => void)  {
        this._user_on_open = callback;
    }

    /**
     * Sets `_user_on_drop` callback that will be called whenever WebSocket
     * connection is dropped.
     *
     * @param callback                  Callback to be called whenever WebSocket
     *                                  connection is dropped.
     */
    public set ondrop(callback: () => void) {
        this._user_on_drop = callback;
    }

    /**
     * Sets `_user_on_reconnect` callback that will be called whenever WebSocket
     * connection is established after being lost.
     *
     * @param callback                  Callback to be called whenever WebSocket
     *                                  connection is established after being
     *                                  lost.
     */
    public set onreconnect(callback: () => void) {
        this._user_on_reconnect = callback;
    }

    /**
     * Sets `_user_on_error` callback, that will be called whenever a WebSocket
     * error appears.
     *
     * @param callback                  Callback to be called whenever a
     *                                  WebSocket error appears.
     */
    public set onerror(callback: () => void) {
        this._user_on_error = callback;
    }

    /**
     * Sends the given message to WebSocket.
     *
     * @param message                   Sends message to the underlying
     *                                  WebSocket.
     */
    public send(message: string): void {
        this.socket.send(message);
    }

    /**
     * Callback that is called in case initial WebSocket connection hasn't been
     * established.
     * Calls `_user_on_close` callback.
     * Also, logs `event.code` connection is closed with and tries to connect
     * to server if `event.code` is not `1000`(ok) and `connectAfterInitError`
     * is not falsy.
     *
     * @param event                     `close` event.
     */
    private on_socket_init_error(event): void {
        console[event.code === 1000 ? 'log' : 'error'](
            this.ErrorMessage.SocketClosedWithCode(event.code),
        );

        if (this._user_on_close) this._user_on_close(event);

        if (event.code !== 1000 && this.connectAfterInitError) {
            this.attempt()
                .then(() => console.log(this.Message.ConnectionRestored))
                .catch((message: string) => console.error(
                    this.ErrorMessage.FailedToReconnect(message),
                ));
        }
    }

    /**
     * Callback that is called whenever established WebSocket connection is
     * lost.
     * Calls `_user_on_close` callback.
     * Also, logs `event.code` connection closed with and tries to reconnect
     * to server if `event.code` is not `1000` (ok).
     *
     * @param event                     `close` event.
     */
    private on_socket_connection_loss(event): void {
        clearInterval(this.pingIntervalFunc);

        if (this._user_on_close) this._user_on_close(event);

        console[event.code === 1000 ? 'log' : 'error'](
            this.ErrorMessage.SocketClosedWithCode(event.code),
        );

        if (event.code === 1000) return;

        this.attempt()
            .then(() => {
                console.log(this.Message.ConnectionRestored);
            })
            .catch((message: ErrorMessages) => {
                const _message = message as unknown as string;
                console.error(this.ErrorMessage.FailedToReconnect(_message));
            });
    }

    /**
     * Callback being called whenever WebSocket connection is established.
     *
     * Calls `_user_on_open` callback.
     * Also, sets `pingInterval` interval to keep WebSocket connection alive,
     * resets `reconnectBackoff and sets `onclose` WebSocket callback.
     */
    private on_socket_open(): void {
        console.log(this.Message.SocketIsOpen);

        if (this._user_on_open) this._user_on_open();

        this.pingIntervalFunc = setInterval(() => {
            this.socket.send('ping');
        }, this.pingInterval);
        this.reconnectBackoff = this.initialBackoff;
        this.reconnectAttempt = 0;

        this.socket.onclose = event => {
            console.log(this.ErrorMessage.ConnectionDropped);
            this.on_socket_connection_loss(event);
        };
    }

    /**
     * Inits WebSocket connection.
     * Sets `onclose`, `onmessage` and `onopen` WebSocket callbacks.
     */
    private init_connection(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket(this.connectionUrl);

            this.socket.onclose = event => {
                this.on_socket_init_error(event);
                reject();
            };
            this.socket.onopen = () => {
                this.on_socket_open();
                resolve();
            };
            this.socket.onmessage = message => this._user_on_message(message);
        });
    }

    /**
     * Tries to reconnect to server with current `reconnectBackoff` ms delay.
     * Also, increments `reconnectBackoff` according to `backoffIncFunc`.
     */
    private attempt(): Promise<void | ErrorMessages> {
        return new Promise((resolve, reject) => {
            if (this.reconnectBackoff === this.maxBackoff) {
                if(this._user_on_drop) this._user_on_drop();
                reject(this.ErrorMessage.BackoffLimitReached);
                return;
            } else if (this.reconnectAttempt >= this.maxRetries) {
                if(this._user_on_drop) this._user_on_drop();
                reject(this.ErrorMessage.AttemptLimitReached);
                return;
            }
            console.log(
                this.Message.ReconnectingWithBackoff(this.reconnectBackoff),
            );

            setTimeout(() => {
                this.reconnectBackoff = Math.round(
                    clamp(
                        this.backoffIncFunc(
                            this.reconnectAttempt++,
                            this.reconnectBackoff,
                        ),
                        0,
                        this.maxBackoff,
                    ),
                );
                this.init_connection()
                    .then(() => {
                        if(this._user_on_reconnect) this._user_on_reconnect();
                        resolve();
                    })
                    .catch(() => reject(this.ErrorMessage.FailedToConnect));
            }, this.reconnectBackoff);
        });
    }
}
