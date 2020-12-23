import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import GeneralParametersModule from 'store/modules/general-parameters';

import { SET_APP_LOADING_STATE } from 'store/modules/general-parameters/actions';
import { IS_MOBILE_MODE } from 'store/modules/general-parameters/getters';

import AttachIcon from 'components/icons/AttachIcon.vue';
import CameraIcon from 'components/icons/CameraIcon.vue';
import PhotoIcon from 'components/icons/PhotoIcon.vue';
import TransferIcon from 'components/icons/TransferIcon.vue';

import MenuItem from './components/menu-item/MenuItem.vue';


const generalParameters = namespace(GeneralParametersModule.vuexName);

/**
 * Attachments panel component.
 */
@Component({
    components: {
        'attach-icon': AttachIcon,
        'camera-icon': CameraIcon,
        'menu-item': MenuItem,
        'photo-icon': PhotoIcon,
        'transfer-icon': TransferIcon,
    },
})
export default class AttachmentsPanel extends Vue {
    /**
     * Indicator whether panel is open or not.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isVisible;

    /**
     * Indicator whether message translation is active.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isPayedDialog;

    /**
     * Photo image file container.
     */
    public image: File;

    /**
     * Photo image file link.
     */
    public imageSrc: string = '';

    /**
     * Indicator whether mobile mode is on.
     */
    @generalParameters.Getter(IS_MOBILE_MODE)
    public isMobileMode: boolean;

    /**
     * Sets app loading state.
     *
     * @param payload                   Action parameters.
     * @param payload.isLoading         Indicator whether app is loading.
     */
    @generalParameters.Action(SET_APP_LOADING_STATE)
    public setAppLoadingStateAction: (payload: {
        isLoading: boolean,
    }) => Promise<void>;

    /**
     * Sets app loading state.
     *
     * @param value                     New app loading state.
     */
    public setUploadingState(value: boolean): void {
        this.setAppLoadingStateAction({ isLoading: value });
    }

    /**
     * Emits `open-camera` event to open camera interface to chosen type.
     *
     * @param type                      Camera interface type to be open
     *                                  (`video`|`photo`).
     */
    public openCamera(type: string): void {
        this.$emit('open-camera', type);
        this.close();
    }

    /**
     * Activates message translation feature.
     */
    public handleMobileTranslate(): void {
        this.handleTransaction();
        this.close();
    }

    /**
     * Handles uploading files from the device.
     */
    public fileClick(): void {
        (this.$refs.file as HTMLElement).click();
    }

    /**
     * Closes the attachments panel.
     */
    public close(): void {
        this.$emit('close');
    }

    /**
     * Toggles translation feature interface.
     * Also, closes the attachments panel.
     */
    public handleTransaction(): void {
        this.$emit('toggle-transaction', this.isPayedDialog);
        this.close();
    }

    /**
     * Closes the attachments panel if click event target is not a cross icon or
     * doesn't contain 'no-close' tag.
     *
     * @param event                     `click` event.
     */
    public closeClickHandler(event: MouseEvent): void {
        const targetToCompare =
            document.querySelector('.input__emoji-plus');
        if (!(
            targetToCompare
            && targetToCompare.contains(event.target as Node)
            || (event.target as HTMLElement).classList.contains('no-close'))
        ) {
            this.close();
        }
    }

    /**
     * Handles take photo action.
     *
     * @param                           `input` event.
     */
    public photoChange(input: InputEvent): void {
        const target = input.target as HTMLInputElement;
        if(!target) return;

        this.image = (<FileList>target.files)[0];
        this.$parent.$emit('add-file', this.image);
    }

    /**
     * Handles uploading files from the device.
     *
     * @param input                     File upload event.
     */
    public fileChange(input: InputEvent): void {
        const target = input.target as HTMLInputElement;
        if(!target) return;
        const filesAmount = (<FileList>target.files).length;
        if(filesAmount == 0) return;

        for (let i = 0; i < filesAmount; i++) {
            const file = (<FileList>target.files)[i];
            this.$parent.$emit('add-file', file, i + 1, filesAmount);
        }
        this.close();
    }

    /**
     * Hooks the `mounted` Vue lifecycle stage to add event listener that will
     * close the panel on click outside of it.
     */
    public mounted(): void {
        this.$parent.$on('upload-ended', this.setUploadingState);
        document.addEventListener('click', this.closeClickHandler);
    }

    /**
     * Hooks the `mounted` Vue lifecycle stage to remove event listener that
     * will close the panel on click outside of it.
     */
    public beforeDestroy(): void {
        document.removeEventListener('click', this.closeClickHandler);
        (this.$refs.filePhoto as HTMLInputElement).value = '';
        (this.$refs.file as HTMLInputElement).value = '';
        (this.$refs.fileVideo as HTMLInputElement).value = '';
    }
}
