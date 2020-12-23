import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { MovementHandler, MovementHandlerData } from 'utils/moveHandler';

import { Chat } from 'models/Chat';
import { ContactsListPopup } from 'models/PopupSettings';
import { User } from 'models/User';

import ChatsModule from 'store/modules/chats';
import GeneralParameters from 'store/modules/general-parameters';
import PopupModule from 'store/modules/popup';
import UserModule from 'store/modules/user';
import UsersModule from 'store/modules/users';

import { GET_CHAT_BY_ID } from 'store/modules/chats/getters';
import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';
import {
    POPUP_AGREE,
    REMOVE_POPUP,
} from 'store/modules/popup/actions';
import { GET_USER_CONTACTS } from 'store/modules/user/getters';
import { GET_USER_BY_ID } from 'store/modules/users/getters';

import ItemsGroup from 'components/common/menu/page-side-menu/items-group/ItemsGroup.vue';

import ListFooter from './components/footer/Footer.vue';
import ListHeader from './components/header/Header.vue';
import ContactCard from './components/contact-preview/ContactPreview.vue';


type Contact = User | Chat;

const userModule = namespace(UserModule.vuexName);
const generalParametersModule = namespace(GeneralParameters.vuexName);
const popupModule = namespace(PopupModule.vuexName);
const usersModule = namespace(UsersModule.vuexName);
const chatsModule = namespace(ChatsModule.vuexName);

/**
 * Component that allows user to select contacts from his address book.
 */
@Component({
    components: {
        'contact-card': ContactCard,
        'contacts-group': ItemsGroup,
        'list-footer': ListFooter,
        'list-header': ListHeader,
    },
})
export default class ContactList extends Vue {
    /**
     * Popup object.
     */
    @Prop({ default: {} }) popup: ContactsListPopup;

    /**
     * Search request debounce interval.
     */
    public debounceInterval: number | null = null;

    /**
     * Timestamp of last search string change.
     */
    public lastSearchStringUpdateTime: number;

    /**
     * Search request debounce time.
     */
    public readonly searchDebounceTime: number = 400;

    /**
     * Global search information.
     * - data: data fetched from the server.
     * - fetched: Indicator whether app got response from the server.
     * - lastRequest: Last search string request, sent to server.
     */
    public globalSearchResult: {
        data: {
            exact: Contact[],
            similar: Contact[],
        },
        lastRequest: string,
        fetched: boolean,
    } = {
        data: {
            exact: [],
            similar: [],
        },
        fetched: false,
        lastRequest: '',
    };

    /**
     * Movement handler, responsible for notification touch events.
     */
    public movementHandler: MovementHandler = new MovementHandler();

    /**
     * Alphabet array.
     */
    public alphabetArray: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');

    /**
     * Contacts list search value.
     */
    public searchString: string = '';

    /**
     * List of chosen contacts.
     */
    public selectedContacts: Contact[] = [];

    /**
     * List of IDs that are selected and cannot be deselected.
     */
    public preselectedDisabledContacts: Contact[] = [];

    /**
     * Indicator whether mobile mode is active.
     */
    @generalParametersModule.Getter(IS_MOBILE_MODE)
    public isNativeMobileMode: boolean;

    /**
     * Indicator whether force mobile mode is active.
     */
    @generalParametersModule.Getter(IS_FORCE_MOBILE_MODE)
    public isForceMobileMode: boolean;

    /**
     * List of all user's contacts' IDs.
     */
    @userModule.Getter(GET_USER_CONTACTS)
    public contactsIds: string[];

    /**
     * Gathers user's information by its ID.
     */
    @usersModule.Getter(GET_USER_BY_ID)
    public getUserById: (payload: { id: string }) => User | null;

    /**
     * Gathers chat's information by its id.
     */
    @chatsModule.Getter(GET_CHAT_BY_ID)
    public getChatById: (payload: { id: string }) => Chat | null;

    /**
     * List of contacts to be displayed.
     */
    public get contacts(): User[] {
        return <User[]>this.contactsIds
            .map(id => this.getUserById({ id }) || this.getChatById({ id }))
            .filter(Boolean);
    }

    /**
     * Indicator whether it's mobile mode (whether it's forced or native).
     */
    public get isMobileMode(): boolean {
        return this.isNativeMobileMode || this.isForceMobileMode;
    }

