import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { getUserById } from 'utils/UsersRequests';

import { CallType } from 'models/Call';
import { Chat } from 'models/Chat';
import { Contact } from 'models/Contact';
import { CurrentUser } from 'models/CurrentUser';
import {
    ContactsListPopup,
    ContactsListPopupState,
    IPopup,
    Popup,
    PopupAlign,
    PopupType,
} from 'models/PopupSettings';
import { ProfileMediaItem } from 'models/ProfileMediaItem';
import { User } from 'models/User';

import CallModule from 'store/modules/call';
import ChatsModule from 'store/modules/chats';
import GeneralParametersModule from 'store/modules/general-parameters';
import PopupModule from 'store/modules/popup';
import UserModule from 'store/modules/user';
import UsersModule from 'store/modules/users';

import { CALL_TO } from 'store/modules/call/actions';
import {
    ADD_MEMBERS_TO_CHAT,
    CREATE_GROUP,
} from 'store/modules/chats/actions';
import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';
import { ADD_POPUP } from 'store/modules/popup/actions';
import {
    CHANGE_USER_BLOCK_STATE,
    MUTE_USER,
    SET_USER_CONTACT_STATE,
    SET_USER_FAVORITE_STATE,
    UNMUTE_USER,
} from 'store/modules/user/actions';
import { GET_USER_DATA } from 'store/modules/user/getters';
import {
    ADD_USER_GALLERY_FILE,
    CHANGE_USER_NAME,
    UPDATE_USER_AVATAR,
} from 'store/modules/users/actions';
import {
    GET_IS_USER_IN_CONTACTS,
    GET_USER_BY_CHAT_ID,
    GET_USER_BY_ID,
} from 'store/modules/users/getters';

import MediaPlayer from 'components/common/media-player/MediaPlayer.vue';

import AvatarSlider from './components/avatar-slider/AvatarSlider.vue';
import CallSection from './components/call-section/CallSection.vue';
import ContactInformation from './components/contact-information/ContactInformation.vue';
import CreateGroup from './components/create-group/CreateGroup.vue';
import HeaderBar from './components/header-bar/HeaderBar.vue';
import Limitations from './components/limitations/Limitations.vue';
import MembersSection from './components/members-section/MembersSection.vue';
import NameInformation from './components/name-information/NameInformation.vue';
import ProximitySection from './components/proximity-section/ProximitySection.vue';


const userModule = namespace(UserModule.vuexName);
const GeneralParameters = namespace(GeneralParametersModule.vuexName);
const chatsModule = namespace(ChatsModule.vuexName);
const usersModule = namespace(UsersModule.vuexName);
const callModule = namespace(CallModule.vuexName);
const popupModule = namespace(PopupModule.vuexName);

/**
 * Component displaying profile of a user.
 */
@Component({
    components: {
        'avatar-slider': AvatarSlider,
        'call-section': CallSection,
        'contact-information': ContactInformation,
        'create-group': CreateGroup,
        'header-bar': HeaderBar,
        'limitations': Limitations,
        'media-player': MediaPlayer,
        'members-section': MembersSection,
        'name-information': NameInformation,
        'proximity-section': ProximitySection,
    },
})
export default class Profile extends Vue {
    /**
     * Indicator whether profile element has been scrolled.
     */
    public isScrolled: boolean = false;

    /**
     * Profile's owner information.
     */
    public profileOwner: User | Chat | null = null;

    /**
     * User's gallery to be displayed.
     */
    public gallery: ProfileMediaItem[] = [];

    /**
     * Index of the slide to be shown on media player open.
     */
    public openIndex: number = 0;

    /**
     * Indicator whether mobile mode is active.
     */
    @GeneralParameters.Getter(IS_MOBILE_MODE)
    public isNativeMobileMode: boolean;

    /**
     * Indicator whether force mobile mode is active.
     */
    @GeneralParameters.Getter(IS_FORCE_MOBILE_MODE)
    public isForceMobileMode: boolean;

    /**
     * Gets contact by ID.
     */
    @usersModule.Getter(GET_USER_BY_ID)
    public getContactById: ({ id: string }) => Promise<User | null>

