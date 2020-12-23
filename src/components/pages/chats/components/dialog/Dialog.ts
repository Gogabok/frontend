import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

import { dialogDateFormatter } from 'utils/DateFormatter';

import { Message } from 'models/Message';

import DialogHeader from 'components/pages/chats/components/dialog-header/DialogHeader.vue';
import MessageComponent from 'components/pages/chats/components/message/Message.vue';


/**
 * Dialog component.
 * Contains messages grouped by date.
 */
@Component({
    components: {
        'dialog-header': DialogHeader,
        'message': MessageComponent,
    },
})
export default class Dialog extends Vue {
    /**
     * Dialog to be displayed.
     */
    @Prop({
        default: () => ([]),
    }) dialog: Dialog;

    /**
     * List of selected messages.
     */
    @Prop({
        default: () => [],
        type: Array,
    }) selectedMessages: Message[];

    /**
     * Indicator whether select mode is on.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isSelectMode;

    /**
     * Indicator whether user reaches the point which activates message loader.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isLoadMessagesBorderReached;

    /**
     * Amount of messages loaded by once.
     */
    public portionOfMessagesAmount: number = 50;

    /**
     * Integer of messages part.
     */
    public portionPart: number = 1;

    /**
     * List of loaded messages.
     */
    public loadedMessages: Message[] = [];

    /**
     * Indicator whether messages loads.
     */
    public isMessagesLoading: boolean = false

    /**
     * Formats time from ms to user-friendly message.
     *
     * @param dateTime      Date in ms.
     */
    public dateFormatter(dateTime: number): string {
        return dialogDateFormatter(dateTime);
    }

    /**
     * Checks whether a message is the last message of the user.
     *
     * @return `true` if yes.
     */
    public checkLastMessage(
        current: Message,
        next: Message | undefined,
    ): boolean {
        if (next === undefined) {
            return true;
        }
        return !this.isSame(current.isUserMessage, next.isUserMessage);
    }

    /**
     * Handles message reply event.
     *
     * @param message     Message object user replied to.
     */
    public replyHandler(message: Message): void {
        this.$emit('reply', message);
    }

    /**
     * Checks whether all messages in the dialog are the same.
     *
     * @return `true` if yes.
     */
    public isSame<T>(...args: T[]): boolean {
        return args.every(v => v === args[0]);
    }

    /**
     * Loads a part of messages.
     * Emulates async action.
     */
    public loadMessages(): void {
        const arrayOfMessages = [...this.dialog['messages']];
        if (this.portionOfMessagesAmount
                * this.portionPart
            > arrayOfMessages.length
                + this.portionOfMessagesAmount
            ) return;
        this.$nextTick(() => {
            this.isMessagesLoading = true;
            setTimeout(() => {
                let portionOfMessages: Message[] = [];
                if ( arrayOfMessages.length
                     > this.portionOfMessagesAmount * this.portionPart
                    ) {
                    portionOfMessages = arrayOfMessages.splice(
                        arrayOfMessages.length
                        - this.portionOfMessagesAmount
                        * this.portionPart, arrayOfMessages.length,
                    );
                } else {
                    portionOfMessages = [...arrayOfMessages];
                }
                this.loadedMessages = portionOfMessages;
                this.isMessagesLoading = false;
                this.portionPart++;
                if (this.isLoadMessagesBorderReached) {
                    this.loadMessages();
                }
            }, 1000);
        });
    }

    /**
     * Watcher of prop 'isLoadMessagesBorderReached' which starts
     * message loading.
     */
    @Watch('isLoadMessagesBorderReached')
    watchIsLoadMessagesBorderReached(): void {
        this.isLoadMessagesBorderReached ? this.loadMessages() : false;
    }

    /**
     * Emits 'is-messages-loading' whether loading is active.
     */
    @Watch('isMessagesLoading')
    watchIsMessagesLoading(): void {
        this.$emit('set-messages-loading', this.isMessagesLoading);
    }

    /**
     *  Hooks `created` Vue lifecycle stage to load firts part of messages.
     */
    public created(): void {
        this.loadMessages();
    }
}
