import { mixins } from 'vue-class-component';
import { Component, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { Chat } from 'models/Chat';
import { ContactCard } from 'models/ContactCard';
import { User } from 'models/User';

import SwipeMenuMixin from 'mixins/swipe-menu.ts';

import CallModule from 'store/modules/call';
import ChatsModule from 'store/modules/chats';
import GeneralParametersModule from 'store/modules/general-parameters';
import UserModule from 'store/modules/user';
import UsersModule from 'store/modules/users';

import { JOIN_CALL } from 'store/modules/call/actions';
import { DELETE_CHAT, FETCH_CHATS } from 'store/modules/chats/actions';
import { GET_ALL_CHATS } from 'store/modules/chats/getters';
import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';
import {
    SET_USER_CONTACT_STATE,
    SET_USER_FAVORITE_STATE,
} from 'store/modules/user/actions';
import { GET_USER_CONTACTS } from 'store/modules/user/getters';
import { GET_USER_BY_CHAT_ID } from 'store/modules/users/getters';

import ChatWindow from 'components/pages/chats/components/chat-window/ChatWindow.vue';

import ContactMenu from './components/contact-menu/ContactMenu.vue';


const usersModule = namespace(UsersModule.vuexName);
const callModule = namespace(CallModule.vuexName);
const generalParameters = namespace(GeneralParametersModule.vuexName);
const chatsModule = namespace(ChatsModule.vuexName);
const userModule = namespace(UserModule.vuexName);

/**
 * Chats page component, that contains user's address book and messages of
 * chosen chat.
 *
 * Also represents a base application template.
 */
@Component({
    components: {
        'chat-window': ChatWindow,
        'chats-menu': ContactMenu,
    },
})
export default class Chats extends mixins(SwipeMenuMixin) {
    /**
     *  Last selected contact ID.
     */
    public selectedChatId: string = '';

    /**
     * Indicator whether mobile mode is active.
     */
    @generalParameters.Getter(IS_MOBILE_MODE)
    public isNativeMobileMode: boolean;

    /**
     * Indicator whether force mobile mode is active.
     */
    @generalParameters.Getter(IS_FORCE_MOBILE_MODE)
    public isForceMobileMode: boolean;

    /**
     * List of user's contacts.
     */
    @chatsModule.Getter(GET_ALL_CHATS)
    public chats: Chat[];

    /**
     * List of current app user's contacts IDs.
     */
    @userModule.Getter(GET_USER_CONTACTS)
    public contactsIds: string[];

    /**
     * Gathers user's information by chat ID.
     */
    @usersModule.Getter(GET_USER_BY_CHAT_ID)
    public getUserByChatId: (payload: { id: string }) => User;

    /**
     * Current app user's chats wrapped with `ContactCard`.
     */
    public get chatCards(): ContactCard[] {
        return this.chats.map(chat => new ContactCard(chat));
    }

    /**
     * Indicator whether mobile mode is active (whether it's native or force).
     */
    public get isMobileMode(): boolean {
        return this.isNativeMobileMode || this.isForceMobileMode;
    }

    /**
     * Sets user's contact state.
     *
     * @param payload                   Action parameters.
     * @param payload.id                ID of the user to be added/removed from
     *                                  contacts.
     * @param payload.isContact         Indicator whether user should be in
     *                                  contacts list.
     */
    @userModule.Action(SET_USER_CONTACT_STATE)
    public setUserContactState: ({
        id: string,
        isContact: boolean,
    }) => Promise<void>;

    /**
     * Deletes chat.
     *
     * @param payload                   Action parameters.
     * @param payload.id                ID of the chat to be removed.
     */
    @chatsModule.Action(DELETE_CHAT)
    public deleteChatAction: (payload: {
        id: string,
    }) => Promise<void>;

    /**
     * Sets contact's favorite state.
     *
     * @param payload                   Action parameters.
     * @param payload.id                ID of the user to be added/removed from
     *                                  favorites.
     */
    @userModule.Action(SET_USER_FAVORITE_STATE)
    public setContactFavoriteState: (payload: {
        id: string,
        isFavorite: boolean,
    }) => Promise<void>;

    /**
     * Joins call room with provided ID and provided parameters.
     *
     * @param payload                       Action parameters.
     * @param payload.isAudioMuted          Indicator whether audio should be
     *                                      muted by default.
     * @param payload.isVideoMuted          Indicator whether video should be
     *                                      muted by default.
     * @param payload.isScreenSharingActive Indicator whether screen sharing
     *                                      should be active by default.
     */
    @callModule.Action(JOIN_CALL)
    public joinCallAction: (payload: {
        isAudioMuted: boolean,
        isScreenSharingActive: boolean,
        isVideoMuted: boolean,
        roomId: string,
    }) => Promise<void>;

    /**
     * Fetches user's chats from the server.
     */
    @chatsModule.Action(FETCH_CHATS)
    public fetchChatsAction: () => Promise<void>;

    /**
     * Add provided users/chats to contacts.
     *
     * @param chats                     List of users/chats to be added to
     *                                  contacts.
     */
    public addChatsToContacts(chats: Chat[]): void {
        chats.forEach( chat => this.setUserContactState({
            id: chat.id,
            isContact: true,
        }));
    }

    /**
     * Deletes provided chats.
     *
     * @param chats                     List of chats to be deleted.
     */
    public deleteChats(chats: Chat[]): void {
        chats.forEach(chat => this.deleteChatAction({ id: chat.id }));
    }

    /**
     * Add chats/users to list of favorite contacts.
     * If they are not in contacts list yet, they are being added there firstly.
     *
     * @param chats                     List of chats/users to be added to list
     *                                  of favorite contacts.
     */
    public setChatsFavorite(chats: Chat[]): void {
        chats.forEach(chat => {
            const id = chat.type === 'group'
                ? chat.id
                : this.getUserByChatId({ id: chat.id }).id;

            if(this.contactsIds.includes(id)) {
                this.setContactFavoriteState({
                    id,
                    isFavorite: true,
                });
            } else {
                this.setUserContactState({
                    id,
                    isContact: true,
                })
                    .then(() => {
                        this.setContactFavoriteState({
                            id,
                            isFavorite: true,
                        });
                    });
            }
        });
    }

    /**
     * Joins call with provided ID.
     *
     * @param id                        ID of the room to join.
     */
    public joinCall(id: string): void {
        this.joinCallAction({
            isAudioMuted: false,
            isScreenSharingActive: false,
            isVideoMuted: true,
            roomId: id,
        });
    }

    /**
     * Watches `isMobileMode` changes.
     */
    @Watch('isMobileMode')
    onMobileModeChanged(): void {
        this.$root.$emit(
            'setBottomMenuVisibility',
            (this.isMobileMode && !this.$route.query.id) || !this.isMobileMode,
        );
    }

    /**
     * Synchronizes `selectedChatId` width route `id` query parameter.
     *
     * @param to                        Route user goes to.
     */
    @Watch('$route.query.id', { immediate: true })
    onRouteChange(to: string | undefined): void {
        if(to) this.selectedChatId = to;
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to disable bottom navigation menu
     * on the chats mobile page with chosen dialog.
     */
    public async mounted(): Promise<void> {
        if(!this.isMobileMode && (this.$route.query && !this.$route.query.id)) {
            const chats: {[key: string]: Chat[]} = {};
            this.chats.forEach(chat => {
                const firstNameLetter =
                    (chat.name || chat.num)
                        .toLowerCase()
                        .split('')[0];
                chats[firstNameLetter]
                    ? chats[firstNameLetter]
                        .push(chat)
                    : chats[firstNameLetter] = [chat];
            });
            const chatsEntries = Object.entries(chats);
            if(!chatsEntries.length) return;

            const firstChat: Chat = chatsEntries[0][1][0];

            if(!firstChat) return;

            this.$router.replace({
                path: '/chats',
                query: {
                    id: firstChat.id,
                },
            });
        }
    }
}
