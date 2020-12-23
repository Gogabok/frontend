import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { copyTextToClipboard } from 'utils/clipboard';
import { formatUserNum } from 'utils/strings';

import { User } from 'models/User';

import CopyIcon from 'components/icons/CopyIcon.vue';


/**
 * Component containing profile owner's contact information.
 */
@Component({
    components: {
        'copy-icon': CopyIcon,
    },
})
export default class ContactInformation extends Vue {
    /**
     * Profile owner.
     */
    @Prop({
        default: () => ({}),
        type: Object,
    }) profileOwner: User;

    /**
     * Formats user num in `xxxx xxxx xxxx xxxx` format.
     *
     * @param num                       User num.
     */
    public formatUserNum: (num: string) => string = formatUserNum;

    /**
     * Profile link to be shared.
     */
    public get link(): string {
        return `${location.origin}/profile/${this.profileOwner.id}`;
    }

    /**
     * Copies `value` to clipboard.
     *
     * @param value                     Value to be copied.
     */
    public copy(value: string): void {
        copyTextToClipboard(value);
    }
}
