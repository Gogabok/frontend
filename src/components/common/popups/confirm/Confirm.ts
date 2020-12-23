import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { Popup } from 'models/PopupSettings';

import GeneralParametersModule from 'store/modules/general-parameters';
import PopupModule from 'store/modules/popup';

import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';
import {
    POPUP_AGREE,
    REMOVE_POPUP,
} from 'store/modules/popup/actions';

import AcceptIcon from 'components/icons/CheckedIcon.vue';
import PlusIcon from 'components/icons/PlusIcon.vue';


const generalParametersModule = namespace(GeneralParametersModule.vuexName);
const popupModule = namespace(PopupModule.vuexName);

/**
 * Confirmation popup component.
 */
@Component({
    components: {
        'accept-icon': AcceptIcon,
        'plus-icon': PlusIcon,
    },
})
export default class Confirm extends Vue {
    /**
     * Popup object.
     */
    @Prop({ default: {} }) popup: Popup;

    /**
     * Indicator whether force mobile mode is active.
     */
    @generalParametersModule.Getter(IS_FORCE_MOBILE_MODE)
    public isForceMobileMode: boolean;

    /**
     * Indicator whether native mobile mode is active.
     */
    @generalParametersModule.Getter(IS_MOBILE_MODE)
    public isNativeMobileMode: boolean;

    /**
     * Indicator whether mobile mode is active (whether it's native or forced).
     */
    public get isMobileMode(): boolean {
        return this.isNativeMobileMode || this.isForceMobileMode;
    }

    /**
     * Closes confirmation popup.
     * Also, calls confirm callback if it's provided.
     *
     * @param payload                   Action parameters.
     * @param payload.id                ID of the popup to be confirmed.
     */
    @popupModule.Action(POPUP_AGREE)
    public confirmHandler: (payload: {
        id: string,
    }) => void;

    /**
     * Removes popup from popups list.
     *
     * @param payload                   Action parameters.
     * @param payload.id                ID of the popup to be removed.
     */
    @popupModule.Action(REMOVE_POPUP)
    public removePopup: (payload: {
        id: string,
    }) => void;
}
