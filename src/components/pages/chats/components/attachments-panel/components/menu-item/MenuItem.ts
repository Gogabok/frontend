import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import Angle from 'components/icons/Angle.vue';


/**
 * Attachments panel element with icon and label.
 */
@Component({
    components: {
        'angle': Angle,
    },
})
export default class MenuItem extends Vue {
    /**
     * Label of the menu element.
     */
    @Prop({
        default: '',
        type: String,
    }) text;

    /**
     * Indicator whether menu should still be opened after clicking the element.
     */
    @Prop({
        default: false,
        type: undefined,
    }) noclose;

    /**
     * Emits click event.
     */
    public clickHandler(): void {
        this.$emit('on-click');
    }
}
