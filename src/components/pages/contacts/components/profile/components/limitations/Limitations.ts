import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { User } from 'models/User';

import BlockIcon from 'components/icons/Cancel.vue';
import LeaveIcon from 'components/icons/LeaveIcon.vue';
import MuteIcon from 'components/icons/MuteIcon.vue';
import ProfileItem from 'components/pages/contacts/components/profile/components/profile-item/ProfileItem.vue';


/**
 * Component letting user to block or mute/unmute the profile owner.
 *
 * Also, allows user to leave the group on chat's profile.
 */
@Component({
    components: {
        'block-icon': BlockIcon,
        'leave-icon': LeaveIcon,
        'mute-icon': MuteIcon,
        'profile-item': ProfileItem,
    },
})
export default class LimitationSection extends Vue {
    /**
     * Profile's owner.
     */
    @Prop({ required: true }) profileOwner: User;

    /**
     * Indicator whether mute options are visible.
     */
    public isMuteOptionsVisible: boolean = false;

    /**
     * Block button label based on profile owner's block state.
     */
    public get blockLabel(): string {
        if(!this.profileOwner) return '';
        return this.profileOwner.isBlocked
            ? `Unblock ${this.profileOwner.name || this.profileOwner.num}`
            : `Block ${this.profileOwner.name || this.profileOwner.num}`;
    }

    /**
     * Mute button label based on profile owner's `isMuted` state.
     */
    public get muteLabel(): string {
        if(!this.profileOwner) return '';
        if(!this.profileOwner.isMuted) return 'Mute';

        if(this.profileOwner.mutedUntil === Infinity) {
            return 'Muted until forever';
        }
        const mutedUntil = new Date(this.profileOwner.mutedUntil as number);
        let day = mutedUntil.getHours().toString();
        let month = (mutedUntil.getMonth() + 1).toString();
        let year = (mutedUntil.getFullYear()).toString();

        day = day.length < 2 ? `0${day}` : day;
        month = month.length < 2 ? `0${month}` : month;
        year = year.length < 2 ? `0${year}` : year;

        return `Muted until ${day}.${month}.${year}`;
    }

    /**
     * List of mute options.
     */
    public get options(): Array<{
        label: string,
        value: number,
    }> {
        const durationOptions: Array<{
            label: string,
            value: number,
        }> = [
            {
                label: '15 minutes',
                value: 1000 * 60 * 15,
            },
            {
                label: '1 hour',
                value: 1000 * 60 * 60,
            },
            {
                label: '8 hours',
                value: 1000 * 60 * 60 * 8,
            },
            {
                label: '1 day',
                value: 1000 * 60 * 60 * 24,
            },
            {
                label: 'Until unmuted',
                value: Infinity,
            },
        ];
        return durationOptions;
    }

    /**
     * Sets mute options visibility state.
     *
     * @param value                     Indicator whether mute options are
     *                                  visible.
     */
    public setMuteOptionsVisibility(value: boolean): void {
        this.isMuteOptionsVisible = value;
    }

    /**
     * Unmutes profile owner if it has already been muted. Toggles mute options
     * visibility state otherwise.
     */
    public muteClickHandler(): void {
        if(!this.profileOwner) return;

        this.profileOwner.isMuted
            ? this.$emit('unmute')
            : this.setMuteOptionsVisibility(!this.isMuteOptionsVisible);
    }

    /**
     * Mutes/unmutes the profile owner.
     *
     * @param value                     Mute duration.
     */
    public muteDurationClickHandler(value?: number): void {
        this.$emit('mute', value);
        this.setMuteOptionsVisibility(false);
    }

    /**
     * Blocks/unblocks the profile owner.
     */
    public async blockHandler(): Promise<void> {
        this.$emit('block');
    }

    /**
     * Emits `leave` event to the parent component to leave the group.
     */
    public leaveGroup(): void {
        this.$emit('leave');
    }
}
