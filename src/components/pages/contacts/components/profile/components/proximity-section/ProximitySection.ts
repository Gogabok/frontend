import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { Contact } from 'models/Contact';
import { User } from 'models/User';

import AddContactIcon from 'components/icons/AddContact.vue';
import DeleteContactIcon from 'components/icons/DeleteContactIcon.vue';
import StarIcon from 'components/icons/StarIcon.vue';
import ProfileItem from 'components/pages/contacts/components/profile/components/profile-item/ProfileItem.vue';


/**
 * Component letting user to add/remove the profile owner from a contacts list.
 *
 * Also, let's user to change profile owner's `isFavorite` state.
 */
@Component({
    components: {
        'add-contact-icon': AddContactIcon,
        'delete-contact-icon': DeleteContactIcon,
        'profile-item': ProfileItem,
        'star-icon': StarIcon,
    },
})
export default class ProximitySection extends Vue {
    /**
     * Profile owner.
     */
    @Prop({ required: true }) profileOwner: User | Contact;

    /**
     * Indicator whether profile's owner is in user's contacts list.
     */
    @Prop({ required: true }) isContact: boolean;

    /**
     * Label for `add-to-contacts` button.
     */
    public get contactsStateLabel(): string {
        return this.isContact
            ? 'Delete from contacts'
            : 'Add to contacts';
    }

    /**
     * Label for `add-to-favorites` button.
     */
    public get favoriteStateLabel(): string {
        if (!this.isContact) return '';
        return (this.profileOwner as Contact).isFavorite
            ? 'Remove from favorites'
            : 'Add to favorites';
    }
    /**
     * Adds/removes user from the current user's contacts list.
     */
    public toggleContactState(): void {
        this.$emit('toggle-contact-state');
    }

    /**
     * Toggles contact's favorite state.
     */
    public toggleFavoriteState(): void {
       this.$emit('toggle-favorite-state');
    }
}
