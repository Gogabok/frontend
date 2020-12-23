import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import CheckedIcon from 'components/icons/CheckedIcon.vue';
import PlusIcon from 'components/icons/PlusIcon.vue';
import RotateIcon from 'components/icons/RotateIcon.vue';
import ZoomInIcon from 'components/icons/ZoomInIcon.vue';
import ZoomOutIcon from 'components/icons/ZoomOutIcon.vue';


type Cropper = HTMLElement & {
    setCropBoxData: (props: {
        left: number,
        top: number,
        width: number,
        height: number,
    }) => undefined,
    getCropBoxData: () => ({
        left: number,
        top: number,
        width: number,
        height: number,
    }),
    relativeZoom: (zoomValue: number) => undefined,
    rotate: (deg: number) => undefined,
    reset: () => undefined,
    setData: (data: {
        left: number,
        top: number,
        width: number,
        height: number,
    }) => undefined,
    getData: () => ({
        left: number,
        top: number,
        width: number,
        height: number,
    }),
    destroy: () => undefined,
    getCroppedCanvas: () => HTMLCanvasElement,
};

/**
 * Component allowing user to edit avatar.
 */
@Component({
    components: {
        'accept-icon': CheckedIcon,
        'plus-icon': PlusIcon,
        'rotate-icon': RotateIcon,
        'vue-cropper': () =>
            import(/* webpackPrefetch: true */ 'vue-cropperjs'),
        'zoom-in-icon': ZoomInIcon,
        'zoom-out-icon': ZoomOutIcon,
    },
})
export default class AvatarEditor extends Vue {
    /**
     * Link to the image to be edited.
     */
    @Prop({
        default: '',
        type: String,
    }) imageSrc;

    /**
     * ID of the image to be edited.
     */
    @Prop({
        required: true,
    }) imageId;

    /**
     * Cropper element by ref.
     */
    public get cropper(): Cropper {
        return this.$refs.cropper as Cropper;
    }

    /**
     * Closes avatar editor.
     */
    public close(): void {
        this.$emit('close');
    }

    /**
     * Scales image.
     *
     * @param zoomValue                     Value to zoom for.
     */
    public zoom(zoomValue: number): void {
        this.cropper.relativeZoom(zoomValue);
    }

    /**
     * Rotates image to provided degrees.
     *
     * @param deg                           Amount of degrees to rotate image
     *                                      to.
     */
    public rotate(deg: number): void {
        this.cropper.rotate(deg);
    }

    /**
     * Deletes image data.
     * Also, destroys cropper instance.
     */
    public clearCrop(): void {
        this.cropper.destroy();
    }

    /**
     * Sends `update-avatar` event with updated image data.
     * Also, deletes image data, destroys the cropper and closes the component.
     */
    public acceptCrop(): void {
        this.$emit(
            'update-avatar',
            this.cropper.getCroppedCanvas().toDataURL(),
            this.imageId,
        );
        this.clearCrop();
        this.close();
    }
}
