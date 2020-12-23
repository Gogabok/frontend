import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { Chat } from 'models/Chat';
import { CurrentUser } from 'models/CurrentUser';
import { User } from 'models/User';

import UserModule from 'store/modules/user';

import { GET_USER_DATA } from 'store/modules/user/getters';

import AddMemberIcon from 'components/icons/AddMemberIcon.vue';
import MembersListIcon from 'components/icons/MembersListIcon.vue';
import ProfileItem from 'components/pages/contacts/components/profile/components/profile-item/ProfileItem.vue';

import MemberItem from './components/member-item/MemberItem.vue';


const userModule = namespace(UserModule.vuexName);

/**
 * Component allowing user to see and manipulate group members.
 */
@Component({
    components: {
        'add-member-icon': AddMemberIcon,
        'member-item': MemberItem,
        'members-list-icon': MembersListIcon,
        'profile-item': ProfileItem,
    },
})
export default class MembersSection extends Vue {
    /**
     * Profile owner.
     */
    @Prop({ required: true }) chat: Chat;

    /**
     * Indicator whether members list is visible.
     */
    public isExpanded: boolean = false;

    /**
     * Current app user account information.
     */
    @userModule.Getter(GET_USER_DATA)
    public currentAppUserData: CurrentUser;

    /**
     * List of chat participants.
     */
    public get participants(): User[] {
        return this.chat ? this.chat.participants : [];
    }

    /**
     * Sets members list visibility state.
     *
     * @param value                 New members list visibility state.
     */
    public setExpandedState(value: boolean): void {
        this.isExpanded = value;
    }

    /**
     * Emits `add-members` interface to add members to chat.
     */
    public addMembers(): void {
        this.$emit('add-members');
    }

    /**
     * Shows tools menu.
     */
    public openToolsMenu(id: string): void {
        // TODO: Add tools handler
        console.log('ID to open tools menu for:', id);
    }
}
