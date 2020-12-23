import actions from 'store/modules/chats/actions';
import mutations from 'store/modules/chats/mutations';
import getters from 'store/modules/chats/getters';
import MessagesState from 'store/modules/chats/state';
import VuexModule from 'store/VuexModule';

export default class ChatsModule extends VuexModule<MessagesState> {
    /**
     * Name of the module in Vuex store.
     */
    public static readonly vuexName: string = 'chats-module';

    /**
     * Creates user Vuex module, based on predefined class properties.
     */
    constructor() {
        super();

        this.actions = actions;
        this.getters = getters;
        this.mutations = mutations;
        this.state = new MessagesState();
    }
}
