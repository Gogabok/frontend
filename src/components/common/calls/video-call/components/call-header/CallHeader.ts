import Vue, { VueConstructor } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { CallStates } from 'models/Call.ts';

import filters from 'mixins/filters';

import CallModule from 'store/modules/call';
import GeneralParameters from 'store/modules/general-parameters';

import {
    GET_CALL_STATE,
    GET_CONNECTION_QUALITY_SCORE,
    GET_START_TIME,
} from 'store/modules/call/getters';
import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';

import ZoomOutIcon from 'components/icons/FromFullScreenIcon.vue';
import ZoomInIcon from 'components/icons/FullScreenIcon.vue';
import NewWindowIcon from 'components/icons/NewWindowIcon.vue';
import OldWindowIcon from 'components/icons/OldWindowIcon.vue';
import SettingsIcon from 'components/icons/SettingsIcon.vue';
import VideoCameraIcon from 'components/icons/VideoCameraIcon.vue';


const generalParameters = namespace(GeneralParameters.vuexName);
const callModule = namespace(CallModule.vuexName);

/**
 * Component allowing user to take general call actions:
 * - toggle fullscreen mode;
 * - open call settings;
 * - add call participant;
 */
@Component({
    components: {
        'new-window-icon': NewWindowIcon,
        'old-window-icon': OldWindowIcon,
        'zoom-in-icon': ZoomInIcon,
        'zoom-out-icon': ZoomOutIcon,
    },
    filters,
})
export default class CallHeader extends Vue {
    /**
     * Indicator whether full screen mode is active.
     */
    @Prop({ required: true }) isFullscreen: boolean;

    /**
     * Indicator whether add user button is visible.
     */
    @Prop({ default: false }) isAddUserVisible: boolean;

    /**
     * Name of the caller (group chat or person name or num).
     */
    @Prop({ required: true }) callerName: string;

    /**
     * Call duration increase interval.
     */
    public timeInterval: number = NaN;

    /**
     * Indicator whether call settings popup is visible.
     */
    public isCallSettingsVisible: boolean = false;

    /**
     * Call duration.
     */
    public time: {minutes: number, seconds: number} = {
        minutes: 0,
        seconds: 0,
    };

    /**
     * Current call state.
     */
    @callModule.Getter(GET_CALL_STATE)
    public callState: CallStates;

    /**
     * Connection quality score (0-4).
     */
    @callModule.Getter(GET_CONNECTION_QUALITY_SCORE)
    public connectionQualityScore: number;

    /**
     * Indicator whether mobile mode is active.
     */
    @generalParameters.Getter(IS_MOBILE_MODE)
    public isNativeMobileMode: boolean;

    /**
     * Indicator whether force mobile mode is active.
     */
    @generalParameters.Getter(IS_FORCE_MOBILE_MODE)
    public isForceMobileMode: boolean;

    /**
     * Call start time.
     */
    @callModule.Getter(GET_START_TIME)
    public callStartTime: number;

    /**
     * Indicator whether call is loading.
     */
    public get isLoading(): boolean {
        return this.callState === CallStates.AWAITING
            || this.callState === CallStates.RECONNECTING
            || this.callState === CallStates.LOADING;
    }

    /**
     * Indicator whether mobile mode is active (whether it's native or forced).
     */
    public get isMobileMode(): boolean {
        return this.isNativeMobileMode || this.isForceMobileMode;
    }

    /**
     * List of call menu items.
     */
    public get menuItems(): Array<{
        icon: VueConstructor<Vue>,
        label: string,
        action: () => unknown,
        iconClass?: string,
    }> {
        return [
            {
                action: () => {
                    this.$emit('disable-incoming-video');
                    this.isCallSettingsVisible = false;
                },
                icon: VideoCameraIcon,
                iconClass: 'call_dots__icon-disabled',
                label: 'Disable incoming video',
            },
            {
                action: () => {
                    this.$emit('open-settings');
                    this.isCallSettingsVisible = false;
                },
                icon: SettingsIcon,
                label: 'Settings Audio & Video',
            },
        ];
    }

    /**
     * Updates call duration information.
     */
    public updateTime(): void {
        if(this.callStartTime === 0) this.time = {
            minutes: 0,
            seconds: 0,
        };

        const ms = new Date().getTime() - this.callStartTime;
        const minutes = Math.floor(ms / 1000 / 60);
        const seconds = Math.floor((ms - minutes * 60 * 1000) / 1000);
        this.time = {
            minutes,
            seconds,
        };
    }

    /**
     * Opens popup menu
     *
     * @param isVisible                 Indicator whether popup menu is visible.
     */
    public setPopupMenuVisibility(isVisible: boolean): void {
        this.isCallSettingsVisible = isVisible;
    }

    /**
     * Minifies call on mobile.
     */
    public minifyCall(): void {
        this.$emit('minify');
    }

    /**
     * Emits `add-user` event to open add user interface.
     */
    public addParticipant(): void {
        this.$emit('add-user');
    }

    /**
     * Emits `toggle-fullscreen` event to enter/leave call fullscreen mode.
     */
    public toggleFullscreen(): void {
        this.$emit('toggle-fullscreen');
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to setup interval, that will update
     * call duration.
     * Also, sets up initial call duration.
     */
    mounted(): void {
        this.updateTime();
        this.timeInterval = setInterval(this.updateTime, 1000);
    }

    /**
     * Hooks `beforeDestroy` Vue lifecycle stage to clear update call duration
     * interval.
     */
    public beforeDestroy(): void {
        clearInterval(this.timeInterval);
    }
}
