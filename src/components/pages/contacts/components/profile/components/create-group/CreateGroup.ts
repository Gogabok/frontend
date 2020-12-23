import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import AddMemberIcon from 'components/icons/AddMemberIcon.vue';
import ProfileItem from 'components/pages/contacts/components/profile/components/profile-item/ProfileItem.vue';


/**
 * Component allowing user to create a new group.
 */
@Component({
    components: {
        'add-member-icon': AddMemberIcon,
        'profile-item': ProfileItem,
    },
})
export default class CreateGroup extends Vue {
    /**
     * Emits `create-group` event to create a group with this person.
     */
    public createGroup(): void {
        this.$emit('create-group');
    }
}
