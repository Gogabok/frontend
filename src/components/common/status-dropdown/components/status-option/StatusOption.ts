import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { UserStatus, UserStatusCode } from 'models/UserStatus';

import PlusIcon from 'components/icons/PlusIcon.vue';


/**
 * Component representing status option.
 */
@Component({
    components: {
        'plus-icon': PlusIcon,
    },
})
export default class StatusOption extends Vue {
    /**
     * Status to be represented.
     */
    @Prop() status: UserStatus;

    /**
     * Indicator whether status is created by user or it's a system one.
     */
    public get isCustom(): boolean {
        return this.status.code === UserStatusCode.Custom;
    }

    /**
     * Status label in user-friendly format.
     */
    public get statusLabel(): string {
        return {
            [UserStatusCode.Away]: 'Away',
            [UserStatusCode.Private]: 'Private',
            [UserStatusCode.Online]: 'Last visit information (by default)',
            [UserStatusCode.Custom]: this.status.title,
        }[this.status.code];
    }

    /**
     * Emits `select` event to set the status active.
     */
    public select(): void {
        this.$emit('select');
    }

    /**
     * Emits `delete` event to delete the status.
     */
    public deleteStatus(): void {
        this.$emit('delete');
    }
}
