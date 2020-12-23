import actions from 'store/modules/mobile-scroll-controller/actions';
import getters from 'store/modules/mobile-scroll-controller/getters';
import mutations from 'store/modules/mobile-scroll-controller/mutations';
import MobileScrollState from 'store/modules/mobile-scroll-controller/state';
import VuexModule from 'store/VuexModule';


/**
 * MobileScrollController Vuex store module with its own state, getters,
 * actions and mutations.
 *
 * @extends VuexModule<MobileScrollState>
 */
export default
    class MobileScrollController extends VuexModule<MobileScrollState> {

    /**
     * Name of the module in Vuex store.
     */
    public static readonly vuexName: string = 'mobile-scroll-controller';

    /**
     * Creates MobileScrollController Vuex module, based on predefined class
     * properties.
     */
    public constructor() {
        super();
        this.getters = getters;
        this.actions = actions;
        this.mutations = mutations;
        this.state = new MobileScrollState();
    }
}
