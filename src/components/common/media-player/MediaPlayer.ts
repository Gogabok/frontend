import 'swiper/swiper-bundle.css';

import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { clamp } from 'utils/math';

import { MessageAttachment } from 'models/Attachment';

import ChatsModule from 'store/modules/chats';
import UserModule from 'store/modules/user';
import UsersModule from 'store/modules/users';

import { DELETE_ATTACHMENT } from 'store/modules/chats/actions';
import { DELETE_PROFILE_GALLERY_ITEM } from 'store/modules/user/actions';
import { DELETE_USER_GALLERY_FILE } from 'store/modules/users/actions';

import PlayIcon from 'components/icons/PlayIcon.vue';
import PauseIcon from 'components/icons/PauseIcon.vue';

import ControlsPanel from './components/controls-panel/ControlsPanel.vue';
import VideoPlayerHeader from './components/header/Header.vue';
import MediaLine from './components/media-line/MediaLine.vue';
import Slider from './components/slider/Slider.vue';


const chatsModule = namespace(ChatsModule.vuexName);
const userModule = namespace(UserModule.vuexName);
const usersModule = namespace(UsersModule.vuexName);

/**
 * Media player component.
 */
@Component({
    components: {
        'controls-panel': ControlsPanel,
        'media-line': MediaLine,
        'pause-icon': PauseIcon,
        'play-icon': PlayIcon,
        'slider': Slider,
        'video-player-header': VideoPlayerHeader,
    },
})
export default class MediaPlayer extends Vue {
    /**
     * Closes player.
     */
    @Prop({
        default: () => undefined,
        type: Function,
    }) closeVideoPlayer;

    /**
     * list of imager/videos to be shown in the player.
     */
    @Prop({
        default: () => ([]),
        type: Array,
    }) gallery: MessageAttachment[];

    /**
     * Which image should be visible when player appears.
     */
    @Prop({
        default: '',
        type: String,
    }) idOnOpen;

    /**
     * Index of active slide.
     */
    public activeSlideIndex: number = 0;

    /**
     * Indicator whether player interface is visible.
     */
    public isInterfaceVisible: boolean = true;

    /**
     * Indicator whether select mode is active.
     */
    public isSelectMode: boolean = false;

    /**
     * Indicator whether media line mode is active.
     */
    public isMediaLineMode: boolean = false;

    /**
     * List of chosen media.
     */
    public selectedMedia: MessageAttachment[] = [];

    /**
     * Indicator whether controls panel should be visible.
     */
    public get isControlsPanelVisible(): boolean {
        return (this.isInterfaceVisible && !this.isMediaLineMode)
            || (this.isMediaLineMode && this.isSelectMode);
    }

    /**
     * Forwards active slide on slider mode or all selected media items on media
     * line mode.
     */
    public forwardHandler(): void {
        if(this.isMediaLineMode) {
            this.forwardMedia(this.selectedMedia);
        } else {
            this.forwardMedia([this.gallery[this.activeSlideIndex]]);
        }
    }

    /**
     * Saves active slide on slider move or all selected media items on media
     * line mode.
     */
    public controlsSaveHandler(): void {
        const saveSingle = ({ src }) => {
            const link = src;
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', link);
            linkElement.setAttribute('download', link);
            linkElement.setAttribute('target', '_blank');
            document.body.append(linkElement);
            linkElement.click();
            document.body.removeChild(linkElement);
        };

        if(this.isMediaLineMode) {
            this.selectedMedia.forEach(saveSingle);
        } else {
            saveSingle(this.gallery[this.activeSlideIndex]);
        }
    }

    /**
     * Deletes attachments in the chat.
     *
     * @param payload                   Action parameters.
     * @param payload.id                ID of the attachment to be deleted.
     * @param payload.targetId          ID of the chat to delete attachment in.
     */
    @chatsModule.Action(DELETE_ATTACHMENT)
    public deleteAttachmentAction: (payload: {
        id: string,
        targetId: string,
    }) => Promise<void>;

