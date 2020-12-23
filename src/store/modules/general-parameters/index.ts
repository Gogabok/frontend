import actions from 'store/modules/general-parameters/actions';
import getters from 'store/modules/general-parameters/getters';
import GeneralParametersState from 'store/modules/general-parameters/state';
import mutations from 'store/modules/general-parameters/mutations';
import VuexModule from 'store/VuexModule';


export default class GeneralParameters
    extends VuexModule<GeneralParametersState> {

    /**
     * Name of the module in Vuex store.
     */
    public static readonly vuexName: string = 'general-parameters';

    /**
     * Creates user Vuex module, based on predefined class properties.
     */
    public constructor() {
        super();
        this.actions = actions;
        this.getters = getters;
        this.mutations = mutations;
        this.state = new GeneralParametersState();
    }

}
