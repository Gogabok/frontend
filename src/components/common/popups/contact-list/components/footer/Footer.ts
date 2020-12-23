import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import PlusIcon from 'components/icons/PlusIcon.vue';
import SendMessageIcon from 'components/icons/SendMessageIcon.vue';


/**
 * Contacts list popup footer component.
 */
@Component({
    components: {
        'plus-icon': PlusIcon,
        'send-message-icon': SendMessageIcon,
    },
})
export default class Footer extends Vue {
    /**
     * Indicator whether any contact is selected.
     */
    @Prop({ default: false }) isAnyContactSelected: boolean;

    /**
     * Resizes textarea on input.
     */
    public autoResize(e: Event, maxHeight: number): void {
        const eventTarget = e.target as HTMLElement;
        if (eventTarget.scrollHeight <= maxHeight) {
            eventTarget.style.height = 'auto';
            eventTarget.style.height = `${eventTarget.scrollHeight}px`;
            const contactsBody = this.$refs.contactsBody as HTMLElement;
            contactsBody.style.bottom = `${eventTarget.scrollHeight + 20}px`;
        }
    }

    /**
     * Calls contacts list callback.
     */
    public sendHandler(): void {
        if (!this.isAnyContactSelected) return;
        this.$emit('accept');
    }
}
