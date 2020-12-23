import { Component, Prop, Vue } from 'vue-property-decorator';

import AngleIcon from 'components/icons/AngleIcon.vue';


/**
 * Responsive bottom menu component, that contains two left and right aligned
 * blocks with navigation links.
 */
@Component({
    components: {
        AngleIcon,
    },
})
export default class ContactPreview extends Vue {

    /**
     * Get user status (`offline` by default).
     */
    @Prop({
        default: 'is-offline',
        type: String,
    }) status: string | undefined;

    /**
     * ID of the current app user.
     */
    @Prop({
        default: '',
        type: String,
    }) id: string;

    /**
     * Get avatar path.
     */
    @Prop({
        default: '',
        type: String,
    }) avatarPath: string | undefined;

    /**
     * Get user num.
     */
    @Prop({
        default: 'Guest',
        type: String,
    }) num: string | undefined;

    /**
     * Indicator whether card is for the current application user.
     * If so, client will be able to change the status using the dropdown menu.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isUserContact: boolean | undefined;

    /**
     * Indicator whether this card displays contact the user is currently
     * chatting with.
     */
    @Prop({
        default: false,
        required: false,
    }) isActive: boolean;

    /**
     * Indicator whether dropdown is open or not.
     */
    public statusDropdownActive: boolean = false;

    /**
     * Toggles dropdown opening.
     */
    public handleDropdown(): void {
        this.statusDropdownActive = !this.statusDropdownActive;
    }

    /**
     * Text of a status label.
     */
    get statusLabel(): string {
        switch(this.status) {
            case 'is-online':
                return 'Online';
            case 'is-away':
                return 'Await';
            case 'is-busy':
                return 'Do not disturb';
            case 'is-live':
                return 'Live';
            case 'is-offline':
            default:
                return 'Offline';
        }
    }
}
