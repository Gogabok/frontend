import actions from 'store/modules/profile/actions';
import getters from 'store/modules/profile/getters';
import mutations from 'store/modules/profile/mutations';
import ProfileState from 'store/modules/profile/state';
import VuexModule from 'store/VuexModule';


/**
 * User Vuex store module with its own state, getters, actions and mutations.
 *
 * @extends VuexModule<ProfileState>
 */
export default class Profile extends VuexModule<ProfileState> {

    /**
     * Name of the module in Vuex store.
     */
    public static readonly vuexName: string = 'profile';

    /**
     * Creates user Vuex module, based on predefined class properties.
     */
    public constructor() {
        super();
        this.getters = getters;
        this.actions = actions;
        this.mutations = mutations;
        this.state = new ProfileState();
    }
}
