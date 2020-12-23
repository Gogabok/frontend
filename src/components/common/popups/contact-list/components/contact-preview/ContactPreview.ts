import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { Contact } from 'models/Contact';

import CheckedIcon from 'components/icons/CheckedIcon.vue';


/**
 * Contact preview component.
 */
@Component({
    components: {
        'checked-icon': CheckedIcon,
    },
})
export default class ContactPreview extends Vue {
    /**
     * Contact data.
     */
    @Prop({ default: {} }) contact: Contact;

    /**
     * Indicator whether contact is disabled, so cannot be selected or
     * deselected.
     */
    @Prop({ default: false }) isDisabled: boolean;

    /**
     * Indicator whether contact is selected.
     */
    @Prop({ default: false }) isSelected: boolean;

    /**
     * Selects contact if it's not disabled.
     */
    public selectContact(): void {
        if(this.isDisabled) return;
        this.$emit('select', this.contact);
    }
}
