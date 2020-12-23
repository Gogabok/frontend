import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

import { Chat } from 'models/Chat';
import { CurrentUser } from 'models/CurrentUser';
import { Message } from 'models/Message';

import Angle from 'components/icons/Angle.vue';
import CheckedIcon from 'components/icons/CheckedIcon.vue';


/**
 * Chats menu chat card element.
 */
@Component({
    components: {
        'angle': Angle,
        'checked-icon': CheckedIcon,
    },
})
export default class ChatCard extends Vue {
    /**
     * Search string used.
     */
    @Prop({
        default: '',
        type: String,
    }) searchString;

    /**
     * Chat object.
     */
    @Prop({
        required: true,
        type: Object,
    }) chatInfo: Chat;

    /**
     * Amount of common contacts.
     */
    @Prop({
        default: 0,
        type: Number,
    }) commonContacts;

    /**
     * Indicator whether select mode is on.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isSelectMode;

    /**
     * Current app user account information.
     */
    @Prop({
        required: true,
    }) currentUserData: CurrentUser;

    /**
     * Indicator whether chat is selected.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isSelected;

    /**
     * Vue data attribute used to bind styles.
     */
    public dataId: string = 'default';

    /**
     * Amount of unread messages in the chat.
     */
    public amountOfUnreadMessages: number = 0;

    /**
     * Last message time.
     */
    public lastMessageTime: string = '';

    /**
     * Last chat message.
     */
    public get lastMessage(): Message | null {
        if(!this.chatInfo.dialogs.length) return null;
        const dialog = this.chatInfo.dialogs[this.chatInfo.dialogs.length - 1];
        return dialog.messages[dialog.messages.length - 1];
    }

    /**
     * Chat name.
     */
    public get chatName(): string {
        const name = this.chatInfo.name || `&${this.chatInfo.num}`;
        return this.chatInfo.isKicked
            ? `${name} (kicked)`
            : name;
    }

    /**
     * Chat last message content description.
     */
    public get lastSeen(): string {
        if(!this.lastMessage) return '';


        if (this.lastMessage.message.length) return this.lastMessage.message;
        if (this.lastMessage.attachment) {
            switch(this.lastMessage.attachment.type) {
                case 'audio':
                    return 'Audio message';
                case 'video':
                    return 'Video message';
                case 'image':
                    return 'Photo message';
                case 'doc':
                    return 'Document';
                default:
                    return 'Attachment';
            }
        } else if (this.lastMessage.mediaGroup) {
            return `${this.lastMessage.mediaGroup.length} attachments`;
        }

        // This case should be impossible due to send message restrictions.
        return 'Invalid message';
    }

    /**
     * List of parameters, matching search request.
     */
    public get matchingParameters(): string[] {
        const set: string[] = [
            this.chatInfo.name,
            this.chatInfo.num,
        ].filter(Boolean) as string[];

        return set
            .map(parameter => this.findLetters(
                parameter.toLowerCase(),
                this.searchString,
            ))
            .filter(parameter => parameter.found)
            .map(parameter => parameter.value as string);
    }

    /**
     * Returns amount of unread messages in the chat.
     */
    public getAmountOfUnreadMessages(): number {
        let messagesCounter = 0;

        dialogsLoop:
            for (let i = this.chatInfo.dialogs.length - 1; i >= 0; i--) {
                const dialog = this.chatInfo.dialogs[i];
                for (let j = dialog.messages.length - 1; j >= 0; j--) {
                    const message = dialog.messages[j];
                    if (message.userId === this.currentUserData.id
                        || message.status !== 'unread') {
                        break dialogsLoop;
                    }

                    messagesCounter++;
                }
            }

        return messagesCounter;
    }

