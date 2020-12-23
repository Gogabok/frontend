interface Coordinates {
    x: number;
    y: number;
}

export interface MovementHandlerData {
    initialPosition: Coordinates;
    currentPosition: Coordinates;
    diff: Coordinates;
}

export type MovementHandlerGuard = () => boolean;

/**
 * Movement handler that provides initial, current touch/mouse position and
 * distance changes on both axes.
 */
export class MovementHandler {
    /**
     * Initial touch/mouse position.
     */
    private initialCoordinates: Coordinates = { x: 0, y: 0 };

    /**
     * Current touch/mouse position.
     */
    private currentCoordinates: Coordinates = { x: 0, y: 0 };

    /**
     * Changes in distance on both axes.
     */
    private diff: Coordinates = { x: 0, y: 0 };

    /**
     * `ontouchstart` event handler,
     */
    private _onStartCallback: (
        data: MovementHandlerData,
        additionalData: Record<string, unknown>,
    ) => void | boolean;

    /**
     * `ontouchmove` event handler.
     */
    private _onMoveCallback: (
        data: MovementHandlerData,
        additionalData: Record<string, unknown>,
    ) => void | boolean;

    /**
     * `ontouchend` event handler.
     */
    private _onEndCallback: (
        data: MovementHandlerData,
        additionalData: Record<string, unknown>,
    ) => void;

    /**
     * Additional data, provided by user.
     */
    private _additionalData: Record<string, unknown> = {};

    /**
     * Movement handler constructor.
     */
    constructor() {
        this._onStart = this._onStart.bind(this);
        this._onMove = this._onMove.bind(this);
        this._onEnd = this._onEnd.bind(this);
        this.start = this.start.bind(this);
        this.end = this.end.bind(this);
        this.passPropsToCallback = this.passPropsToCallback.bind(this);
    }

    /**
     * Start public interface. Triggers `_onStart` event to add all it's events
     * listeners.
     *
     * @param e                         `touchstart`/`mousedown` event.
     */
    public start(e: TouchEvent | MouseEvent): void {
        this._onStart(e);
    }

    /**
     * End public interface. Triggers `_onEnd` event to clear all it's event
     * listeners.
     */
    public end(): void {
        this._onEnd();
    }

    /**
     * Captures initial mouse/touch coordinates.
     *
     * @param callback                  Callback to be called on touch start.
     */
    public onStart(
        callback: (
            data: MovementHandlerData,
            additionalData: Record<string, unknown>,
        ) => void | boolean,
    ): void {
        this._onStartCallback = callback;
    }

    /**
     * Calls `_onStartCallback` if it's provided.
     * Also, adds `touchstart`|`mousedown` and `touchend`|`mouseup` events
     * listeners.
     *
     * @param e                         `touchstart`|`mousedown` event.
     */
    private _onStart(e: TouchEvent | MouseEvent): void {
        if (e.type == 'touchstart') {
            e = e as TouchEvent;
            this.initialCoordinates = {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY,
            };
        } else {
            e = e as MouseEvent;
            this.initialCoordinates = {
                x: e.clientX,
                y: e.clientY,
            };
        }

        this.currentCoordinates = this.initialCoordinates;

        if(!this._onStartCallback
            || this.passPropsToCallback(this._onStartCallback) !== false
        ) {
            if('ontouchstart' in window) {
                window.addEventListener('touchmove',this._onMove);
                window.addEventListener('touchend', this._onEnd);
            } else {
                window.addEventListener('mousemove', this._onMove);
                window.addEventListener('mouseup', this._onEnd);
            }
        }
    }

    /**
     * Updates current mouse/touch position and `diff`.
     *
     * @param callback                  Callback to be called on each
     *                                  `mousemove`/`touchmove` event.
     */
    public onMove(
        callback: (
            data: MovementHandlerData,
            additionalData: Record<string, unknown>,
        ) => void | boolean,
    ): void {
        this._onMoveCallback = callback;
    }

    /**
     * Calls `_onMoveCallback` if it's provided.
     * Also, updates `currentCoordinates` and `diff` values.
     *
     * @param e                         `touchstart`|`mousedown` event.
     */
    private _onMove(e: TouchEvent | MouseEvent): void {
        if (e.type == 'touchmove') {
            e = e as TouchEvent;
            this.currentCoordinates = {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY,
            };
        } else {
            e = e as MouseEvent;
            this.currentCoordinates = {
                x: e.clientX,
                y: e.clientY,
            };
        }
        this.diff = {
            x: this.currentCoordinates.x - this.initialCoordinates.x,
            y: this.currentCoordinates.y - this.initialCoordinates.y,
        };

        if(!this._onMoveCallback) return;
        if(this.passPropsToCallback(this._onMoveCallback) === false) {
            this._onEnd();
        }
    }

    /**
     * Resets all coordinates to 0.0.
     * Also, removes `touchstart` and `touchend` events listeners.
     *
     * @param callback                  Callback to be called on `touchend`
     *                                  event.
     */
    public onEnd(
        callback: (
            data: MovementHandlerData,
            additionalData: Record<string, unknown>,
        ) => void | boolean,
    ): void {
        this._onEndCallback = callback;
    }

    /**
     * Calls `_onEndCallback` if it's provided.
     * Also, removes all event listeners and resets data.
     *
     * @param e                         `touchstart`|`mousedown` event.
     */
    private _onEnd() {
        if(this._onEndCallback) {
            this.passPropsToCallback(this._onEndCallback);
        }

        if('ontouchstart' in window) {
            window.removeEventListener('touchmove',this._onMove);
            window.removeEventListener('touchend', this._onEnd);
        } else {
            window.removeEventListener('mousemove', this._onMove);
            window.removeEventListener('mouseup', this._onEnd);
        }


        this._additionalData = {};
        this.diff = { x: 0, y: 0 };
        this.initialCoordinates = { x: 0, y: 0 };
        this.currentCoordinates = { x: 0, y: 0 };
    }

    /**
     * Calls callback, providing actual coordinates data.
     *
     * @param callback                  Callback to be called.
     */
    public passPropsToCallback(
        callback: (
            payload: MovementHandlerData,
            additionalData: Record<string, unknown>,
        ) => void | boolean,
    ): void | boolean {
         return callback({
            currentPosition: this.currentCoordinates,
            diff: this.diff,
            initialPosition: this.initialCoordinates,
        }, this._additionalData);
    }
}