    /**
     * Chats body element.
     */
    public get contactsBody(): HTMLElement {
        return this.$refs.contactsBody as HTMLElement;
    }

    /**
     * List of user's contacts which contain search string.
     */
    public get filteredContacts(): Contact[] {
        type paramType = string | null;

        return this.contacts.filter(
            contact => {
                const set: paramType[] = [
                    contact.name,
                    contact.num,
                ].filter(Boolean) as string[];
                return set.some(
                    param => (param as string)
                        .toLowerCase()
                        .indexOf(this.searchString) !== -1,
                );
            },
        );
    }

    /**
     * List of contacts, sorted alphabetically.
     */
    public get sortedContacts(): {[key: string]: Contact[]} {
        const contacts = {};
        this.filteredContacts.forEach(contact => {
            const firstNameLetter = (contact.name || contact.num)
                .toLowerCase()
                .split('')[0];
            contacts[firstNameLetter]
                ? contacts[firstNameLetter].push(contact)
                : contacts[firstNameLetter] = [contact];
        });

        return contacts;
    }

    /**
     * List of groups to display.
     * Returns matching chats in address book and global search results if
     * search string provided.
     * Returns favorite chats and alphabetically sorted contacts otherwise.
     */
    public get groupsToDisplay(): Array<{
        label: string,
        type?: string,
        contacts: Contact[],
        isLoading?: boolean,
    }> {
        if(this.searchString.length) {
            return [
                {
                    contacts: this.filteredContacts,
                    label: 'Local search',
                    type: 'Exact',
                },
                {
                    contacts: this.filteredContacts,
                    label: 'Local search',
                    type: 'Similar',
                },
                ...Object.entries(this.globalSearchResult.data).map(
                    ([type, contacts]) =>({
                        contacts: contacts as Contact[],
                        isLoading: !this.globalSearchResult.fetched,
                        label: 'Global search',
                        type,
                    }),
                ),
            ];
        } else {
            return [
                ...this.alphabetArray.map(letter => ({
                    contacts: this.sortedContacts[letter] || [],
                    label: letter,
                })).filter(({ contacts }) => contacts.length),
            ];
        }
    }

    /**
     * Indicator whether all contacts are selected.
     */
    public get areAllContactSelected(): boolean {
        return this.selectedContacts.length === this.contacts.length;
    }

    /**
     * Indicator whether all contacts are selected.
     */
    public get isAnyContactSelected(): boolean {
        return !!this.selectedContacts.length;
    }

    /**
     * List of disabled contacts IDs.
     */
    public get disabledContactsIds(): string[] {
        return this.popup.disabledContactsIds;
    }

    /**
     * Closes confirmation popup.
     * Also, calls confirm callback if it's provided.
     *
     * @param payload                   Action params.
     * @param payload.id                Popup id what should be removed.
     */
    @popupModule.Action(POPUP_AGREE)
    public confirmHandler: (payload: {
        id: string,
        selectedContacts: Contact[],
    }) => void;

    /**
     * Removes popup from popups array.
     *
     * @param payload                   Action params.
     * @param payload.id                Popup id what should be removed.
     */
    @popupModule.Action(REMOVE_POPUP)
    public removePopup: (payload: {
        id: string,
    }) => void;

    /**
     * Triggers movement handler to start listening to events.
     *
     * @param e                         `touchstart` | `mousedown` event.
     */
    public movementHandlerStart(e: TouchEvent): void {
        if (e.type !== 'touchstart') return;

        this.movementHandler.start(e);
    }

    /**
     * Starts contacts list moving handler.
     */
    public startHandler(): void {
        const scrollContent =
            this.$el.querySelector('.contacts__list-body') as HTMLElement;
        if (scrollContent.scrollTop > 0) return;
        const contactContainer = this.$refs.contactContainer as HTMLElement;
        contactContainer.style.animation = 'unset';
        const body = document.querySelector('body') as HTMLElement;
        body.classList.add('non-reload');

        contactContainer.style.transition = 'unset';
    }

