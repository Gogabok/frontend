import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { MessageAttachment } from 'models/Attachment';
import { Message } from 'models/Message';


/**
 * Replied message component. Shows message, user replied to and scroll dialog
 * to replied message on click.
 */
@Component
export default class RepliedMessage extends Vue {
    /**
     * Message object user replied to.
     */
    @Prop() repliedMessage: Message;

    /**
     * Indicator whether someone replies to client's message.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isRepliedToClientMessage;

    /**
     * Label for the message.
     */
    get label(): string {
        const hasTextMessage: boolean = !!this.repliedMessage.message;

        const conditions: {[key: number]: boolean} = {
            0:  hasTextMessage,
            1:  !hasTextMessage
                && !!this.repliedMessage.attachment
                && !!this.repliedMessage.attachment.name,
            2:  !hasTextMessage
                && !!this.repliedMessage.attachment
                && (
                    this.repliedMessage.attachment.type === ('audio')
                    || this.repliedMessage.attachment.type === ('video')
                ),
            3:  !hasTextMessage && !!this.repliedMessage.mediaGroup,
        };

        const actions: {[key: number]: () => string} = {
            0: () => {
                return this.repliedMessage.message;
            },
            1: () => {
                const attachment =
                    <MessageAttachment>this.repliedMessage.attachment;
                return`${attachment.name}.${attachment.type}`;
            },
            2: () => {
                const attachment =
                    <MessageAttachment>this.repliedMessage.attachment;
                return attachment.type === 'video'
                    ? 'Video message'
                    : 'Audio message';
            },
            3: () => {
                return `Total: ${
                    (<MessageAttachment[]>this.repliedMessage.mediaGroup).length
                } files`;
            },
        };

        const labelString: string[] = Object.entries(conditions).reduce(
            (result, [key, cond]) => cond
                ? result.concat(actions[key]())
                : result,
            [],
        );

        return labelString.join('\n');
    }

    /**
     * Condition and link for the replied message image.
     */
    get imageInfo(): {visible: boolean, link: string} {
        const conditions: {[key: number]: boolean} = {
            0:  !!this.repliedMessage.attachment
                && !!this.repliedMessage.attachment.poster,
            1:  !!this.repliedMessage.mediaGroup,
        };

        const actions: {[key: number]: () => {visible: boolean, link: string}} =
            {
                0: () => {
                    return {
                        link: this.repliedMessage.attachment?.poster as string,
                        visible: true,
                    };
                },
                1: () => {
                    return {
                        link: (
                            <MessageAttachment[]>this.repliedMessage.mediaGroup
                        )[0].src as string,
                        visible: true,
                    };
                },
            };

        const result = Object.entries(conditions)
            .find(([, cond]) => cond);
        return result
            ? actions[result[0]]()
            : { link: '', visible: false };
    }

    /**
     * Emits event to the parent to scroll to the message.
     */
    public scrollTo(): void {
        this.$emit('scroll-to-message', this.repliedMessage.id);
    }
}
