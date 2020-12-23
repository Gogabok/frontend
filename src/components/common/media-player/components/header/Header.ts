import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import AngleIcon from 'components/icons/AngleIcon.vue';
import CheckedIcon from 'components/icons/CheckedIcon.vue';


/**
 * Media player header component that allows user to toggle between slider and
 * media line modes.
 * Also, it let's to close media player.
 */
@Component({
    components: {
        'angle-icon': AngleIcon,
        'checked-icon': CheckedIcon,
    },
})
export default class VideoPlayerHeader extends Vue {
    /**
     * Indicator whether media line mode is active.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isMediaLineMode;

    /**
     * Indicator whether select mode is active.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isSelectMode;

    /**
     * Indicator whether all messages are selected.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isAllMessagesChecked;

    /**
     * Handles click events on control button.
     */
    public controlClickHandler(): void {
        if(!this.isMediaLineMode) {
            this.setMediaLineMode(true);
        } else {
            this.setSelectMode(!this.isSelectMode);
        }
    }

    /**
     * Sets select mode state.
     *
     * @param value     New state of select mode.
     */
    public setSelectMode(value: boolean): void {
        this.$emit('set-select-mode', value);
    }

    /**
     * Checks/unchecks all messages.
     */
    public handleCheckAll(): void {
        this.$emit('check-all');
    }

    /**
     * Closes video player.
     */
    public closeHandler(): void {
        this.$emit('close');
    }

    /**
     * Sets media line mode state.
     *
     * @param value     New state of the media line mode.
     */
    public setMediaLineMode(value: boolean): void {
        this.$emit('set-media-line-mode', value);
    }
}
