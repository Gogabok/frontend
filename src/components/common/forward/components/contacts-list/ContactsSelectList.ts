import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { Contact } from 'models/Contact';

import Contacts from 'store/modules/contacts';

import { GET_ALL_CONTACTS } from 'store/modules/contacts/getters';

import ContactPreview from 'components/common/contact/contact-preview/ContactPreview.vue';
import PlusIcon from 'components/icons/PlusIcon.vue';
import CheckedIcon from 'components/icons/CheckedIcon.vue';


const contactsModule = namespace(Contacts.vuexName);

/**
 * Forward interface contacts list. Contains all user's contacts to whom user
 * can forward message or media object to.
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
     * List of contacts users choose.
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
     * All contacts of the user.
     */
    @contactsModule.Getter(GET_ALL_CONTACTS)
    public contacts: Contact[];

    /**
     * Contacts, sorted alphabetically.
     */
    public get sortedContacts(): {[key: string]: Contact[]} {
        const alphabet: {[key: string]: Contact[]} = {};
        this.filteredContacts.forEach(contact => {
            const firstNameLetter = contact.num.toLowerCase().split('')[0];
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
        return this.contacts.filter(contact =>
            contact.num.indexOf(this.searchString) !== -1
            || (contact.name && contact.name.indexOf(this.searchString) !== -1),
        );
    }

    /**
     * Alphabet array.
     */
    public alphabetArray: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');

    /**
     * Selects/deselects chosen contact.
     *
     * @param contact                   Contact to be selected/deselected.
     */
    public handleContactsClick(contact: Contact): void {
       this.$emit('contact-choose', contact);
    }
}
