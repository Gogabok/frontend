import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import {
    Popup,
    PopupAlign,
    PopupType,
} from 'models/PopupSettings';

import DeleteIcon from 'components/icons/DeleteIcon.vue';
import Action from 'components/pages/contacts/components/own-profile/components/action/Action.vue';


/**
 * Component allowing user to delete account.
 */
@Component({
    components: {
        'action': Action,
    },
})
export default class DeleteAccountSection extends Vue {
    /**
     * Delete icon.
     */
    public DeleteIcon = DeleteIcon;

    /**
     * Opens confirmation for delete account action.
     * Removes account on resolve.
     */
    public deleteAccount(): void {
        this.$emit('open-popup', {
            popup: new Popup({
                confirmCallback: this.deleteAccountCB,
                id: `${new Date().getTime()}${PopupType.Confirm}`,
                settings: {
                    align: {
                        horizontal: PopupAlign.End,
                        vertical: PopupAlign.Center,
                    },
                    position: {
                        bottom: 0,
                        left: 0,
                        right: 0,
                        top: 0,
                    },
                    type: PopupType.Confirm,
                },
                textMessage: 'You are about to delete your account',
            }),
        });
    }

    /**
     * Emits `delete-account` event.
     */
    public deleteAccountCB(): void {
        this.$emit('delete-account');
    }
}
