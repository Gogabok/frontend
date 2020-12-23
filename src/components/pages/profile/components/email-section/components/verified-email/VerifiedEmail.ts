import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { OwnEmail } from 'models/Mail';

import PlusIcon from 'components/icons/PlusIcon.vue';
import CheckedIcon from 'components/icons/CheckedIcon.vue';


/**
 * Component, that displays verified email.
 */
@Component({
    components: {
        'checked-icon': CheckedIcon,
        'plus-icon': PlusIcon,
    },
})
export default class VerifiedEmail extends Vue {
    /**
     * Own email object.
     */
    @Prop({
        default: () => ({}),
        type: Object,
    }) email: OwnEmail;

    /**
     * Deletes this exact email.
     */
    public deleteEmail(): void {
        this.$emit('delete-email', { email: this.email });
    }
}