    /**
     * Deleter gallery item from chat profile.
     * TODO: Add store logic for this action.
     *
     * @param payload                   Action parameters.
     * @param payload.id                ID of the chat to delete item in.
     * @param payload.itemId            ID of the item to be deleted.
     */
    @usersModule.Action(DELETE_USER_GALLERY_FILE)
    public deleteProfileItem: (payload: {
        id: string,
        itemId: string,
    }) => Promise<void>;

    /**
     * Deletes gallery item from current user's profile.
     * TODO: Add store logic for this action.
     *
     * @param payload                   Action parameters.
     * @param payload.id                ID of the item to be deleted.
     */
    @userModule.Action(DELETE_PROFILE_GALLERY_ITEM)
    public deleteOwnProfileItem: (payload: {
        id: string,
    }) => Promise<void>;

    /**
     * Deletes active slide on slider mode or all selected media items on media
     * line mode.
     */
    public controlsDeleteHandler(): void {
        // TODO: Show notification whether user is sure.
        const deleteSingle = ({ id }) => {
            this.deleteAttachmentAction({
                id,
                targetId: this.$route.query.id as string,
            });
        };

        const deleteSingleInProfile = ({ id }) => {
            (this.$route.path.includes('profile')
                ? id => this.deleteOwnProfileItem({ id })
                : id => this.deleteProfileItem({
                    id: this.$route.query.id as string,
                    itemId: id,
                }))(id);
        };

        const deleteFunc = (action: (item: MessageAttachment) => void) => {
            const idsToRemove = this.isMediaLineMode
                ? this.selectedMedia
                : this.gallery[this.activeSlideIndex];

            removeFromSlider();

            Array.isArray(idsToRemove)
                ? idsToRemove.forEach(action)
                : action(idsToRemove);
        };

        const removeFromSlider = () => {
            if(this.$refs.slider) {
                // Used there due to lack of type definitions for swiper lib.
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const swiper = this.$refs.slider.mySwiper.$swiper;
                const idsToRemove = this.isMediaLineMode
                    ? this.selectedMedia
                    : this.activeSlideIndex;
                swiper.virtual.removeSlide(idsToRemove);
                swiper.virtual.update();
                swiper.pagination.update();
            }
        };

        this.$route.query.profile || this.$route.path.includes('profile')
            ? deleteFunc(deleteSingleInProfile)
            : deleteFunc(deleteSingle);
    }

    /**
     * Shares active slide on slider mode or all selected media items on media
     * line mode.
     */
    public controlsShareHandler(): void {
        const textToShare = this.isMediaLineMode
            ? this.selectedMedia.reduce(
                (acc, media) => `${acc}${media.src}\n`, '')
            : this.gallery[this.activeSlideIndex].src;


        const myNavigator = navigator as (typeof navigator & {
            share: (payload: {
                text: string,
                title: string,
                url: string,
            }) => Promise<void>,
        });

        if(myNavigator.share) {
            myNavigator.share({
                text: textToShare,
                title: 'File from the Gapopa Messenger',
                url: window.location.href,
            })
                .catch(e => console.error(e));
        }
    }

    /**
     * Shows or hides interface based on provided value.
     *
     * @param newState                  Indicator whether interface is visible.
     */
    public setInterfaceHandler(newState: boolean): void {
        newState
            ? this.showInterface()
            : this.hideInterface();
    }

    /**
     * Hides player interface.
     */
    hideInterface(): void {
        const paginationContainer = this.$el.querySelector(
            '.swiper-pagination.swiper-pagination-bullets',
        );

        this.isInterfaceVisible = false;

        if(!paginationContainer) return;
        if(!paginationContainer.classList.contains(
            'swiper-pagination-bullets-hidden',
        )) {
            paginationContainer.classList.add(
                'swiper-pagination-bullets-hidden',
            );
        }
    }

    /**
     * Shows player interface.
     */
    showInterface(): void {
        const paginationContainer = this.$el.querySelector(
            '.swiper-pagination.swiper-pagination-bullets',
        );

        this.isInterfaceVisible = true;

        if(!paginationContainer) return;
        if(paginationContainer.classList.contains(
            'swiper-pagination-bullets-hidden',
        )) {
            paginationContainer.classList.remove(
                'swiper-pagination-bullets-hidden',
            );
        }
    }

