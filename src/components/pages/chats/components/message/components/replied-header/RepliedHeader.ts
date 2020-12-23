import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import QuotesIcon from 'components/icons/QuotesIcon.vue';


/**
 * Replied message header component. Indicates that message message sent as a
 * reply to another one.
 */
@Component({
    components: {
        'quotes-icon': QuotesIcon,
    },
})
export default class RepliedHeader extends Vue {
    /**
     * Indicator whether someone replied to client's message.
     */
    @Prop({
        default: false,
        required: true,
        type: Boolean,
    }) isRepliedToClientMessage;


    /**
     * `num` of the user who replied to the message.
     */
    @Prop({
        default: '',
        required: true,
        type: String,
    })  repliedByNum;

    /**
     * Label for who did reply to the message.
     */
    get repliedByText(): string {
        return this.isRepliedToClientMessage ? 'You' : this.repliedByNum;
    }
}

