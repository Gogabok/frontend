import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import AddContactIcon from 'components/icons/AddContact.vue';
import RemoveContactIcon from 'components/icons/DeleteContactIcon.vue';
import Action from 'components/pages/contacts/components/own-profile/components/action/Action.vue';


/**
 * Component allowing user to add or remove its own profile from contacts.
 */
@Component({
    components: {
        'action': Action,
    },
})
export default class ContactAction extends Vue {
    /**
     * Indicator whether user's account is in its contacts list.
     */
    @Prop() isContact: boolean;

    /**
     * Add contact icon.
     */
    public AddContactIcon = AddContactIcon;

    /**
     * Delete contact icon.
     */
    public DeleteContactIcon = RemoveContactIcon;

    /**
     * Emits `remove-from-contacts` or `add-to-contacts` action to remove or add
     * user's account to its contacts list respectively.
     */
    public contactAction(): void {
        this.isContact
            ? this.$emit('remove-from-contacts')
            : this.$emit('add-to-contacts');
    }
}
