import { ChatPartial } from 'models/Chat';


/**
 * Chats Vuex state.
 */
export default class ChatsState {
    /**
     * User's chats list.
     */
    public chats: ChatPartial[];

    /**
     * Indicator whether app data were synchronized to server data.
     */
    public isFetched: boolean;

    /**
     * Creates chats Vuex module, based on predefined class properties.
     */
    constructor() {
        this.chats = [];
        this.isFetched = false;
    }
}