    /**
     * Finds user account information.
     *
     * @param payload                   Action parameters.
     * @param payload.id                ID of the chat to find user by.
     */
    @usersModule.Getter(GET_USER_BY_CHAT_ID)
    public getUserByChatId: (payload: { id: string}) => User | null;

    /**
     * Checks whether user is in contacts list.
     *
     * @param payload                   Action parameters.
     * @param payload.id                ID of the user to be checked.
     */
    @usersModule.Getter(GET_IS_USER_IN_CONTACTS)
    public checkIsUserInContacts: (payload: { id: string }) => boolean;

    /**
     * Current app user account information.
     */
    @userModule.Getter(GET_USER_DATA)
    public currentAppUserData: CurrentUser;

    /**
     * Indicator whether mobile mode is active (whether it's force or native).
     */
    public get isMobileMode(): boolean {
        return this.isForceMobileMode || this.isNativeMobileMode;
    }

    /**
     * Indicator whether profile owner is in contacts list.
     */
    public get isContact(): boolean {
        if(!this.profileOwner) return false;
        return this.checkIsUserInContacts({ id: this.profileOwner.id });
    }

    /**
     * Swiper element by ref.
     */
    public get mySwiper(): HTMLElement {
        return this.$refs.swiper as HTMLElement;
    }

    /**
     * Mutes user.
     */
    @userModule.Action(MUTE_USER)
    public muteUserAction: (payload: {
        id: string,
        duration: number,
    }) => Promise<number>;

    /**
     * Unmutes user.
     */
    @userModule.Action(UNMUTE_USER)
    public unmuteUserAction: (payload: {
        id: string,
    }) => Promise<void>;

    /**
     * Changes user's block state.
     */
    @userModule.Action(CHANGE_USER_BLOCK_STATE)
    public blockUserAction: (payload: {
        id: string,
        isBlocked: boolean,
    }) => Promise<void>;

    /**
     * Sets contact's favorite state.
     */
    @userModule.Action(SET_USER_FAVORITE_STATE)
    public setFavoriteStateAction: (payload: {
        id: string,
        isFavorite: boolean,
    }) => Promise<void>

    /**
     * Sets user's contact state.
     *
     * @param payload                   Action parameters.
     * @param payload.id                ID of the user to be changed.
     * @param payload.isContact         Indicator whether user should be in
     *                                  contacts list.
     */
    @userModule.Action(SET_USER_CONTACT_STATE)
    public setUserContactState: (payload: {
        id: string,
        isContact: boolean,
    }) => Promise<void>;

    /**
     * Changes contact's name.
     */
    @usersModule.Action(CHANGE_USER_NAME)
    public changeContactNameAction: (payload: {
        id: string,
        name: string,
    }) => Promise<void>;

    /**
     * Adds file to gallery.
     */
    @usersModule.Action(ADD_USER_GALLERY_FILE)
    public addFileToGallery: (payload: {
        chatId: string,
        item: ProfileMediaItem,
    }) => Promise<void>;

    /**
     * Adds members to chat.
     */
    @chatsModule.Action(ADD_MEMBERS_TO_CHAT)
    public addMembersAction: (payload: {
        chatId: string,
        ids: string[],
    }) => Promise<void>

    /**
     * Changes group's avatar.
     */
    @usersModule.Action(UPDATE_USER_AVATAR)
    public changeAvatar: (payload: {
        chatId: string,
        avatar: string,
    }) => Promise<void>

    /**
     * Calls to user.
     *
     * @param payload                   Action parameters.
     * @param payload.id                ID of the user to call to.
     * @param payload.type              Call type to call with
     *                                  ('audio'|'video').
     */
    @callModule.Action(CALL_TO)
    public callToAction: (payload: {
        id: string,
        type: CallType,
    }) => Promise<void>;

    /**
     * Creates group of provided users.
     */
    @chatsModule.Action(CREATE_GROUP)
    public createGroupAction: (payload: {
        ids: string[],
    }) => Promise<string>;

    /**
     * Opens popup.
     *
     * @param payload                   Action parameters.
     * @param payload.popup             Popup to be shown.
     */
    @popupModule.Action(ADD_POPUP)
    public openPopup: (payload: {
        popup: IPopup,
    }) => Promise<void>;

