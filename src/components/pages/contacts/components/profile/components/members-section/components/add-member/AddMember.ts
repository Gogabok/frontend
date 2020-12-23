import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { User } from 'models/User';

import AddMemberIcon from 'components/icons/AddMemberIcon.vue';
import ProfileItem from 'components/pages/contacts/components/profile/components/profile-item/ProfileItem.vue';

import Select from './components/select/Select.vue';


/**
 * Component allowing user add member to group chat.
 */
@Component({
    components: {
        'add-member-icon': AddMemberIcon,
        'contacts-select': Select,
        'profile-item': ProfileItem,
    },
})
export default class AddMember extends Vue {
    /**
     * Chat participants.
     */
    @Prop({ required: true }) participants: User;

    /**
     * Indicator whether select window is visible.
     */
    public isSelectVisible: boolean = false;

    /**
     * Adds member to the chat.
     */
    public addContactHandler(): void {
        // TODO: Add contact handler.
    }

    /**
     * Adds members to chat.
     *
     * @param ids                       IDs of the users to be added to chat.
     */
    public addMembers(ids: string[]): void {
        this.$emit('add-members', ids);
    }

    /**
     * Sets select window visibility state.
     *
     * @param isVisible                 New select window visibility state.
     */
    public setSelectVisibility(isVisible: boolean): void {
        this.isSelectVisible = isVisible;
    }
}
