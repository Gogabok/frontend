import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { User } from 'models/User.ts';

import UsersModule from 'store/modules/users';

import { GET_ALL_USERS } from 'store/modules/users/getters';

import CheckedIcon from 'components/icons/CheckedIcon.vue';
import PlusIcon from 'components/icons/PlusIcon.vue';


const usersModule = namespace(UsersModule.vuexName);

/**
 * Component containing list of all users whom current app user can send invite
 * to join the call.
 */
@Component({
    components: {
        'checked-icon': CheckedIcon,
        'plus-icon': PlusIcon,
    },
})
export default class UsersSelectList extends Vue {
    /**
     * List of users users choose.
     */
    @Prop({
        default: () => ([]),
        type: Array,
    }) selectedUsers: User[];

    /**
     * Search string.
     */
    @Prop({
        default: '',
        type: String,
    }) searchString;

    /**
     * Alphabet array.
     */
    public alphabetArray: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');

    /**
     * All users of the user.
     */
    @usersModule.Getter(GET_ALL_USERS)
    public users: User[];

    /**
     * Users, sorted alphabetically.
     */
    public get sortedUsers(): {[key: string]: User[]} {
        const alphabet: {[key: string]: User[]} = {};
        this.filteredUsers.forEach(user => {
            const firstNameLetter = (user.name || user.num)
                .toLowerCase()
                .split('')[0];
            if(!alphabet[firstNameLetter]) {
                alphabet[firstNameLetter] = [];
            }
            alphabet[firstNameLetter].push(user);
        });
        return alphabet;
    }

    /**
     * Users, filtered by search string.
     */
    public get filteredUsers(): User[] {
        return this.users.filter(user =>
            (user.num.toLowerCase()).indexOf(
                this.searchString.toLowerCase(),
            ) !== -1
            || (user.name && user.name.toLowerCase().indexOf(
                this.searchString.toLowerCase()) !== -1
            ),
        );
    }

    /**
     * Avatar to be displayed for a specific user.
     *
     * @param user                      User, whose avatar should be set.
     */
    public getAvatar(user: User): string {
        return user.avatarPath || require('~assets/img/default_avatar.svg');
    }

    /**
     * Selects/deselects chosen user.
     *
     * @param user                      User to be selected/deselected.
     */
    public handleUsersClick(user: User): void {
        this.$emit('user-choose', user);
    }
}
