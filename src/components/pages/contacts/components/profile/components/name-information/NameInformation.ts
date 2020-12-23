import { mixins } from 'vue-class-component';
import { Component, Prop, Watch } from 'vue-property-decorator';

import { Chat } from 'models/Chat';
import { Contact } from 'models/Contact';
import { User } from 'models/User';

import ProfileFieldProgressIndicator from 'mixins/profileFieldProgressIndicator';

import CheckedIcon from 'components/icons/CheckedIcon.vue';
import PencilIcon from 'components/icons/PencilIcon.vue';


/**
 * Component letting user to change name of the contact and displaying the
 * profile owner's about information.
 */
@Component({
    components: {
        'accept-icon': CheckedIcon,
        'pencil-icon': PencilIcon,
    },
})
export default class NameInformationSection extends mixins(
    ProfileFieldProgressIndicator,
) {
    /**
     * Profile owner.
     */
    @Prop({
        default: () => ({}),
        type: Object,
    }) profileOwner: Contact | User | Chat;

    /**
     * Changes contact's name.
     */
    @Prop({ required: true }) changeName: (payload: {
        id: string,
        name: string,
    }) => Promise<void>;

    /**
     * Indicator whether profile owner is in user's contacts list.
     */
    @Prop({ required: true }) isContact: boolean;

    /**
     * Local name.
     */
    public localName: string = '';

    /**
     * Name input field by ref.
     */
    public get input(): HTMLInputElement {
        return this.$refs.nameField as HTMLInputElement;
    }

    /**
     * Disables edit mode. Also, calls `changeContactNameAction`.
     */
    public async save(): Promise<void> {
        this.disableEditMode();
        this.startLoading();
        await this.changeName({
            id: this.profileOwner.id,
            name: this.localName,
        });
        this.succeed();
    }

    /**
     * Enables edit mode.
     */
    public edit(): void {
        this.enableEditMode();
    }

    /**
     * Synchronizes `localName` value to profile owner's account data.
     */
    @Watch('profileOwner')
    watchUser(): void {
        this.localName = this.profileOwner.name || this.profileOwner.num;
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to set the local name.
     */
    public mounted(): void {
        this.localName = this.profileOwner.name || this.profileOwner.num;
    }
}
