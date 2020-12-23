import actions from 'store/modules/call/actions';
import getters from 'store/modules/call/getters';
import mutations from 'store/modules/call/mutations';
import CallState from 'store/modules/call/state';
import VuexModule from 'store/VuexModule';


/**
 * User Vuex store module with its own state, getters, actions and mutations.
 *
 * @extends VuexModule<CallState>
 */
export default class CallModule extends VuexModule<CallState> {

    /**
     * Name of the module in Vuex store.
     */
    public static readonly vuexName: string = 'call';

    /**
     * Creates user Vuex module, based on predefined class properties.
     */
    public constructor() {
        super();
        this.actions = actions;
        this.getters = getters;
        this.mutations = mutations;
        this.state = new CallState();
    }
}
