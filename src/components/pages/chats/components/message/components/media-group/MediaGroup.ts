import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { Message } from 'models/Message';


/**
 * Media group message element.
 */
@Component
export default class MediaGroup extends Vue {
    /**
     * Message object.
     */
    @Prop({
        type: Object,
    }) message: Message;

    /**
     * Opens file in player.
     *
     * @param src        Link to the file to be opened.
     */
    public openFile(src: string): void {
        this.$emit('open-player', src);
    }
}
