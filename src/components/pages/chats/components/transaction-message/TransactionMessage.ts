import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';


/**
 * Transaction message component.
 */
@Component
export default class TransactionMessage extends Vue {
    /**
     * Indicator whether dialog is being translated.
     */
    @Prop({
        default: false,
    }) isPayedDialog: boolean

    /**
     * Price of the message.
     */
    @Prop({
        default: '',
    }) messageCost: string

    /**
     * Text of the message.
     */
    @Prop({
        default: '',
    }) messageText: string

    /**
     * Sub text of the message.
     */
    @Prop({
        default: '',
    }) messageSubText: string
}
