import { mixins } from 'vue-class-component';
import { Component, Prop } from 'vue-property-decorator';

import { changeAbout } from 'utils/profileRequests';

import { CurrentUser } from 'models/CurrentUser';

import ProfileFieldProgressIndicator from 'mixins/profileFieldProgressIndicator';

import CheckedIcon from 'components/icons/CheckedIcon.vue';
import PencilIcon from 'components/icons/PencilIcon.vue';
import WatchIcon from 'components/icons/WatchIcon.vue';


/**
 * Component that shows user's about information and lets user to modify it.
 */
@Component({
    components: {
        'accept-icon': CheckedIcon,
        'loading-icon': WatchIcon,
        'pencil-icon': PencilIcon,
    },
})
export default class ProfileAboutSection extends mixins(
    ProfileFieldProgressIndicator,
) {
    /**
     * Updates user's about information.
     */
    @Prop({ required: true }) changeUserData: (payload: {
        data: Record<string, unknown>,
    }) => Promise<void>;

    /**
     * Current user account information.
     */
    @Prop({ required: true }) user: CurrentUser;

    /**
     * Local user about information.
     */
    public localAbout: string = '';

    /**
     * About input elements by ref.
     */
    public get input(): HTMLInputElement {
        return this.$refs.aboutInput as HTMLInputElement;
    }

    /**
     * Enables edit mode.
     */
    public edit(): void {
        this.enableEditMode();
    }

    /**
     * Updates user's about information.
     * Also, disabled edit mode, displays action status when request is fished.
     */
    public async save(): Promise<void> {
        this.disableEditMode();
        if(this.localAbout === this.user.about) return;
        this.startLoading();
        const isOk = await changeAbout({
            about: this.localAbout,
            id: this.user.id,
        });

        if(isOk) {
            await this.changeUserData({ data: { about: this.localAbout } });
            this.succeed();
        } else {
            this.fail();
        }
    }

    /**
     * Resizes event target to fit content's height.
     *
     * @param event         `input` event.
     * @param height        Max height to be set.
     */
    public handleResize(event: InputEvent, height: number): void {
        const target = event.target as HTMLInputElement;
        target.style.height = 'auto';
        if(target.clientHeight < target.scrollHeight) {
            target.style.height = `${target.scrollHeight}px`;
            if(target.clientHeight > height) {
                target.style.height = `${height}px`;
            }
        }
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to set `localAbout` value.
     */
    public mounted(): void {
        this.localAbout = this.user.about;
    }
}
