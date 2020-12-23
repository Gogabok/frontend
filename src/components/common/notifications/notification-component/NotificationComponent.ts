import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { MovementHandler, MovementHandlerData } from 'utils/moveHandler';

import { Notification } from 'models/Notification';

import GeneralParametersModule from 'store/modules/general-parameters';
import NotificationsModule from 'store/modules/notifications';

import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';
import { DELETE_NOTIFICATION } from 'store/modules/notifications/actions';

import PlusIcon from 'components/icons/PlusIcon.vue';


const GeneralParameters = namespace(GeneralParametersModule.vuexName);
const Notifications = namespace(NotificationsModule.vuexName);

/**
 * Component representing an app notification.
 */
@Component({
    components: {
        'plus-icon': PlusIcon,
    },
})
export default class NotificationComponent extends Vue {
    /**
     * Notification to be displayed.
     */
    @Prop() notificationInfo: Notification;

    /**
     * Movement handler, responsible for notification touch events.
     */
    public movementHandler: MovementHandler = new MovementHandler();

    /**
     * Indicator whether mobile mode is active.
     */
    @GeneralParameters.Getter(IS_MOBILE_MODE)
    public isNativeMobileMode: boolean;

    /**
     * Indicator whether force mobile mode is active.
     */
    @GeneralParameters.Getter(IS_FORCE_MOBILE_MODE)
    public isForceMobileMode: boolean;

    /**
     * Indicator whether mobile mode is active (whether it's native of force).
     */
    public get isMobileMode(): boolean {
        return this.isForceMobileMode || this.isNativeMobileMode;
    }

    /**
     * Deletes notification.
     *
     * @param payload                   Action payload.
     * @param payload.id                ID of the notification to be removed.
     */
    @Notifications.Action(DELETE_NOTIFICATION)
    public deleteNotification: ({ id: number }) => void;

    /**
     * Closes notification.
     *
     * @param e                         `mouse` | `touch` event.
     */
    public closeNotification(e: TouchEvent | MouseEvent): void {
        e.stopPropagation();
        this.deleteNotification({ id: this.notificationInfo.id });
    }
    /**
     * Triggers movement handler to start listening to events.
     *
     * @param e                         `touchstart` | `mousedown` event.
     */
    public movementHandlerStart(e: TouchEvent): void {
        if (e.type !== 'touchstart') return;

        this.movementHandler.start(e);
    }

    /**
     * Sets cursor style.
     */
    public startHandler(): void {
        const $el = (this.$el as HTMLElement);
        $el.style.transition = 'unset';
    }

    /**
     * Moves each element of `elementsToMove` according to current finger/cursor
     * position.
     *
     * @param data                      Movement handler data.
     */
    public moveHandler(data: MovementHandlerData): void {
        const { y: dY } = data.diff;
        if (dY > 0) return;
        const $el = (this.$el as HTMLElement);
        $el.style.transform = `translateY(${dY}px)`;
    }

    /**
     * Deletes notification based on `dY`.
     *
     * @param data                      Movement handler data.
     */
    public endHandler(data: MovementHandlerData): void {
        const { y: dY } = data.diff;
        const $el = (this.$el as HTMLElement);
        $el.style.transition = 'all 0.1s ease-out';

        dY > - 20
            ? $el.style.transform = 'translateY(0px)'
            : this.deleteNotification({ id: this.notificationInfo.id });
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to delete notification after
     * 5 seconds.
     */
    public mounted(): void {
        setTimeout(() => {
            this.deleteNotification({ id: this.notificationInfo.id });
        }, 5000);

        this.movementHandler.onStart(this.startHandler.bind(this));
        this.movementHandler.onMove(this.moveHandler.bind(this));
        this.movementHandler.onEnd(this.endHandler.bind(this));
    }
}
