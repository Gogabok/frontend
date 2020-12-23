import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { User } from 'models/User';

import UsersModule from 'store/modules/users';

import { GET_USER_BY_ID } from 'store/modules/users/getters';


const userIdsModule = namespace(UsersModule.vuexName);

/**
 * Component displaying a group member.
 */
@Component
export default class MemberItem  extends Vue {
    /**
     * User ID of this member.
     */
    @Prop({ required: true }) userId: string;

    /**
     * Indicator whether item card is used to display current app user's
     * account.
     */
    @Prop({ default: false }) isSelf: boolean;

    /**
     * Retrieves user information by its ID.
     *
     * @param payload                   Action parameters.
     * @param payload.id                ID of the userId to get information of.
     */
    @userIdsModule.Getter(GET_USER_BY_ID)
    public getUserById: (payload: { id: string }) => User;

    /**
     * User information to be displayed on the card.
     */
    public get userInformation(): User| null {
        return this.getUserById({ id: this.userId }) || null;
    }

    /**
     * Emits `open-tools-menu` event to open card tools menu.
     */
    public openToolsMenu(): void {
        if (this.isSelf) return;
        this.$emit('open-tools-menu');
    }
}