    /**
     * Adds or removes media item from list of selected ones.
     *
     * @param item                      Item to be added or removed.
     */
    public selectMediaHandler(item: MessageAttachment): void {
        this.selectedMedia.includes(item)
            ? this.selectedMedia = this.selectedMedia.filter(i => i !== item)
            : this.selectedMedia.push(item);
    }

    /**
     * Sets select mode state.
     *
     * @param value                     New select mode state.
     */
    public setSelectMode(value: boolean): void {
        this.isSelectMode = value;
        if(!this.isSelectMode) {
            this.selectedMedia = [];
        }
    }

    /**
     * Sets media line mode state.
     *
     * @param value                     New media line mode state.
     */
    public setMediaLineMode(value: boolean): void {
        this.isMediaLineMode = value;
    }

    /**
     * Checks or unchecks all media elements.
     */
    public checkAllMediaHandler(): void {
        if (this.selectedMedia.length === this.gallery.length) {
            this.selectedMedia = [];
        } else {
            this.selectedMedia = this.gallery;
        }
    }

    /**
     * Turns off media line mode or closes media player if it's slider mode.
     */
    public headerCloseHandler(): void {
        if (this.isMediaLineMode) {
            this.setMediaLineMode(false);
            this.openItemInPlayerHandler(this.activeSlideIndex);
        } else {
            this.closeVideoPlayer();
        }
    }

    /**
     * Synchronizes activeSlideIndex with vue-awesome-swiper active slide param.
     *
     * @param newIndex                  New active slide index.
     */
    public handleSlideChange(newIndex: number): void {
        this.activeSlideIndex = newIndex;
    }

    /**
     * Turns off media line mode, emits 'slide-player-to' event.
     *
     * @param index                     Index of the slide to be shown on
     *                                  slider mode.
     */
    public openItemInPlayerHandler(index: number): void {
        this.isMediaLineMode = false;
        this.$nextTick(() => {
            this.$root.$emit('slide-player-to', index);
        });
    }

    /**
     * Emits forward event.
     *
     * @param payload                   Media to be forwarded.
     */
    public forwardMedia(payload: MessageAttachment[]): void {
        this.$emit('forward', {
            payload,
            type: 'media',
        });
        this.$root.$on('forward-succeeded', this.forwardSucceededHandler);
    }

    /**
     * Turns of select mode, empties selected media list. Also, removes
     * `forward-succeeded` listener.
     */
    public forwardSucceededHandler(): void {
        this.isSelectMode = false;
        this.selectedMedia = [];
        this.$root.$off('forward-succeeded', this.forwardSucceededHandler);
        // TODO: Succeeded popup;
    }

    @Watch('gallery')
    galleryWatcher(gallery: MessageAttachment[]): void {
        this.activeSlideIndex = clamp(
            0,
            gallery.length - 1,
            this.activeSlideIndex,
        );
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to set the image which needs to be
     * shown first on slider.
     */
    public mounted(): void {
        const potentialIndex = this.gallery.findIndex(
            ({ id }) => id === this.idOnOpen,
        );
        const initialIndex = potentialIndex !== -1
            ? potentialIndex
            : 0;

        this.$root.$emit('slide-player-to', initialIndex);
        this.$root.$on('open-item-in-player', this.openItemInPlayerHandler);

        if (!this.$route.query.dsw) {
            let query = {};

            if (this.$route.query) {
                query={ ...this.$route.query };
            }
            query = { ...query, dsw: true };

            this.$router.replace({
                path: this.$route.path,
                query,
            });
        }
    }

    /**
     * Hooks `beforeDestroy` Vue lifecycle stage to remove `open-item-in-player`
     * listener.
     */
    public beforeDestroy(): void {
        this.$root.$off('open-item-in-player', this.openItemInPlayerHandler);
        const query = { ...this.$route.query };
        delete query.dsw;
        this.$router.replace({
            path: this.$route.path,
            query: query,
        });
    }
}