    /**
     * Returns user-friendly last message time representation.
     */
    public getLastMessageTime(): string {
        if (!this.lastMessage) return '';
        // TODO: This potentially could be moved to filters.

        const dayName = {
            0: 'вс',
            1: 'пн',
            2: 'вт',
            3: 'ср',
            4: 'чт',
            5: 'пт',
            6: 'сб',
        };
        const dayLength         = 1000 * 70 * 60 * 24;
        const weekLength        = dayLength * 7;
        const yearLength        = dayLength * new Date().getFullYear() % 4 === 0
                                    ? 366
                                    : 365;
        const lastMessageDate   = new Date(this.lastMessage.time);
        const diff              = new Date().getTime() - this.lastMessage.time;

        const ddMMyyyy = (date: Date, separator: string = '.'): string => {
            return  pad2(date.getDate()) + separator
                    + pad2(date.getMonth() + 1) + separator
                    + pad2(date.getFullYear());
        };

        const ddMM = (date: Date, separator = '.'): string => {
            return  pad2(date.getDate()) + separator
                    + pad2(date.getMonth() + 1);
        };

        const hhmm = (date: Date, separator: string = ':'): string => {
            return  pad2(date.getHours()) + separator
                    + pad2(date.getMinutes());
        };

        const pad2 =
            (value: number): string => value.toString().padStart(2, '0');
        return diff > dayLength
            ? diff < dayLength * 2
                ? 'Вчера'
                : diff >= weekLength
                    ? diff >= yearLength
                        ? ddMMyyyy(lastMessageDate)
                        : ddMM(lastMessageDate)
                    : dayName[lastMessageDate.getDay()]
            : hhmm(lastMessageDate);
    }

    /**
     * Transforms provided string to highlight letters matching search string.
     *
     * @param val                       String to find letters in.
     * @param searchString              Search string.
     */
    public findLetters(val: string, searchString: string): {
        [key: string]: boolean | string,
    } {
        if (!searchString.length) {
            return { found: false, value: val };
        } else {
            return {
                found: val.includes(this.searchString),
                value: val.toLowerCase().split(searchString).join(
                    `<em data-${this.dataId} class='colored'>${
                        searchString
                    }</em>`,
                ),
            };
        }
    }

    /**
     * Selects/deselects chat in select mode.
     * Opens chat otherwise.
     */
    public cardClickHandler(): void {
        if(this.isSelectMode) {
            this.$emit('select');
        } else {
            if(this.$route.query.id === this.chatInfo.id) return;

            this.$router.replace({
                path: this.$route.path,
                query: { id: this.chatInfo.id },
            });
        }
    }

    /**
     * Joins this chats' call.
     */
    public joinCall(): void {
        this.$emit('join-call', this.chatInfo.id);
    }

    /**
     * Updates `amountOfUnreadMessages` value on chat's dialogs change.
     *
     * @param newInfo                   Current chat data.
     * @param oldInfo                   Previous chat data.
     */
    @Watch('chatInfo')
    public watchChatInfo(
        newInfo: Chat,
        oldInfo: Chat,
    ): void {
        if (
            oldInfo.dialogs.length !== newInfo.dialogs.length
            ||  oldInfo.dialogs.length
                && newInfo.dialogs.length
                && (
                    newInfo.dialogs[newInfo.dialogs.length - 1].messages.length
                    !==
                    oldInfo.dialogs[oldInfo.dialogs.length - 1].messages.length
                )
        ) {
            this.amountOfUnreadMessages = this.getAmountOfUnreadMessages();
        }
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to get Vue data attribute used to
     * bind styles for current component.
     *
     * Also, gets last chat message time and amount of unread chat messages.
     */
    public mounted(): void {
        this.dataId = Object.entries((this.$el as HTMLElement).dataset)[0][0];
        this.lastMessageTime = this.getLastMessageTime();
        this.amountOfUnreadMessages = this.getAmountOfUnreadMessages();
    }

    /**
     * Hooks `beforeUpdate` Vue lifecycle stage to update last chat message time
     * and amount of unread chat messages.
     */
    public beforeUpdate(): void {
        this.amountOfUnreadMessages = this.getAmountOfUnreadMessages();
        this.lastMessageTime = this.getLastMessageTime();
    }
}
