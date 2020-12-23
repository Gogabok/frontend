import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { CurrentUser } from 'models/CurrentUser';
import { User } from 'models/User';

import ContactsModule from 'store/modules/contacts';
import UserModule from 'store/modules/user';

import { GET_ALL_CONTACTS } from 'store/modules/contacts/getters';
import { GET_USER_DATA } from 'store/modules/user/getters';

import Footer from './components/footer/Footer.vue';
import SearchBar from './components/search-bar/SearchBar.vue';
import UsersList from './components/users-list/UsersList.vue';


const contactsModule = namespace(ContactsModule.vuexName);
const userModule = namespace(UserModule.vuexName);

/**
 * Component allowing user to invite a new user to join the call.
 */
@Component({
    components: {
        'footer-bar': Footer,
        'search-bar': SearchBar,
        'users-list': UsersList,
    },
})
export default class Forward extends Vue {
    /**
     * Contacts to forward to.
     */
    public selectedUsers: User[] = [];

    /**
     * Search string.
     */
    public searchString: string = '';

    /**
     * User's contacts.
     */
    @contactsModule.Getter(GET_ALL_CONTACTS)
    public users: User[];

    /**
     * Current user account information.
     */
    @userModule.Getter(GET_USER_DATA)
    public userData: CurrentUser;

    /**
     * Sets search string value.
     *
     * @param newSearchString           New search string value.
     */
    public updateSearchString(newSearchString: string): void {
        this.searchString = newSearchString;
    }

    /**
     * Closes interface.
     */
    public closeHandler(): void {
        this.$emit('close');
    }

    /**
     * Adds or removes contacts from `selectedUsers`.
     *
     * @param contact                   Contact to be added or removed.
     */
    public userChooseHandler(contact: User): void {
        this.selectedUsers.includes(contact)
            ? this.selectedUsers =
                this.selectedUsers.filter(c => c.id !== contact.id)
            : this.selectedUsers.push(contact);
    }

    /**
     * Selects or deselects all contacts.
     */
    public selectAllUsersHandler(): void {
        this.users.length === this.selectedUsers.length
            ? this.selectedUsers = []
            : this.selectedUsers = this.users;
    }

    /**
     * Sends selected items to chosen contacts with comment provided.
     */
    public sendHandler(): void {
        this.$emit('add-participants', this.selectedUsers.map(({ id }) => id));
        this.closeHandler();
    }
}
