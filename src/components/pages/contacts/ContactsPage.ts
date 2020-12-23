import { mixins } from 'vue-class-component';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { Chat } from 'models/Chat';
import { ContactCard } from 'models/ContactCard';
import { CurrentUser } from 'models/CurrentUser.ts';
import { User } from 'models/User';

import SwipeMenu from 'mixins/swipe-menu';

import ChatsModule from 'store/modules/chats';
import GeneralParameters from 'store/modules/general-parameters';
import UserModule from 'store/modules/user';
import UsersModule from 'store/modules/users';

import { CREATE_GROUP } from 'store/modules/chats/actions';
import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';
import {
    SET_USER_CONTACT_STATE,
    SET_USER_FAVORITE_STATE,
} from 'store/modules/user/actions';
import { GET_USER_CONTACTS, GET_USER_DATA } from 'store/modules/user/getters';
import { GET_USER_BY_ID } from 'store/modules/users/getters';

import ContactsMenu from './components/contacts-list/ContactMenu.vue';
import Profile from './components/profile/Profile.vue';


const usersModule = namespace(UsersModule.vuexName);
const userModule = namespace(UserModule.vuexName);
const chatsModule = namespace(ChatsModule.vuexName);
const generalParameters = namespace(GeneralParameters.vuexName);

/**
 * Component representing a contacts page.
 */
@Component({
    components: {
        'contacts-menu': ContactsMenu,
        'profile': Profile,
    },
})
export default class ContactsPage extends mixins(SwipeMenu) {
    /**
     * Last selected contact ID.
     */
    public selectedChatId: string = '';

    /**
     * List of all user's chats.
     */
    @userModule.Getter(GET_USER_CONTACTS)
    public contactsIds: string[];

    /**
     * Current app user account information.
     */
    @userModule.Getter(GET_USER_DATA)
    public currentUserInfo: CurrentUser;

    /**
     * Gathers user's information by ID.
     *
     * @param payload                   Getter parameters.
     * @param payload.id                ID of the user to gather information of
     *                                  which.
     */
    @usersModule.Getter(GET_USER_BY_ID)
    public getContactById: (payload: { id: string }) => User | Chat | null;

    /**
     * Indicator whether mobile mode is active.
     */
    @generalParameters.Getter(IS_MOBILE_MODE)
    public isNativeMobileMode: boolean;

    /**
     * Indicator whether force mobile mode is active
     */
    @generalParameters.Getter(IS_FORCE_MOBILE_MODE)
    public isForceMobileMode: boolean;

    /**
     * Indicator whether mobile mode is active (whether it's forced or native).
     */
    public get isMobileMode(): boolean {
        return this.isNativeMobileMode || this.isForceMobileMode;
    }

    /**
     * List of user's contacts wrapped in `ContactCard`.
     */
    public get contacts(): ContactCard[] {
        return <ContactCard[]>this.contactsIds
            .map(contactId => {
                const contact = this.getContactById({ id: contactId });
                if(!contact) return null;
                return new ContactCard(contact);
            })
            .filter(contact => contact !== null);
    }

    /**
     * Sets contact's favorite state.
     *
     * @param payload                   Action parameters.
     * @param payload.id                ID of the user to be added/removed from
     *                                  favorites.
     * @param payload.isFavorite        Indicator whether user is favorite.
     */
    @userModule.Action(SET_USER_FAVORITE_STATE)
    public setContactFavoriteState: (payload: {
        id: string,
        isFavorite: boolean,
        to: number,
    }) => Promise<void>;

    /**
     * Sets user's contact state.
     *
     * @param payload                   Action parameters.
     * @param payload.id                ID of the user to be added/removed from
     *                                  contacts.
     * @param payload.isFavorite        Indicator whether user is in contacts
     *                                  list.
     */
    @userModule.Action(SET_USER_CONTACT_STATE)
    public setContactState: (payload: {
        id: string,
        isContact: boolean,
    }) => Promise<void>;

    /**
     * Creates group chat.
     *
     * @param payload                   Action parameters.
     * @param payload.ids               List of users ids to create chat with.
     */
    @chatsModule.Action(CREATE_GROUP)
    public createGroupChatAction: (payload: { ids: string[] }) => Promise<void>;

    /**
     * Deletes provided contacts.
     *
     * @param selectedContacts          Contacts to be removed.
     */
    public deleteContacts(selectedContacts: Array<User | Chat>): void {
        selectedContacts.forEach(contact => this.setContactState({
            id: contact.id,
            isContact: false,
        }));
    }

    /**
     * Adds provided contacts to list of favorites.
     *
     * @param selectedContacts          List of contacts to be added to
     *                                  favorites list.
     */
    public setContactsFavorite(selectedContacts: Array<User | Chat>): void {
        selectedContacts.forEach(contact => this.setContactFavoriteState({
            id: contact.id,
            isFavorite: true,
            to: 0,
        }));
    }

    /**
     * Removes provided contacts from list of favorites.
     *
     * @param selectedContacts          List of contacts to be added to
     *                                  favorites list.
     */
    public deleteContactsFavorite(selectedContacts: Array<User | Chat>): void {
        selectedContacts.forEach(contact => this.setContactFavoriteState({
            id: contact.id,
            isFavorite: false,
            to: 0,
        }));
    }

    /**
     * Creates groups chat consisting from provided contacts.
     *
     * @param selectedContacts          List of contacts to create chat with.
     */
    public createGroupChat(selectedContacts: User[]): void {
        this.createGroupChatAction({
            ids: selectedContacts.map(({ id }) => id),
        });
    }
}
