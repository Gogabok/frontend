import { mixins } from 'vue-class-component';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { capitalize } from 'utils/strings';

import { Chat } from 'models/Chat';
import { ContactCard } from 'models/ContactCard';
import { CurrentUser } from 'models/CurrentUser';
import { Group, SearchResult } from 'models/SideMenuElement';
import { User } from 'models/User';

import SideMenu from 'mixins/sideMenu';

import UserModule from 'store/modules/user';

import { GET_USER_DATA } from 'store/modules/user/getters';

import AddMemberIcon from 'components/icons/AddMemberIcon.vue';
import DeleteIcon from 'components/icons/DeleteIcon.vue';
import StarIcon from 'components/icons/StarIcon.vue';

import ContactPreview from 'components/common/contact/contact-preview/ContactPreview.vue';
import Footer from 'components/common/menu/page-side-menu/footer/Footer.vue';
import ItemsGroup from 'components/common/menu/page-side-menu/items-group/ItemsGroup.vue';
import SearchBar from 'components/common/menu/page-side-menu/search-bar/SearchBar.vue';

import ContactCardElement from './components/contact-card/ContactCard.vue';


const userModule = namespace(UserModule.vuexName);

/**
 * Responsive left-sided menu component containing a list of contacts. Each
 * one opens related user's profile.
 */
@Component({
    components: {
        'contact-card': ContactCardElement,
        'contact-preview': ContactPreview,
        'contacts-group': ItemsGroup,
        'contacts-menu-topbar': SearchBar,
        'create-chat-icon': AddMemberIcon,
        'delete-icon': DeleteIcon,
        'menu-footer': Footer,
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
    public currentUserAccountInfo: CurrentUser;

    /**
     * Current user contact card.
     */
    public get currentUser(): ContactCard {
        return new ContactCard({
            ...this.currentUserAccountInfo,
            name: 'You',
        } as unknown as User);
    }

    /**
     * Indicator whether any group chat is selected.
     */
    public get isAnyGroupChatSelected(): boolean {
        return !!this.selectedItems.find(
            item => item.value().type === 'group',
        );
    }

    /**
     * List of contacts, split to groups alphabetically.
     * Also, favorite contacts are moved to `favorites` groups.
     * Sets order based on global order of favorite contacts.
     */
    public get groups(): Array<Group<ContactCard>> {
        const content: Record<string, ContactCard[]> = {};
        this.items.forEach((_item) => {
            if(_item.id() === this.currentUser.id()) return;
            const item = _item as ContactCard;
            if (item.isFavorite()) {
                if (!content.favorites) content.favorites = [];

                content.favorites.push(item);

                content.favorites.sort((item1, item2) =>
                    this.currentUserAccountInfo.favoriteContacts.indexOf(
                        item1.id(),
                    )
                    < this.currentUserAccountInfo.favoriteContacts.indexOf(
                        item2.id(),
                    )
                        ? -1
                        : 1,
                );

                return;
            }
            const firstNameLetter = item.toString()
                .toLowerCase()
                .split('')[0];
            content[firstNameLetter]
                ? content[firstNameLetter].push(item)
                : content[firstNameLetter] = [item];
        });

        return <Array<Group<ContactCard>>>Object.entries(content)
            .map(([
                label,
                value,
            ]) => ({
                content: value,
                icon: label === 'favorites' ? StarIcon : undefined,
                isLoading: false,
                label,
            }))
            .sort((group1, group2) =>
                group1.label < group2.label || group1.label === 'favorites'
                    ? -1
                    : 1,
            ).sort(group1 =>
                group1.label === 'favorites'
                    ? -1
                    : 1,
            );
    }

    /**
     * List of groups to be displayed.
     */
    public get groupsToDisplay(): Array<Group<ContactCard>> {
        type Type = 'global' | 'local';
        type Result = {
            data: SearchResult<User | Chat>,
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
            )
            || this.currentUser.contains(this.searchString);
    }

    /**
     * Emits `delete` event to remove selected chats and users from list of
     * contacts.
     */
    public deleteSelectedContacts(): void {
        this.$emit(
            'delete',
            this.selectedItems.map(item => item.value()),
        );
        this.setSelectMode(false);
    }

    /**
     * Emits `set-favorite` event to add selected contacts to list of favorites.
     */
    public setContactsFavorite(): void {
        this.$emit(
            'set-favorite',
            this.selectedItems.map(item => item.value()),
        );
        this.setSelectMode(false);
    }

    /**
     * Emits `set-target-favorite` event to add holded contact card
     * to list of favorites.
     *
     * @param replacementInfo           Info of contact and vertical position.
     */
    public setContactFavorite(replacementInfo: {
        contactInfo: User,
        positionY: number,
    }): void {

        const payload: {
            contact: User,
            to: number,
        } = this.contactMovementCalculator(replacementInfo);

        if(payload) {
            this.$emit(
                'set-target-favorite',
                {
                    id: payload.contact['id'],
                    isFavorite: true,
                    to: payload.to,
                },
            );
        }
    }

    /**
     * Calculates new position of contact card in favorite list.
     * Returns updated object of contact and its position.
     *
     * @param replacementInfo           Info of contact and vertical position.
     */
    contactMovementCalculator(replacementInfo: {
        contactInfo: User,
        positionY: number,
    }): {
            contact: User,
            to: number,
        } {
        const favoritesGroupContainer =
            this.$refs['group-favorites'][0].$el;

        const favoriteCards =
            this.groups.find(group =>
                group.label === 'favorites',
            )?.content;

        if (favoritesGroupContainer && favoriteCards) {
            let cardPosition = 0;
            favoriteCards.forEach(favoriteContact => {
                const contactHTMLElement =
                    this.$refs['group-favorites'][0].$el.querySelector(`
                        .contact-card__controllers[ket=
                            ${favoriteContact.id()}
                        ]`,
                ) as HTMLElement;
                if (contactHTMLElement) {
                    const topOfContact =
                        contactHTMLElement.offsetTop
                        - favoritesGroupContainer.offsetTop;
                    topOfContact
                        < replacementInfo['positionY']
                            ? ++cardPosition
                            : cardPosition;
                }
            });
            const favoritesContactLastPosition =
                this.currentUserAccountInfo.favoriteContacts.findIndex(
                    userId => userId === replacementInfo['contactInfo'].id,
                );
            if ( favoritesContactLastPosition !== undefined
                 && favoritesContactLastPosition > -1
                 && cardPosition > favoritesContactLastPosition
               ) {
                --cardPosition;
            }
            return {
                contact: replacementInfo.contactInfo,
                to: cardPosition,
            };
        } else {
            return {
                contact: replacementInfo.contactInfo,
                to: 0,
            };
        }
    }

    /**
     * Emits `delete-favorite` to remove contact from favorites.
     *
     * @param contact                   Info of contact
     */

    public deleteContactFavorite(contact: {
        id: string,
    }): void {

        this.$emit(
            'delete-favorite',
            [contact],
        );
    }

    /**
     * Emits `create-group` event to create group chat, that consists of
     * selected contacts.
     */
    public createGroupChat(): void {
        this.$emit(
            'create-group',
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
                    .filter(item => item.is(value))
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
