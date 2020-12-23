import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { Contact } from 'models/Contact';
import { User } from 'models/User';

import ContactPreview from 'components/common/contact/contact-preview/ContactPreview.vue';
import PlusIcon from 'components/icons/PlusIcon.vue';
import CheckedIcon from 'components/icons/CheckedIcon.vue';


/**
 * Forward interface contacts list.
 * Contains all user's contacts to whom user can forward message or media object
 * to.
 */
@Component({
    components: {
        'checked-icon': CheckedIcon,
        'contact-preview': ContactPreview,
        'plus-icon': PlusIcon,
    },
})
export default class ContactsSelectList extends Vue {
    /**
     * List of chosen contacts.
     */
    @Prop({
        default: () => ([]),
        type: Array,
    }) chosenContacts: Contact[];

    /**
     * List of chat participants.
     */
    @Prop({ required: true }) participants: User[];

    /**
     * Search string.
     */
    @Prop({
        default: '',
        type: String,
    }) searchString;

    /**
     * List of contacts to be displayed.
     */
    @Prop({
        default: () => ([]),
        type: Array,
    }) contacts;

    /**
     * Alphabet array.
     */
    public alphabetArray: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');

    /**
     * Contacts, sorted alphabetically.
     */
    public get sortedContacts(): Record<string, Contact[]> {
        const alphabet = {};
        this.filteredContacts.forEach(contact => {
            const firstNameLetter = (contact.name || contact.num)
                .toLowerCase()
                .split('')[0];

            if(!alphabet[firstNameLetter]) {
                alphabet[firstNameLetter] = [];
            }
            alphabet[firstNameLetter].push(contact);
        });
        return alphabet;
    }

    /**
     * Contacts, filtered by search string.
     */
    public get filteredContacts(): Contact[] {
        return this.contacts.filter(contact => {
            const dName = (contact.name || contact.num).toLowerCase();
            return dName.indexOf(this.searchString) !== -1;
            },
        );
    }

    /**
     * Selects/deselects chosen contact by emitting `contact-choose` event.
     *
     * @param contact                   Contact to be selected/deselected.
     */
    public handleContactsClick(contact: Contact): void {
       this.$emit('contact-choose', contact);
    }
}
