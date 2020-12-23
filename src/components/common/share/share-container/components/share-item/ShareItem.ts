import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { copyTextToClipboard } from 'utils/clipboard';

import { PopupAlign, PopupSettings, PopupType } from 'models/PopupSettings';

import PopupModule from 'store/modules/popup';

import { OPEN_POPUP } from 'store/modules/popup/actions';

import AngleIcon from 'components/icons/AngleIcon.vue';
import CopyIcon from 'components/icons/CopyIcon.vue';


const popupModule = namespace(PopupModule.vuexName);

/**
 * Share item component.
 */
@Component({
    components: {
        'angle-icon': AngleIcon,
        'copy-icon': CopyIcon,
    },
})
export default class ShareItem extends Vue {
    /**
     * Data to be displayed.
     */
    @Prop({ default: '' }) data: string

    /**
     * Item label.
     */
    @Prop({ default: '' }) label: string

    /**
     * Item description.
     */
    @Prop({ default: '' }) description: string;

    /**
     * Indicator whether item is expanded to let user read its description.
     */
    public isExpanded: boolean = false;

    /**
     * Sets `isExpanded` state.
     *
     * @param value                     State to be set.
     */
    public setIsExpanded(value: boolean): void {
        this.isExpanded = value;
    }

    /**
     * Copies `data` to clipboard.
     */
    public copyInput(): void {
        copyTextToClipboard(this.data);
        this.$parent.$emit('close-share');

        this.openPopup({
            settings: {
                align: {
                    horizontal: PopupAlign.Center,
                    vertical: PopupAlign.Center,
                },
                position: {
                    bottom: 55,
                    left: 0,
                    right: 0,
                    top: 0,
                },
                type: PopupType.Alert,
            },
            text: 'Скопировано в буфер обмена',
        });
    }

    /**
     * Opens popup.
     *
     * @param payload                   Action parameters.
     * @param payload.text              Text to be displayed on the popup.
     * @param payload.settings          Popup settings.
     */
    @popupModule.Action(OPEN_POPUP)
    public openPopup: (payload: {
        text: string,
        settings: PopupSettings,
    }) => void;
}
