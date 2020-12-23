import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import MessageIcon from 'components/icons/Chats.vue';
import Action from 'components/pages/contacts/components/own-profile/components/action/Action.vue';


/**
 * Component allowing user to open chat with itself.
 */
@Component({
    components: {
        'action': Action,
    },
})
export default class MessageAction extends Vue {
    /**
     * Message icon.
     */
    public MessageIcon = MessageIcon;

    /**
     * Navigates user to chat with itself.
     */
    public goToChat(): void {
        this.$router.push({
            path: '/chats',
            query: {
                id: this.$route.query.id,
            },
        });
    }
}