    /**
     * Blocks/unblocks user.
     * Also, removes user from contacts list if it becomes blocked.
     */
    public async blockUser(): Promise<void> {
        if(!this.profileOwner) return;

        const user = this.profileOwner;
        const name = (user.type === 'group'
                ? 'group'
                : '')
            + <string>user.name || `&${user.num}`;
        if(!this.profileOwner.isBlocked) {
            this.showConfirm(
                `Restrict ${name} from sending you messages and making calls?`,
                () => {
                    this.blockUserAction({
                        id: user.id,
                        isBlocked: true,
                    })
                        .then(() => {
                            this.showAlert(`${name} has been blocked.`);
                            this.setUserContactState({
                                id: user.id,
                                isContact: false,
                            });
                            if(!this.profileOwner) return;
                            this.profileOwner.isBlocked = true;
                        });
                },
            );
        } else {
            this.blockUserAction({
                id: this.profileOwner.id,
                isBlocked: !this.profileOwner.isBlocked,
            })
                .then(() => {
                    this.showAlert(`${name} has been unblocked.`);
                    if(!this.profileOwner) return;
                    this.profileOwner.isBlocked = false;
                });
        }
    }

    /**
     * Leaves group.
     */
    public leaveHandler(): void {
        if (!this.profileOwner) return;
        const name = this.profileOwner.name
            || `&${this.profileOwner.num}`;

        this.showConfirm(`You are about to leave group ${name}`, () => {
            // TODO: Leave group func.
        });
    }

    /**
     * Sets media player's gallery.
     *
     * @param payload                   Function parameters.
     * @param payload.gallery           User's profile gallery.
     * @param payload.slide             Number of slide to start slider with.
     */
    public openMediaPlayer(payload: {
        gallery: ProfileMediaItem[],
        slide: number,
    }): void {
        this.gallery = payload.gallery;
        this.openIndex = payload.slide;
        (this.$el as HTMLElement).style.zIndex = '12';
    }

    /**
     * Closes media player, emits 'close-profile-media-player' profile.
     */
    public closeMediaPlayer(): void {
        this.$root.$emit('close-profile-media-player');
        this.gallery = [];
        (this.$el as HTMLElement).style.zIndex = '';
    }

    /**
     * Toggles contact's favorite state.
     */
    public toggleFavoriteState(): void {
        if(!this.isContact) return;
        const user = <Contact>this.profileOwner;
        if (user.isFavorite) {
            this.showRemoveFromFavoritesConfirm();
        } else {
            this.setFavoriteStateAction({
                id: user.id,
                isFavorite: true,
            })
                .then(() => {
                    if(!this.profileOwner) return;
                    const name = this.profileOwner.name
                        || `&${this.profileOwner.num}`;
                    this.showAlert(
                        `${name} has been added to favorites contacts`,
                    );
                });
            user.isFavorite = !user.isFavorite;
        }
    }

    /**
     * Adds/removes user from current user's contacts list.
     */
    public toggleContactState(): void {
        if(this.profileOwner === null) return;
        this.profileOwner = this.profileOwner as User;
        const user = this.profileOwner;
        const name = (user.type === 'group'
            ? 'group'
            : '')
            + <string>user.name || `&${user.num}`;

        if(this.isContact) {
            this.showConfirm(
                `Delete ${name} from your contacts list?`,
                () => {
                    this.setUserContactState({
                        id: user.id,
                        isContact: false,
                    })
                        .then(() => {
                            this.showAlert(
                                `${name} has been deleted from contacts list`,
                            );
                        });
                },
            );
        } else {
            this.setUserContactState({
                id: user.id,
                isContact: true,
            })
                .then(() => {
                    this.showAlert(
                        `${name} has been added to your contacts list`,
                    );
                });

        }
    }

    /**
     * Unmutes profile owner.
     */
    public async unmuteUser(): Promise<void> {
        if(!this.profileOwner) return;

        await this.unmuteUserAction({ id: this.profileOwner.id });
        this.profileOwner.isMuted = false;
    }

