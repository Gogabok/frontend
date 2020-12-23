import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import PlusIcon from 'components/icons/PlusIcon.vue';


/**
 * Component allowing user to send invitations or close the invitation
 * interface.
 */
@Component({
    components: {
        'plus-icon': PlusIcon,
    },
})
export default class Footer extends Vue {
    /**
     * Cancels invitation and closes the invitation interface.
     */
    public close(): void {
        this.$emit('close');
    }

    /**
     * Sends invitations to selected users and closes invitation interface.
     */
    public confirm(): void {
        this.$emit('confirm');
        this.close();
    }
}
