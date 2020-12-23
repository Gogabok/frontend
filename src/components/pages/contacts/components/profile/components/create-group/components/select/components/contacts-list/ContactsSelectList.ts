import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { Contact } from 'models/Contact';

import ContactPreview from 'components/common/contact/contact-preview/ContactPreview.vue';
import CheckedIcon from 'components/icons/CheckedIcon.vue';
import PlusIcon from 'components/icons/PlusIcon.vue';


/**
 * Contacts select interface. Contains all user's contacts which he can create
 * a group with.
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
     * List of contacts users chose.
     */
    @Prop({
        default: () => ([]),
        type: Array,
    }) chosenContacts: Contact[];

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
     * Chats, sorted alphabetically.
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
     * Chats, filtered by search string.
     */
    public get filteredContacts(): Contact[] {
        return this.contacts.filter(contact => {
            const dName = (contact.name || contact.num).toLowerCase();
            return dName.indexOf(this.searchString) !== -1;
            },
        );
    }

    /**
     * Select/deselect chosen contact.
     *
     * @param contact                   Contact to be selected/deselected.
     */
    public handleContactsClick(contact: Contact): void {
       this.$emit('contact-choose', contact);
    }
}
