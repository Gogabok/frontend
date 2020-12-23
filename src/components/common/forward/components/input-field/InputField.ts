import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import PlusIcon from 'components/icons/PlusIcon.vue';
import SendMessageIcon from 'components/icons/SendMessageIcon.vue';


/**
 * Forward interface input field. This component let's user to set forward
 * message comment.
 */
@Component({
    components: {
        'plus-icon': PlusIcon,
        'send-message-icon': SendMessageIcon,
    },
})
export default class InputField extends Vue {
    /**
     * Indicator whether at least one contact is selected.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isAnyContactSelected;

    /**
     * Message to be sent as a comment to forwarded messages.
     */
    public message: string = '';

    /**
     * Synchronizes `message` with textarea value.
     * Also, resizes textarea to fit content height.
     *
     * @param event         `input` event.
     */
    public textChangeHandler(event: InputEvent): void {
        this.message = (event.target as HTMLInputElement).value;
        this.autoResize(event, 200);
    }

    /**
     * Resizes text area to fit content height.
     *
     * @param event         `input` event.
     * @param maxHeight     Max height value to be set.
     */
    public autoResize(event: InputEvent, maxHeight: number): void {
        const eventTarget = event.target as HTMLElement;
        if(!eventTarget) return;

        if (eventTarget.scrollHeight <= maxHeight) {
            eventTarget.style.height = 'auto';
            eventTarget.style.height = `${eventTarget.scrollHeight}px`;

            const target: HTMLElement = document.querySelector(
                '.contacts__list-body',
            ) as HTMLElement;

            if (!target) return;

            eventTarget.style.bottom =
                `${(target.scrollHeight as number) + 17}px`;
        }
    }

    /**
     * Closes forward interface.
     */
    public close(): void {
        this.$emit('close');
    }

    /**
     * Sends selected messages or media objects to selected contacts.
     */
    public send(): void {
        this.$emit('send', this.message);
    }
}
