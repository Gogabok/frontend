import { mixins } from 'vue-class-component';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { capitalize } from 'utils/strings';

import { Chat } from 'models/Chat';
import { ContactCard } from 'models/ContactCard';
import { CurrentUser } from 'models/CurrentUser';
import { Group, SearchResult } from 'models/SideMenuElement';

import SideMenu from 'mixins/sideMenu';

import UserModule from 'store/modules/user';

import { GET_USER_DATA } from 'store/modules/user/getters';

import AddContactIcon from 'components/icons/AddContact.vue';
import DeleteIcon from 'components/icons/DeleteIcon.vue';
import StarIcon from 'components/icons/StarIcon.vue';

import ChatCard from 'components/pages/chats/components/contact-menu/components/chat-card/ChatCard.vue';
import Footer from 'components/common/menu/page-side-menu/footer/Footer.vue';
import ItemsGroup from 'components/common/menu/page-side-menu/items-group/ItemsGroup.vue';
import SearchBar from 'components/common/menu/page-side-menu/search-bar/SearchBar.vue';


const userModule = namespace(UserModule.vuexName);

/**
 * Responsive left-sided menu component, that contains list of chats. Each
 * one opens exact chat's dialogs.
 */
@Component({
    components: {
        'add-contact-icon': AddContactIcon,
        'chat-card': ChatCard,
        'chats-group': ItemsGroup,
        'delete-icon': DeleteIcon,
        'menu-footer': Footer,
        'search-bar': SearchBar,
        'star-icon': StarIcon,
    },
})
export default class ContactMenu extends mixins(
    SideMenu,
) {
    /**
     * Alphabet list.
     */
    public readonly alphabetArray: string[] =
        'abcdefghijklmnopqrstuvwxyz'.split('');

    /**
     * Current app user account information.
     */
    @userModule.Getter(GET_USER_DATA)
    public currentUserData: CurrentUser;

    /**
     * List of chats, sorted alphabetically.
     */
    public get groups(): Array<Group<ContactCard>> {
        return[
            {
                content: <ContactCard[]>this.items,
                isHeaderHidden: true,
                isLoading: false,
                label: 'Chats',
            },
        ];
    }

    /**
     * List of groups to be displayed.
     */
    public get groupsToDisplay(): Array<Group<ContactCard>> {
        type Type = 'global' | 'local';
        type Result = {
            data: SearchResult<Chat>,
            lastRequest: string,
        }

        return this.searchString.length > 0
            ? Object.entries(<Record<Type, Result>>this.searchResult)
                .reduce((
                    groups: Array<Group<ContactCard>>,
                    [type, result]: [string, Result],
                ) => {
                    return [
                        ...groups,
                        ...Object.entries(result.data)
                            .map(([subtype, items]) => {
                                return {
                                    content: items.map(v => new ContactCard(v)),
                                    isLoading: type === 'global'
                                        ? this.isFetchingData
                                        : false,
                                    label: `${capitalize(type)} Search ${
                                        capitalize(subtype)
                                    }`,
                                };
                            }),
                    ];
                },
                <Array<Group<ContactCard>>>[])
            : this.groups;
    }

    /**
     * Indicator whether groups should be visible.
     */
    public get areGroupsVisible(): boolean {
        return this.isFetchingData
            || ((this.searchString.length === 0 && this.groups.length > 0)
                || this.groupsToDisplay.find(
                    group => group.content.length > 0,
                ) !== undefined
            );
    }

    /**
     * Emits `join-call` event to join the call.
     *
     * @param id                        ID of the room to join.
     */
    public joinCall(id: string): void {
        this.$emit('join-call', id);
    }

    /**
     * Emits `delete` event to delete all selected chats.
     */
    public deleteSelectedChats(): void {
        this.$emit('delete', this.selectedItems.map(item => item.value()));
        this.setSelectMode(false);
    }

    /**
     * Emits `set-favorite` event to add add selected chats and users to list
     * of favorites.
     * If chat is not in contacts list yet, then it firstly will be added there.
     */
    public setContactsFavorite(): void {
        this.$emit(
            'set-favorite',
            this.selectedItems.map(item => item.value()),
        );
        this.setSelectMode(false);
    }

    /**
     * Emits `add-to-contacts` event to add all selected items to contacts list.
     */
    public addToContacts(): void {
        this.$emit(
            'add-to-contacts',
            this.selectedItems.map(item => item.value()),
        );
        this.setSelectMode(false);
    }

    /**
     * Fetches data, user searched for from the server.
     *
     * @param value                     Search string.
     */
    private searchRequest(value: string): Promise<SearchResult<Chat>> {
        return new Promise<SearchResult<Chat>>(resolve => setTimeout(
            () => resolve({
                exact: this.items
                    .filter(item => item.contains(value))
                    .map(item => item.value()),
                similar: this.items
                    .filter(item => item.contains(value))
                    .map(item => item.value()),
            }),
            3000,
        ));
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to set global search callback.
     */
    public mounted(): void {
        this.setGlobalSearchRequest(this.searchRequest);
    }
}
