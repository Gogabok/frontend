import { IPopup } from 'models/PopupSettings';


/**
 * Vuex popup state.
 */
export default class PopupState {
    /**
     * Popups list.
     */
    public popups: IPopup[];

    constructor() {
        this.popups = [];
    }
}
