import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { Popup } from 'models/PopupSettings';

import GeneralParametersModule from 'store/modules/general-parameters';
import PopupModule from 'store/modules/popup';

import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';
import { REMOVE_POPUP } from 'store/modules/popup/actions';


const generalParametersModule = namespace(GeneralParametersModule.vuexName);
const popupModule = namespace(PopupModule.vuexName);

/**
 * Alert popup component.
 */
@Component
export default class Alert extends Vue {
    /**
     * Popup data object.
     */
    @Prop({ default: {} }) popup: Popup;

    /**
     * Amount of milliseconds passed since alert showed up.
     */
    public counter: number = 0;

    /**
     * Interval function.
     */
    public counterInterval: number;

    /**
     * Amount of milliseconds for popup being visible by default.
     */
    public readonly DEFAULT_SHOW_TIME: number = 2000;

    /**
     * Number of milliseconds between counter interval executions.
     */
    public readonly INTERVAL_TICK: number = 100;

    /**
     * Indicator whether force mobile mode is active.
     */
    @generalParametersModule.Getter(IS_FORCE_MOBILE_MODE)
    public isForceMobileMode: boolean;

    /**
     * Indicator whether native mobile mode is active.
     */
    @generalParametersModule.Getter(IS_MOBILE_MODE)
    public isNativeMobileMode: boolean;

    /**
     * Indicator whether it's mobile mode (whether it's native or forced).
     */
    public get isMobileMode(): boolean {
        return this.isNativeMobileMode || this.isForceMobileMode;
    }

    /**
     * Removes popup from popups list.
     *
     * @param payload                   Action params.
     * @param payload.id                ID of the popup to be removed.
     */
    @popupModule.Action(REMOVE_POPUP)
    public removePopup: (payload: {
        id: string,
    }) => void;

    /**
     * Starts counter interval.
     */
    public startCounter(): void {
        this.counterInterval = setInterval(
            this.counterIncrease,
            this.INTERVAL_TICK,
        );
    }

    /**
     * Increases counter value.
     * Also removes the popup if `DEFAULT_SHOW_TIME` ms passed.
     */
    public counterIncrease(): void {
        this.counter += this.INTERVAL_TICK;
        if (this.counter === this.DEFAULT_SHOW_TIME) {
            this.removePopup({ id: this.popup.id });
        }
    }

    /**
     * Resets counter value to `0` and clears counter interval.
     */
    public stopCounter(): void {
        clearInterval(this.counterInterval);
        this.counter = 0;
    }

    /**
     * Clears counter interval.
     */
    public pauseCounter(): void {
        clearInterval(this.counterInterval);
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to set counter interval.
     */
    public mounted(): void {
        this.startCounter();
    }

    /**
     * Hooks `beforeDestroy` Vue lifecycle stage to clear counter interval and
     * reset counter to `0`.
     */
    public beforeDestroy(): void {
        this.stopCounter();
    }
}
