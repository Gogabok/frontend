import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { Contact } from 'models/Contact';

import ContactsModule from 'store/modules/contacts';

import { GET_ALL_CONTACTS } from 'store/modules/contacts/getters';

import PlusIcon from 'components/icons/PlusIcon.vue';

import ContactsList from './components/contacts-list/ContactsSelectList.vue';
import SearchBar from './components/search-bar/SearchBar.vue';


const contactsModule = namespace(ContactsModule.vuexName);

/**
 * Component letting user to select contacts he wants to create a group with.
 */
@Component({
    components: {
        'contacts-list': ContactsList,
        'plus-icon': PlusIcon,
        'search-bar': SearchBar,
    },
})
export default class Select extends Vue {
    /**
     * Search string.
     */
    public searchString: string = '';

    /**
     * List of selected contacts.
     */
    public selectedContacts: Contact[] = [];

    /**
     * All contacts of the user.
     */
    @contactsModule.Getter(GET_ALL_CONTACTS)
    public contacts: Contact[];

    /**
     * Indicator whether all contacts are selected.
     */
    public get areAllContactsSelected(): boolean {
        return this.contacts.length === this.selectedContacts.length;
    }

    /**
     * Emits `close` event to close select window.
     */
    public close(): void {
        this.$emit('close');
    }

    /**
     * Creates a group of selected users.
     * Also, navigates to this group.
     */
    public async createChat(): Promise<void> {
        const ids = this.selectedContacts.map(contact => contact.id);
        this.$parent.$emit('create-group', ids);
    }

    /**
     * Synchronizes `searchString` to search input's value.
     *
     * @param searchString              New search string value.
     */
    public updateSearchString(searchString: string): void {
        this.searchString = searchString.toLowerCase();
    }

    /**
     * Selects/deselects user.
     *
     * @param contact                   Contact to be selected or deselected.
     */
    public contactChooseHandler(contact: Contact): void {
        this.selectedContacts.includes(contact)
            ? this.selectedContacts =
                this.selectedContacts.filter(c => contact.id !== c.id)
            : this.selectedContacts.push(contact);
    }

    /**
     * Selects/deselects all contacts.
     */
    public selectAllContacts(): void {
        this.areAllContactsSelected
            ? this.selectedContacts = []
            : this.selectedContacts = this.contacts;
    }
}
