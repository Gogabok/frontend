import actions from 'store/modules/popup/actions';
import getters from 'store/modules/popup/getters';
import PopupState from 'store/modules/popup/state';
import mutations from 'store/modules/popup/mutations';
import VuexModule from 'store/VuexModule';


/**
 * Popup Vuex module.
 */
export default class Popup extends VuexModule<PopupState> {
    /**
     * Name of the module in Vuex store.
     */
    public static readonly vuexName: string = 'popup';

    /**
     * Creates confirm Vuex module, based on predefined class properties.
     */
    public constructor() {
        super();
        this.actions = actions;
        this.getters = getters;
        this.mutations = mutations;
        this.state = new PopupState();
    }

}
