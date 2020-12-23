import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { CurrentUser } from 'models/CurrentUser';
import { UserStatus, UserStatusCode } from 'models/UserStatus';

import UserModule from 'store/modules/user';

import {
    ADD_CUSTOM_STATUS,
    CHANGE_STATUS,
    DELETE_CUSTOM_STATUS,
} from 'store/modules/user/actions';
import {
    GET_USER_DATA,
    GET_USER_STATUSES_LIST,
} from 'store/modules/user/getters';

import StatusOption from 'components/common/status-dropdown/components/status-option/StatusOption.vue';
import AngleIcon from 'components/icons/AngleIcon.vue';
import PencilIcon from 'components/icons/PencilIcon.vue';


type StatusWithoutId = {
    [K in keyof UserStatus as Exclude<K, 'id'>]: UserStatus[K]
};

const userModule = namespace(UserModule.vuexName);

/**
 * Element allowing user to select an active status or create its own custom
 * status.
 */
@Component({
    components: {
        'angle-icon': AngleIcon,
        'pencil-icon': PencilIcon,
        'status-option': StatusOption,
    },
})
export default class StatusDropdown extends Vue {
    /**
     * Indicator whether dropdown is opened (list of options visible).
     */
    @Prop() isOpen: boolean;

    /**
     * New status input model.
     */
    public newStatus: string = '';

    /**
     * Adds custom status to user's list of statuses.
     *
     * @param payload                   Action parameters.
     * @param payload.status            Status to be added.
     */
    @userModule.Action(ADD_CUSTOM_STATUS)
    public addCustomStatusAction: (payload: {
        status: StatusWithoutId,
    }) => Promise<UserStatus>;

    /**
     * Deletes custom status from user's list of statuses.
     *
     * @param payload                   Action parameters.
     * @param payload.statusId          ID of the status to be removed.
     */
    @userModule.Action(DELETE_CUSTOM_STATUS)
    public deleteCustomStatusAction: (payload: {
        statusId: string,
    }) => Promise<void>;

    /**
     * Changes user's active status.
     *
     * @param payload                   Action parameters.
     * @param payload.statusId          ID of the status to be set.
     */
    @userModule.Action(CHANGE_STATUS)
    public changeUserStatusAction: (payload: {
        statusId: string,
    }) => Promise<void>;

    /**
     * List of user's statuses.
     */
    @userModule.Getter(GET_USER_STATUSES_LIST)
    public statusesList: UserStatus[];

    /**
     * Current app user's account information.
     */
    @userModule.Getter(GET_USER_DATA)
    public currentUser: CurrentUser;

    /**
     * Current status label.
     */
    public get currentStatus(): string {
        return {
            [UserStatusCode.Away]: 'Away',
            [UserStatusCode.Private]: 'Private',
            [UserStatusCode.Online]: 'Last visit information',
            [UserStatusCode.Custom]: this.currentUser.status.title,
        }[this.currentUser.status.code];
    }

    /**
     * Changes user's active status.
     *
     * @param statusId                  ID of the status to be set.
     */
    public changeUserStatus(statusId: string): void {
        this.changeUserStatusAction({ statusId })
            .then(this.emitChange);
    }

    /**
     * Creates custom status and add it to user's list of statuses.
     *
     * @param statusTitle               Status title to be show.
     */
    public addCustomStatus(statusTitle: string): void {
        this.clearNewStatusField();
        const status: StatusWithoutId = {
            code: UserStatusCode.Custom,
            description: '',
            title: statusTitle,
        };
        this.addCustomStatusAction({ status })
            .then(status => this.changeUserStatus(status.id));
    }

    /**
     * Deletes custom status from user's list of statuses.
     *
     * @param statusId                  ID of the status to be removed.
     */
    public deleteCustomStatus(statusId: string): void {
        this.deleteCustomStatusAction({ statusId });
    }

    /**
     * Clears new status field value.
     */
    public clearNewStatusField(): void {
        this.newStatus = '';
    }

    /**
     * Emits `change` event to notify parent component about status change.
     */
    public emitChange(): void {
        this.$emit('change');
    }

    /**
     * Emits `open` event to notify parent component that user tries to open
     * dropdown.
     */
    public emitOpen(): void {
        this.$emit('open');
    }
}
