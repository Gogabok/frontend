import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { MessageAttachment } from 'models/Attachment';
import { Contact } from 'models/Contact';
import {
    Message,
} from 'models/Message';
import { User } from 'models/User';

import ChatsModule from 'store/modules/chats';
import ContactsModule from 'store/modules/contacts';
import UserModule from 'store/modules/user';

import { SEND_MESSAGE } from 'store/modules/chats/actions';
import {
    GET_ALL_CONTACTS,
    GET_CONTACT_BY_ID,
} from 'store/modules/contacts/getters';
import { GET_USER_DATA } from 'store/modules/user/getters';

import ContactsList from './components/contacts-list/ContactsSelectList.vue';
import InputField from './components/input-field/InputField.vue';
import SearchBar from './components/search-bar/SearchBar.vue';


type ForwardType = 'message' | 'media';

const contactsModule = namespace(ContactsModule.vuexName);
const chatsModule = namespace(ChatsModule.vuexName);
const userModule = namespace(UserModule.vuexName);

/**
 * Forward interface component. It let's user to share the message or media
 * object to selected contacts.
 */
@Component({
    components: {
        'contacts-list': ContactsList,
        'input-field': InputField,
        'search-bar': SearchBar,
    },
})
export default class Forward extends Vue {
    /**
     * Indicator whether user is forwarding messages or media.
     */
    @Prop({
        default: 'message',
        type: String,
    }) type: ForwardType;

    /**
     * Items to forward.
     */
    @Prop({
        default: () => ([]),
        type: Array,
    }) itemsToForward: Message[] | MessageAttachment[]

    /**
     * Contacts to forward to.
     */
    public chosenContacts: Contact[] = [];

    /**
     * Search string.
     */
    public searchString: string = '';

    /**
     * User's contacts.
     */
    @contactsModule.Getter(GET_ALL_CONTACTS)
    public contacts: Contact[];

    /**
     * Current user account information.
     */
    @userModule.Getter(GET_USER_DATA)
    public userData: User;

    /**
     * Returns contact data by ID.
     *
     * @param payload                   Action parameters.
     * @paran payload.id                ID of the user, whose information should
     *                                  be returned.
     */
    @contactsModule.Getter(GET_CONTACT_BY_ID)
    public getContactById: (payload: {id: string}) => Contact;

    /**
     * Sends message.
     *
     * @param payload                   Action parameters.
     * @param payload.id                ID of the user to send message to.
     * @param payload.message           Message to be sent.
     */
    @chatsModule.Action(SEND_MESSAGE)
    public sendMessageAction: (payload: {
        id: string,
        message: Message,
    }) => Promise<void>;

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
     * Adds or removes contacts from `chosenContacts`.
     *
     * @param contact                   Contact to be added or removed.
     */
    public contactChooseHandler(contact: Contact): void {
        this.chosenContacts.includes(contact)
            ? this.chosenContacts =
                this.chosenContacts.filter(c => c.id !== contact.id)
            : this.chosenContacts.push(contact);
    }

    /**
     * Selects or deselects all contacts.
     */
    public selectAllContactsHandler(): void {
        this.contacts.length === this.chosenContacts.length
            ? this.chosenContacts = []
            : this.chosenContacts = this.contacts;
    }

    /**
     * Sends selected items to chosen contacts with comment provided.
     *
     * @param message                   Comment to be sent last.
     */
    public sendHandler(message?: string): void {
        this.type === 'media'
            ? this.sendMedia(message)
            : this.sendMessages(message);
        this.closeHandler();
    }

    /**
     * Sends message to user.
     *
     * @param message                   Message to be sent.
     * @param user                      Contacts to send message to.
     */
    public sendMessageToUser(
        message: Message,
        user: Contact,
    ): void {
        this.sendMessageAction({
            id: user.id,
            message: message,
        });
    }

    /**
     * Sends all selected messages to all selected contacts.
     *
     * @param message                   Comment to be sent last.
     */
    public sendMessages(message?: string): void {
        this.chosenContacts.forEach((contact) => {
            this.itemsToForward.forEach((message) => {
                const userInfo = this.getContactById({ id: message.userId });
                const payload: Message = {
                    attachment: message.attachment,
                    forwarded: true,
                    forwardedFromUser: {
                        id: userInfo.id,
                        name: userInfo.name || null,
                        num: userInfo.num,
                    },
                    id: contact.id.toString() + new Date().getTime().toString(),
                    isUserMessage: true,
                    mediaGroup: message.mediaGroup,
                    message: message.message,
                    num: this.userData.num,
                    repliedMessage: message.repliedMessage,
                    status: 'sent',
                    time: new Date().getTime(),
                    userId: this.userData.id,
                };
                this.sendMessageToUser(payload, contact);
            });

            if(message) {
                const payload: Message = {
                    attachment: null,
                    forwarded: false,
                    forwardedFromUser: null,
                    id: contact.id.toString() + new Date().getTime().toString(),
                    isUserMessage: true,
                    mediaGroup: null,
                    message,
                    num: this.userData.num,
                    repliedMessage: null,
                    status: 'sent',
                    time: new Date().getTime(),
                    userId: this.userData.id,
                };

                this.sendMessageToUser(payload, contact);
            }
        });
        this.$root.$emit('forward-succeeded');
    }

    /**
     * Sends all selected media items to all selected contacts.
     *
     * @param message                   Comment to be sent last.
     */
    public sendMedia(message?: string): void {
        /**
         * Sends every media item as an individual message if there are less
         * than 4 items or as message with media group otherwise.
         */
        const execFunction_items = this.itemsToForward.length < 4
            ? contact => {
                this.itemsToForward.forEach(mediaItem => {
                    const payload: Message = {
                        attachment: mediaItem,
                        forwarded: false,
                        forwardedFromUser: null,
                        id: `message-${new Date().getTime()}`,
                        isUserMessage: true,
                        mediaGroup: null,
                        message: '',
                        num: this.userData.num,
                        repliedMessage: null,
                        status: 'sent',
                        time: new Date().getTime(),
                        userId: this.userData.id,
                    };
                    this.sendMessageToUser(payload, contact);
                });
            }
            : contact => {
                const payload: Message = {
                    attachment: null,
                    forwarded: false,
                    forwardedFromUser: null,
                    id: `message-${new Date().getTime()}`,
                    isUserMessage: true,
                    mediaGroup: this.itemsToForward as MessageAttachment[],
                    message: '',
                    num: this.userData.num,
                    repliedMessage: null,
                    status: 'sent',
                    time: new Date().getTime(),
                    userId: this.userData.id,
                };
                this.sendMessageToUser(payload, contact);
            };

        const execFunction_main = (contact: Contact) => {
            execFunction_items(contact);
            if(message) {
                const payload: Message = {
                    attachment: null,
                    forwarded: false,
                    forwardedFromUser: null,
                    id: contact.id.toString() + new Date().getTime().toString(),
                    isUserMessage: true,
                    mediaGroup: null,
                    message,
                    num: this.userData.num,
                    repliedMessage: null,
                    status: 'sent',
                    time: new Date().getTime(),
                    userId: this.userData.id,
                };

                this.sendMessageToUser(payload, contact);
            }
            this.$root.$emit('forward-succeeded');
        };

        this.chosenContacts.forEach(execFunction_main);
    }
}
