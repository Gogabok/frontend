import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { Notification } from 'models/Notification';

import GeneralParametersModule from 'store/modules/general-parameters';
import NotificationsModule from 'store/modules/notifications';

import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';
import { ADD_NOTIFICATION } from 'store/modules/notifications/actions';
import { GET_NOTIFICATIONS } from 'store/modules/notifications/getters';

import NotificationComponent from 'components/common/notifications/notification-component/NotificationComponent.vue';


const GeneralParameters = namespace(GeneralParametersModule.vuexName);
const Notifications = namespace(NotificationsModule.vuexName);

/**
 * Notifications list containing all recent notifications.
 */
@Component({
    components: {
        'notification-component': NotificationComponent,
    },
})
export default class NotificationsList extends Vue {
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
     * All current app user's recent notifications.
     */
    @Notifications.Getter(GET_NOTIFICATIONS)
    public notifications: Notification[];

    /**
     * Indicator whether mobile mode is active (whether it's native of forced).
     */
    public get isMobileMode(): boolean {
        return this.isForceMobileMode || this.isNativeMobileMode;
    }

    /**
     * Adds notification to store.
     *
     * @param payload                   Action payload.
     * @param payload.notification      Notification object.
     */
    @Notifications.Action(ADD_NOTIFICATION)
    public addNotification: ({ notification: Notification }) => void;
}