    /**
     * Mutes profile owner.
     *
     * @param duration                  Mute duration.
     */
    public async muteUser(duration?: number): Promise<void> {
        if(!this.profileOwner) return;

        duration = duration as number;
        await this.muteUserAction({
            duration: duration,
            id: this.profileOwner.id,
        });
        this.profileOwner.isMuted = true;
        this.profileOwner.mutedUntil =
            new Date().getTime() + duration * 60 * 60;
    }


    /**
     * Closes profile.
     */
    public closeHandler(): void {
        const query = { ...this.$route.query };
        const parametersToRemove = ['dsw', 'profile'];
        this.$route.path.includes('contacts') && parametersToRemove.push('id');

        parametersToRemove.forEach(param => delete query[param]);

        this.$router.replace({
            path: this.$route.path,
            query,
        });
    }

    /**
     * Shows alert popup.
     *
     * @param text                      Text to be displayed on popup.
     */
    public showAlert(text: string): void {
        this.openPopup({
            popup: new Popup({
                confirmCallback: null,
                id: `${new Date().getTime()}${PopupType.Alert}`,
                settings: {
                    align: {
                        horizontal: PopupAlign.Center,
                        vertical: PopupAlign.End,
                    },
                    position: {
                        bottom: 55,
                        left: 400,
                        right: 0,
                        top: 0,
                    },
                    type: PopupType.Alert,
                },
                textMessage: text,
            }),
        });
    }

    /**
     * Shows confirm popup.
     *
     * @param text                      Text to be displayed on popup.
     * @param callback                  Callback to be called on confirm.
     */
    public showConfirm(text: string, callback?: (() => void) | null): void {
        this.openPopup({
            popup: new Popup({
                confirmCallback: callback || null,
                id: `${new Date().getTime()}${PopupType.Confirm}`,
                settings: {
                    align: {
                        horizontal: PopupAlign.Center,
                        vertical: PopupAlign.Start,
                    },
                    position: {
                        bottom: 55,
                        left: 400,
                        right: 0,
                        top: 0,
                    },
                    type: PopupType.Confirm,
                },
                textMessage: text,
            }),
        });
    }

    /**
     * Shows remove user from favorites confirm popup.
     * Removed user from favorites on resolve and notifies user about success
     * with alert popup.
     */
    public showRemoveFromFavoritesConfirm(): void {
        if(!this.profileOwner) return;

        const name = this.profileOwner.name
            || `&${this.profileOwner.num}`;

        const showAlert = () => {
            if(!this.profileOwner) return;

            this.setFavoriteStateAction({
                id: this.profileOwner.id,
                isFavorite: false,
            })
                .then(() => {
                    this.showAlert(`${name} removed from favorites.`);
                    if(!this.profileOwner) return;
                    const user = this.profileOwner as Contact;
                    user.isFavorite = !user.isFavorite;
                });
        };

        this.showConfirm(
            `Delete contact ${name} from favorites?`, showAlert);
    }

    /**
     * Retrieves user account information.
     *
     * @param id                        ID of the user to get information about.
     */
    public async getUser(id: string): Promise<void> {
        this.profileOwner = await getUserById({ id })
            || this.getUserByChatId({ id });
        const contact =
            await this.getContactById({ id });
        if(contact) this.profileOwner = { ...this.profileOwner, ...contact };
    }

    /**
     * Sets `isScrolled` indicator based in scrolled distance.
     *
     * @param event                     `scroll` event.
     */
    private scrollHandler(event: Event): void {
        const target = event.target as HTMLElement;
        this.isScrolled = target.scrollTop > 1;
    }

    /**
     * Opens contacts list popup and adds selected users to chat.
     */
    public async addMembers(): Promise<void> {
        if(!this.profileOwner) return;
        const _participants = (<Chat>this.profileOwner).participants;
        const participants = typeof _participants[0] === 'string'
            ? _participants as unknown as string[]
            : _participants.map(({ id }) => id);
        this.showContactsListPopup({
            callback: async ({ selectedContacts }) => {
                if(!this.profileOwner) return;

                await this.addMembersAction({
                    chatId: this.profileOwner.id,
                    ids: selectedContacts.map(({ id }) => id),
                });
                (<Chat>this.profileOwner).participants = Array.from(new Set([
                    ..._participants,
                    ...(typeof _participants[0] === 'string'
                        ? selectedContacts.map(({ id }) => id)
                        : selectedContacts),
                ]));
            },
            disabledContactsIds: participants,
            preselectedContactsIds: participants,
            state: ContactsListPopupState.AddGroupMember,
        });
    }