    /**
     * Moves this element according to the current finger position.
     *
     * @param data                      Movement handler data.
     */
    public moveHandler(data: MovementHandlerData): void {
        const { y: dY } = data.diff;
        if (dY < 0) return;
        const contactContainer = this.$refs.contactContainer as HTMLElement;
        contactContainer.style.transform = `translateY(${dY}px)`;
    }

    /**
     * Closes contacts list based on `dY`.
     *
     * @param data                      Movement handler data.
     */
    public endHandler(data: MovementHandlerData): void {
        const { y: dY } = data.diff;
        const body = document.querySelector('body') as HTMLElement;
        body.classList.remove('non-reload');
        const winHeight = window.innerHeight;
        const contactContainer = this.$refs.contactContainer as HTMLElement;

        contactContainer.style.transition = 'all 0.2s ease-out';
        if (dY > winHeight / 4) {
            contactContainer.style.transform = 'translateY(100%)';
            this.removePopup({ id: this.popup.id });
        } else {
            contactContainer.style.transform = 'translateY(0px)';
        }
    }

    /**
     * Fetches chats matching search string from the server.
     *
     * @param value                     Search string value be sent to server.
     */
    public async globalSearch(value: string): Promise<void> {
        this.globalSearchResult.fetched = false;
        await new Promise(r => setTimeout(r, 2000));

        this.globalSearchResult = {
            data: {
                exact: this.filteredContacts,
                similar: this.filteredContacts,
            },
            fetched: true,
            lastRequest: value,
        };
    }

    /**
     * Returns search results in local address book.
     */
    public localSearch(): {[key: string]: Contact[]} {
        return {
            exact: this.filteredContacts,
            similar: this.filteredContacts,
        };
    }

    /**
     * Sets all non-disabled contacts selected or deselected.
     */
    public selectAll(): void {
        if (this.areAllContactSelected) {
            this.selectedContacts = this.preselectedDisabledContacts;
        } else {
            this.selectedContacts = this.contacts;
        }
    }

    /**
     * Toggles user select state.
     *
     * @param contact                   User contact.
     */
    public selectContact(contact: Contact): void {
        if (this.selectedContacts.includes(contact)) {
            this.selectedContacts = this.selectedContacts.filter(item => {
                return item !== contact;
            });
        } else {
            this.selectedContacts.push(contact);
        }
    }

    /**
     * Sets search input value string.
     *
     * @param value                     Search input value.
     */
    public setSearchValue(value: ''): void {
        this.searchString = value;
        if(value === '') {
            clearInterval(this.debounceInterval as number);
            this.debounceInterval = null;
            return;
        }

        if(
            this.globalSearchResult.fetched
            && value !== this.globalSearchResult.lastRequest
        ) {
            this.globalSearchResult.fetched = false;
        }

        this.lastSearchStringUpdateTime = new Date().getTime();
        if(!this.debounceInterval) {
            this.debounceInterval = setInterval(() => {
                if (new Date().getTime() - this.lastSearchStringUpdateTime
                    >= this.searchDebounceTime) {
                    if(value !== this.globalSearchResult.lastRequest) {
                        this.globalSearch(this.searchString);
                    }
                    clearInterval(this.debounceInterval as number);
                    this.debounceInterval = null;
                }
            }, 100);
        }
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to set movement handlers.
     *
     * Also, sets initial `selectedContacts` and `preselectedDisabledContacts`
     * values.
     */
    public mounted(): void {
        this.movementHandler.onStart(this.startHandler.bind(this));
        this.movementHandler.onMove(this.moveHandler.bind(this));
        this.movementHandler.onEnd(this.endHandler.bind(this));

        this.popup.preselectedContactsIds.forEach((id) => {
            const contact = this.contacts.find(contact => contact.id === id);
            if (!contact) return;
            this.selectedContacts.push(contact);
            if(this.popup.disabledContactsIds.includes(id)) {
                this.preselectedDisabledContacts.push(contact);
            }
        });
    }

    /**
     * Hooks `beforeDestroy` Vue lifecycle stage to close contacts list with
     * animation.
     */
    public beforeDestroy(): void {
        if (this.isMobileMode) {
            const contactContainer = this.$refs.contactContainer as HTMLElement;
            contactContainer.style.transition = 'all .3s linear';
            contactContainer.style.transform = 'translateY(100%)';
        }
    }
}
