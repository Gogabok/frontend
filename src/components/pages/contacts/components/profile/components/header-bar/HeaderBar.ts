import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { getPoster } from 'utils/files';

import { CallType } from 'models/Call';
import { Contact } from 'models/Contact';
import {
    ProfileMediaItem,
    ProfileMediaItemType,
} from 'models/ProfileMediaItem';
import { User } from 'models/User';

import CallModule from 'store/modules/call';
import GeneralParameters from 'store/modules/general-parameters';

import { CALL_TO } from 'store/modules/call/actions';
import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';

import AngleIcon from 'components/icons/AngleIcon.vue';
import CallIcon from 'components/icons/CallIcon.vue';
import ChatIcon from 'components/icons/Chats.vue';
import VideoCameraIcon from 'components/icons/VideoCameraIcon.vue';


const generalParameters = namespace(GeneralParameters.vuexName);
const callModule = namespace(CallModule.vuexName);

/**
 * Component allowing user to close the profile.
 *
 * Also, it lets to text or make a call to the profile owner (if it's a person's
 * profile) or to upload a new gallery media item if it's a chat's profile.
 */
@Component({
    components: {
        'angle-icon': AngleIcon,
        'call-icon': CallIcon,
        'chat-icon': ChatIcon,
        'video-camera-icon': VideoCameraIcon,
    },
})
export default class HeaderBar extends Vue {
    /**
     * Profile owner.
     */
    @Prop({
        default: () => ({}),
        type: Object,
    }) profileOwner: User | Contact;

    /**
     * Adds file to chat's gallery.
     */
    @Prop({ required: true }) addFileToGallery: (payload: {
        chatId: string,
        item: ProfileMediaItem,
    }) => Promise<void>;

    /**
     * Indicator whether profile owner is in contacts list.
     */
    @Prop({ required: true }) isContact: boolean;

    /**
     * `CallType` enum to get access to it from the template.
     */
    public CallType: typeof CallType = CallType;

    /**
     * Indicator whether mobile mode is active.
     */
    @generalParameters.Getter(IS_MOBILE_MODE)
    public isNativeMobileMode: boolean;

    /**
     * Indicator whether force mobile mode is active.
     */
    @generalParameters.Getter(IS_FORCE_MOBILE_MODE)
    public isForceMobileMode: boolean;

    /**
     * Indicator whether mobile mode is active (whether it's native or force).
     */
    public get isMobileMode(): boolean {
        return this.isNativeMobileMode || this.isForceMobileMode;
    }

    /**
     * List of media files that can be uploaded.
     */
    public get mediaFileTypes(): string {
        return `image/*,
            video/mp4,
            video/m4a,
            video/m4v,
            video/f4v,
            video/ogg,
            video/wmv,
        `;
    }

    /**
     * Indicator whether back button is visible.
     */
    public get isBackButtonVisible(): boolean {
        return !this.$route.path.includes('contacts') || this.isMobileMode;
    }

    /**
     * Input element by ref.
     */
    public get input(): HTMLInputElement {
        return this.$refs.uploader as HTMLInputElement;
    }

    /**
     * Makes a call to the profile owner.
     *
     * @param id                            ChatID of the user to call to.
     * @param type                          Call type to call with
     *                                      ('audio'|'video').
     */
    @callModule.Action(CALL_TO)
    public callToAction: (payload: {
        id: string,
        type: CallType,
    }) => Promise<void>;

    /**
     * Opens files upload system window.
     */
    public uploadMediaFiles(): void {
        this.input.click();
    }

    /**
     * Reads and adds each file to group gallery.
     *
     * @param event                         `input` event.
     */
    public fileUploadHandler(event: InputEvent): void {
        const files = (event.target as HTMLInputElement).files as FileList;
        for(let i = 0; i < files.length; i++) {
            this.sendFile(files[i], i, files.length - 1);
        }
    }

    /**
     * Reads and adds each file to group gallery.
     *
     * @param file                          File to be read.
     * @param index                         Index of the element
     * @param total                         Index of the last element.
     */
    public async sendFile(
        file: File,
        index: number,
        total: number,
    ): Promise<void> {
        function getItemType(file: File): ProfileMediaItemType {
            return file.type.includes('image') ? 'image' : 'video';
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async (): Promise<void> => {
            this.addFileToGallery({
                chatId: this.$route.query.id as string,
                item: {
                    id: ( new Date().getTime()
                        + Math.round(Math.random() * 1000)).toString(),
                    poster: await getPoster(file, reader.result as string),
                    src: reader.result as string,
                    type: getItemType(file),
                },
            })
                .then(() => {
                    if(index === total) {
                        this.input.value = '';
                        this.$root.$emit('update-chat-gallery');
                    }
                });
        };
    }

    /**
     * Emits `close` event to close profile.
     */
    public close(): void {
        this.$emit('close');
    }

    /**
     * Makes a call to the profile owner.
     */
    public callHandler(type: CallType): void {
        this.$emit('call', type);
    }

    /**
     * Opens a chat with the profile owner.
     */
    public writeMessage(): void {
        this.$emit('message');
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to add `upload-images` event
     * listener.
     */
    public mounted(): void {
        this.$parent.$on('upload-images', this.uploadMediaFiles);
    }

    /**
     * Hooks `beforeDestroy` Vue lifecycle stage to remove `upload-images`
     * event listener.
     */
    public beforeDestroy(): void {
        this.$parent.$off('upload-images', this.uploadMediaFiles);
    }
}
