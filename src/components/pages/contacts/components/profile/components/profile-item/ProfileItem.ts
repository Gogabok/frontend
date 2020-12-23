import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import Angle from 'components/icons/AngleIcon.vue';


/**
 * Component representing a profile item.
 */
@Component({
    components: {
        'angle-icon': Angle,
    },
})
export default class ProfileItem extends Vue {
    /**
     * Item's label.
     */
    @Prop({
        default: '',
        type: String,
    }) label;

    /**
     * Item's sub-label.
     */
    @Prop({
        default: '',
        type: String,
    }) cost;

    /**
     * Emits `on-click` event to the parent component.
     */
    public clickHandler(): void {
        this.$emit('on-click');
    }
}
