import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { Message } from 'models/Message';

import PlusIcon from 'components/icons/PlusIcon.vue';
import QuotesIcon from 'components/icons/QuotesIcon.vue';


/**
 * Replied message bar component, that displays message, user is replying to.
 */
@Component({
    components: {
        'plus-icon': PlusIcon,
        'quotes-icon': QuotesIcon,
    },
})
export default class RepliedMessageBar extends Vue {
    /**
     * Message user is replying to.
     */
    @Prop({
        type: Object,
    }) message: Message;


    /**
     * Indicator whether message has media content to be previewed.
     */
    public get previewCondition(): boolean {
        return Boolean((this.message.attachment
            && (this.message.attachment.type ==='image'
                || this.message.attachment.type === 'video')
        )|| this.message.mediaGroup);
    }

    /**
     * Link to the image to be previewed.
     */
    public get previewLink(): string {
        return (this.message.attachment
            && (this.message.attachment.type ==='image'
                || this.message.attachment.type === 'video'))
            ? this.message.attachment.poster as string
            : this.message.mediaGroup
            ? this.message.mediaGroup[0].poster as string
            : '';
    }


    /**
     * Emits event to the ContactsInputField to clear the replied message.
     */
    public clearRepliedMessage(): void {
        this.$emit('clear-replied-message');
    }

    /**
     * Scrolls dialog to the replied message.
     *
     * @param e     Click event.
     */
    public scrollHandler(e: MouseEvent): void {
        if (
            this.$el.querySelector('.reply__close')?.contains(e.target as Node)
        ) {
            return;
        }

        const id = this.message.id;
        const message =
            document.querySelector(`[data-message-id="${id}"]`) as HTMLElement;

        const vueBarContainner =
            document.querySelector('.vue-bar-container') as HTMLElement;
        const vueBarContent =
            vueBarContainner?.querySelector('.vb-content') as HTMLElement;

        const vueBarContainnerHeight = vueBarContainner.offsetHeight;
        const messageHeight = message.offsetHeight;
        const messageTop = message.offsetTop;
        const repliedContainerHeight = (this.$el as HTMLElement).offsetHeight;

        const diff =
            messageTop - vueBarContainnerHeight
            + messageHeight + repliedContainerHeight + 55;

        vueBarContent.classList.add('scroll-smooth');
        vueBarContent.scrollTop = diff;

        setTimeout(() => {
            vueBarContent.classList.remove('scroll-smooth');
            message.classList.add('message-active');
        }, 600);
        setTimeout(() => {
            message.classList.remove('message-active');
        }, 1000);
    }

}
