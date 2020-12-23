import UsersState from 'store/modules/users/state';

import VuexModule from 'store/VuexModule';

import actions from './actions';
import mutations from './mutations';
import getters from './getters';


/**
 * Users Vuex store module with its own state, getters, actions and mutations.
 *
 * @extends VuexModule<UsersState>
 */
export default class UsersModule extends VuexModule<UsersState> {
    /**
     * Name of the module in Vuex store.
     */
    public static readonly vuexName: string = 'users';

    /**
     * Creates user Vuex module, based on predefined class properties.
     */
    public constructor() {
        super();
        this.getters = getters;
        this.actions = actions;
        this.mutations = mutations;
        this.state = new UsersState();
    }
}