    /**
     * Updates avatar locally and globally.
     *
     * @param src                       New group avatar.
     */
    public updateAvatar(src: string): void {
        if(!this.profileOwner) return;
        this.profileOwner.avatarPath = src;
        this.changeAvatar({
            avatar: src,
            chatId: this.profileOwner.id,
        });
    }

    /**
     * Calls to profile owner.
     */
    public callHandler(type: CallType): void {
        if (!this.profileOwner) return;

        this.callToAction({
            id: this.profileOwner.type === 'group'
                ? this.profileOwner.id
                : (<User>this.profileOwner).chatId,
            type,
        });
    }

    /**
     * Opens chat with profile owner.
     */
    public writeMessage(): void {
        if (!this.profileOwner) return;

        this.$router.push({
            path: 'chats',
            query: {
                id: this.profileOwner.type === 'group'
                    ? this.profileOwner.id
                    : (<User>this.profileOwner).chatId,
            },
        });
    }

    /**
     * Opens contacts list popup and creates a group chat with users selected
     * using it.
     */
    public createGroup(): void {
        if(!this.profileOwner) return;

        this.showContactsListPopup({
            callback: async ({ selectedContacts }) => {
                const id = await this.createGroupAction({
                    ids: <string[]>selectedContacts.map(({ id }) => id),
                });

                this.$router.push({
                    path: 'chats',
                    query: { id },
                });
            },
            disabledContactsIds: [this.currentAppUserData.id],
            preselectedContactsIds: [this.profileOwner.id],
            state: ContactsListPopupState.AddGroupMember,
        });
    }

    /**
     * Opens contacts list popup.
     *
     * @param payload                           Method parameters.
     * @param payload.callback                  Callback to be called on
     *                                          resolve.
     * @param payload.preselectedContactsIds    List of contacts to be
     *                                          preselected.
     * @param payload.disabledContactsIds       List of contact whose select
     *                                          state can't be changed.
     */
    public showContactsListPopup(payload: {
        callback: (data: { selectedContacts: User[] }) => void | Promise<void>,
        preselectedContactsIds?: string[],
        disabledContactsIds?: string[],
        state: ContactsListPopupState,
    }): void {
        this.openPopup({
            popup: new ContactsListPopup({
                confirmCallback: payload.callback,
                disabledContactsIds: payload.disabledContactsIds || [],
                id: `${new Date().getTime()}${PopupType.Contacts}`,
                preselectedContactsIds: payload.preselectedContactsIds || [],
                settings: {
                    align: {
                        horizontal: PopupAlign.Center,
                        vertical: PopupAlign.Center,
                    },
                    position: {
                        bottom: 0,
                        left: 0,
                        right: 0,
                        top: 0,
                    },
                    type: PopupType.Contacts,
                },
                state: payload.state,
                textMessage: null,
            }),
        });
    }

    /**
     * Gets user's profile information on route query `id` param change.
     *
     * @param id                        ID of the profile owner.
     */
    @Watch('$route.query.id')
    watchRouteQueryId(id: string | undefined): void {
        if(!id) return;
        this.getUser(id);
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to add `scroll` event listener.
     * Also, retrieves users profile information.
     */
    async mounted(): Promise<void> {
        this.$el.addEventListener(
            'scroll',
            this.scrollHandler,
            { passive: true },
        );

        if(!this.$route.query.id) {
            this.profileOwner = null;
            return;
        }

        this.getUser(this.$route.query.id as string);

        this.$root.$on('open-profile-media-player', this.openMediaPlayer);
    }

    /**
     * Hooks `beforeDestroy` Vue lifecycle stage to remove `scroll` and
     * `open-profile-media-player` event listeners.
     */
    public beforeDestroy(): void {
        this.$el.removeEventListener(
            'scroll',
            this.scrollHandler,
        );
        this.$root.$off('open-profile-media-player', this.openMediaPlayer);
    }
}
