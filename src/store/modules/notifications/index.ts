import actions from 'store/modules/notifications/actions';
import getters from 'store/modules/notifications/getters';
import NotificationsState from 'store/modules/notifications/state';
import mutations from 'store/modules/notifications/mutations';
import VuexModule from 'store/VuexModule';


/**
 * Notifications Vuex module.
 */
export default class Notifications extends VuexModule<NotificationsState> {
    /**
     * Name of the module in Vuex store.
     */
    public static readonly vuexName: string = 'notifications';

    /**
     * Creates notifications Vuex module, based on predefined class properties.
     */
    public constructor() {
        super();
        this.actions = actions;
        this.getters = getters;
        this.mutations = mutations;
        this.state = new NotificationsState();
    }

}
