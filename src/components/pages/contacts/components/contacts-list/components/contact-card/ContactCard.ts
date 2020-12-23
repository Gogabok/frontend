import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { MovementHandler, MovementHandlerData } from 'utils/moveHandler';

import { Chat } from 'models/Chat';
import { User } from 'models/User';
import { UserStatusCode } from 'models/UserStatus';

import GeneralParameters from 'store/modules/general-parameters';

import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';

import Angle from 'components/icons/Angle.vue';
import CheckedIcon from 'components/icons/CheckedIcon.vue';
import StarIcon from 'components/icons/StarIcon.vue';
import DeleteIcon from 'components/icons/DeleteIcon.vue';
import ChatsIcon from 'components/icons/Chats.vue';
import CallIcon from 'components/icons/CallIcon.vue';
import VideoCallIcon from 'components/icons/VideoCallIcon.vue';

const generalParameters = namespace(GeneralParameters.vuexName);


/**
 * Chats menu chat card element.
 */
@Component({
    components: {
        'angle': Angle,
        'call-icon': CallIcon,
        'chats-icon': ChatsIcon,
        'checked-icon': CheckedIcon,
        'delete-icon': DeleteIcon,
        'star-icon': StarIcon,
        'videoCall-icon': VideoCallIcon,
    },
})
export default class ChatCard extends Vue {
    /**
     * Chat object.
     */
    @Prop({
        required: true,
        type: Object,
    }) contactInfo: User | Chat;

    /**
     * Indicator whether contact is selected.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isSelected: boolean;

    /**
     * Indicator whether select mode is active.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isSelectMode: boolean;

    /**
     * Amount of common contacts.
     */
    @Prop({
        default: 0,
        type: Number,
    }) commonContacts: number;

    /**
     * Search string value.
     */
    @Prop({
        default: '',
        type: String,
    }) searchString: string;

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
     * Indicator whether mobile mode is active (whether it's forced or native).
     */
    public get isMobileMode(): boolean {
        return this.isNativeMobileMode || this.isForceMobileMode;
    }

    /**
     * Movement handler, responsible for sidebar menu touch events.
     */
    public movementHandler: MovementHandler = new MovementHandler();

    /**
     * Movement endpoints to open the controller in right direction,
     * 150 - is a amount of pixels which we have to display of contact card.
     */
    public movementRightEndpoint: number =
        document.documentElement.clientWidth - 150;

    /**
     * Movement endpoints to open the controller in let direction,
     * 150 - is a amount of pixels which we have to display of contact card.
     */
    public movementLeftEndpoint: number =
        -document.documentElement.clientWidth + 150;

    /**
     * Amount of minimal points to slide contact card in right direction.
     */
    public movementMinimalRightEndpoint: number = 120;

    /**
     * Amount of minimal points to slide contact card in left direction.
     */
    public movementMinimalLeftEndpoint: number = -120;

    /**
     * Current position of contact card.
     */
    public currentHorizontalPoint: number = 0;

    /**
     * Initial position of contact card when user starts to slide it.
     */
    public initialPoint: number = 0;

    /**
     * Indicator whether left controller is displaying.
     */
    public leftSideControllersOpened: boolean = false;

    /**
     * Indicator whether contact card drags.
     */
    public isDragging: boolean = false;

    /**
     * Indicator whether contact card holds.
     */
    public isHolding: boolean = false;

    /**
     * Current position of users finger to moving the contact card.
     */
    public holdingClientYPosition: number = 0;

    /**
     * Border of top position of contact card.
     */
    public topHoldingScrollBorder: number = 136;

    /**
     * Border of bottom position of contact card.
     */
    public bottomHoldingScrollBorder: number = 140;

    /**
     * Amount of pixels for scrolling users screen in each directions.
     */
    public pixelsForScrollWithHolding: number = 5;

    /**
     * Interval for scrolling users screen in each direction whether
     * contact card reach top/bottom border.
     */
    public scrollingInterval: number | undefined = undefined;

    /**
     * Indicator whether scrolling interval is active.
     */
    public isScrollingInterval: boolean = false;

    /**
     * Event listener to calculate right and left endpoints
     * to slide contact cards.
     */
    public onWindowResizeListener = (): void => {
        this.movementRightEndpoint =
            document.documentElement.clientWidth
            - 150;
        this.movementLeftEndpoint =
            -document.documentElement.clientWidth
            + 150;
    };

    /**
     * Vue data attribute used to bind styles.
     */
    public dataId: string = 'default';

    /**
     * User status or group chat participants amount information.
     */
    public get lastSeen(): string {
        if (this.contactInfo.type === 'group') {
            return `${(<Chat>this.contactInfo).participants.length} members`;
        }
        const statusLabel = {
            [UserStatusCode.Online]: 'Online',
            [UserStatusCode.Private]: 'Статус скрыт',
            [UserStatusCode.Away]: 'Отошел',
            [UserStatusCode.Busy]: 'Занят',
            [UserStatusCode.Custom]: this.contactInfo.status.title,
        };
        return statusLabel[this.contactInfo.status.code];
    }

    /**
     * List of parameters, matching search request.
     */
    public get matchingParameters(): string[] {
        const set: string[] = [
            this.contactInfo.name,
            this.contactInfo.num,
        ].filter(Boolean) as string[];

        return set
            .map(parameter => this.findLetters(
                parameter.toLowerCase(),
                this.searchString,
            ))
            .filter(parameter => parameter.found)
            .map(parameter => parameter.value as string);
    }

    /**
     * Transforms provided string to highlight letters matching search string.
     *
     * @param val                       String to find letters in.
     * @param searchString              Search string.
     */
    public findLetters(val: string, searchString: string): {
        [key: string]: boolean | string,
    } {
        if (!searchString.length) {
            return { found: false, value: val };
        } else {
            return {
                found: val.includes(this.searchString),
                value: val.toLowerCase().split(searchString).join(
                    `<em data-${this.dataId} class='colored'>${searchString
                    }</em>`,
                ),
            };
        }
    }

    /**
     * Selects/deselects contact in select mode.
     * Opens its profile otherwise.
     */
    public cardClickHandler(): void {
        if (this.isSelectMode) {
            this.$emit('select');
        } else {
            if (this.$route.query.id === this.contactInfo.id) return;

            this.$router.replace({
                path: this.$route.path,
                query: { id: this.contactInfo.id },
            });
        }
    }

    /**
     * Determines whether an element is in process of being hold on,
     * Sets the amount of pixels from the start of contacts list
     * to the top of contact card,
     * Measures whether to add or delete a contact card from favorite group
     * and emits it.
     */
    public cardHoldHandler(): void {

        if (!this.isDragging
            && !this.isSelectMode
            && this.currentHorizontalPoint === 0
        ) {
            this.isHolding = true;

            const cardContainerGhost =
                this.$refs.cardContainerGhost as HTMLElement;

            const contactsMenuConrainer =
                this.$parent.$parent.$refs.contactsContainer as HTMLElement;
            const touchMoveListener = (e: TouchEvent) => {
                if (this.isHolding) {
                    this.holdingClientYPosition = e.changedTouches[0].clientY;
                }
            };
            const touchEndListener = () => {
                document.removeEventListener('touchmove', touchMoveListener);
                if (!this.isHolding) return;
                const favoritesGroupContainer =
                    this.$parent.$parent.$refs['group-favorites'][0].$el;
                if (favoritesGroupContainer
                    && this.holdingClientYPosition !== 0
                    && this.holdingClientYPosition
                    >= favoritesGroupContainer?.getBoundingClientRect().top
                    && this.holdingClientYPosition
                    <= +favoritesGroupContainer?.offsetHeight
                    + +favoritesGroupContainer?.getBoundingClientRect().top) {
                    const cardContainer =
                        this.$refs.cardContainer as HTMLElement;
                    this.$emit('set-contact-favorite', {
                        contactInfo: this.contactInfo,
                        positionY:
                            this.holdingClientYPosition
                            - favoritesGroupContainer
                                ?.getBoundingClientRect()
                                .top
                            - (cardContainer.clientHeight / 2),
                    });
                } else {
                    if (this.contactInfo.isFavorite
                        && this.holdingClientYPosition !== 0) {
                        this.$emit(
                            'delete-contact-favorite',
                            this.contactInfo,
                        );
                    }
                }
                if (cardContainerGhost) {
                    cardContainerGhost.style.cssText = '';
                }
                contactsMenuConrainer
                    ? contactsMenuConrainer.style.overflowY = 'auto'
                    : false;
                this.isHolding = false;
                document.removeEventListener('touchend', touchEndListener);
            };
            document.addEventListener('touchmove', touchMoveListener);
            document.addEventListener('touchend', touchEndListener);
        }
    }

    /**
     * Triggers movement handler to start listening to events.
     *
     * @param e                         `touchstart` | `mousedown` event.
     */
    public movementHandlerStart(e: TouchEvent): void {
        if (e.type !== 'touchstart') return;
        if (this.isSelectMode) return;

        this.movementHandler.start(e);
    }

    /**
     * Sets initial point of the contact card.
     */
    public startHandler(): void {
        this.initialPoint = this.currentHorizontalPoint;
    }

    /**
     * Gets horizontal point position based on
     * the initial point and the difference by element was shifted, setups
     * the flag which display that contact card is dragging.
     *
     * @param data                      Movement handler data.
     */
    public moveHandler(data: MovementHandlerData): void {
        if (this.isHolding) return;

        const currentPoint = this.initialPoint + data.diff.x;

        this.isDragging = true;

        this.leftSideControllersOpened =
            currentPoint >= this.movementMinimalRightEndpoint;

        this.currentHorizontalPoint = currentPoint;

        const cardContainer = this.$refs.cardContainer as HTMLElement;

        if (cardContainer) {
            cardContainer.style.transition = 'none';
        }
    }

    /**
     * Calculates if finger position archived the point of minimal destination
     * in the necessary direction, removes the flag of dragging contact card.
     */
    public endHandler(): void {
        const dX = this.currentHorizontalPoint;

        if (dX >= this.movementMinimalRightEndpoint) {
            this.currentHorizontalPoint = this.movementRightEndpoint;
        } else if (dX <= this.movementMinimalLeftEndpoint) {
            this.currentHorizontalPoint = this.movementLeftEndpoint;
        } else if (dX <= this.movementMinimalRightEndpoint
            && dX >= this.movementMinimalLeftEndpoint
        ) {
            this.currentHorizontalPoint = 0;
        }

        if (dX <= this.initialPoint - 50
            && this.leftSideControllersOpened
        ) {
            this.currentHorizontalPoint = 0;
        } else if (dX >= this.initialPoint + 50
            && !this.leftSideControllersOpened
        ) {
            this.currentHorizontalPoint = 0;
        }

        this.isDragging = false;

        const cardContainer = this.$refs.cardContainer as HTMLElement;
        if (cardContainer) {
            cardContainer.style.transition = 'all .3s ease-out';
        }
    }

    /**
     * Changes the styles of the element when finger position has changed.
     */

    @Watch('currentHorizontalPoint')
    watchCurrentHorizontalPoint(): void {
        const cardContainer = this.$refs.cardContainer as HTMLElement;
        const dX = this.currentHorizontalPoint;
        if (!this.isHolding && cardContainer) {
            cardContainer.style.transform = `translateX(${dX}px)`;
        }
    }

    /**
     * Sets interval of window scroll and styles a contact card.
     */
    @Watch('holdingClientYPosition')
    watchHoldingClientYPosition(): void {
        const clientScreenHeight = document.documentElement.clientHeight;
        const contactsMenuConrainer =
            this.$parent.$parent.$refs.contactsContainer as HTMLElement;
        const cardContainerGhost =
            this.$refs.cardContainerGhost as HTMLElement;

        let scrollingInterval: number | undefined = undefined;
        if (this.holdingClientYPosition <= this.topHoldingScrollBorder) {
            this.isScrollingInterval = true;
            scrollingInterval = setInterval(() => {
                contactsMenuConrainer?.scrollBy(
                    0,
                    -this.pixelsForScrollWithHolding,
                );
                if (!this.isScrollingInterval) {
                    clearInterval(scrollingInterval);
                }
            }, 100);
        } else if (this.holdingClientYPosition
            >= clientScreenHeight - this.bottomHoldingScrollBorder
        ) {
            this.isScrollingInterval = true;
            scrollingInterval = setInterval(() => {

                contactsMenuConrainer?.scrollBy(
                    0,
                    this.pixelsForScrollWithHolding,
                );

                if (!this.isScrollingInterval) {
                    clearInterval(scrollingInterval);
                }

            }, 100);
        } else {
            if (cardContainerGhost) {
                this.isScrollingInterval = false;
                cardContainerGhost.style.cssText = `
                    position: fixed;
                    top: ${this.holdingClientYPosition}px;
                    z-index: 15;
                    transform: translate(0, -50%);
                    border: 1px solid #d4d4d4;
                `;
            }
        }
    }

    /**
     * Changes styles of contact card and container of all contacts whether
     * contact card holds,
     * Toggles scrolling interval flag.
     */
    @Watch('isHolding')
    watchIsHolding(): void {
        const contactsMenuConrainer =
            this.$parent.$parent.$refs.contactsContainer as HTMLElement;
        if (this.isHolding) {
            this.$nextTick(() => {
                const cardContainerGhost =
                    this.$refs.cardContainerGhost as HTMLElement;
                if (cardContainerGhost) {
                    cardContainerGhost.style.cssText = `
                    position: absolute;
                    transform: translate(0, -100%);
                    z-index: 15;
                    border: 1px solid #d4d4d4;
                `;
                }
            });
            contactsMenuConrainer
                ? contactsMenuConrainer.style.overflow = 'hidden'
                : false;
        } else {
            this.isScrollingInterval = false;
            contactsMenuConrainer
                ? contactsMenuConrainer.style.overflowY = 'auto'
                : false;
        }
    }

    /**
     * Removes holding and dragging while selecting mode is active.
     */
    @Watch('isSelectMode')
    watchIsSelectMode(): void {
        if (this.isSelectMode) {
            this.isHolding = false;
            this.isDragging = false;
            this.currentHorizontalPoint = 0;
        }
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to get Vue data attribute used to
     * bind styles for current component and add the events to follow the
     * users finger when it slide contact card.
     * Adds event listener on window resize to calculate
     * right and left endpoints to slide contact cards.
     */
    public mounted(): void {
        this.dataId = Object.entries((this.$el as HTMLElement).dataset)[0][0];

        this.movementHandler.onStart(this.startHandler.bind(this));
        this.movementHandler.onMove(this.moveHandler.bind(this));
        this.movementHandler.onEnd(this.endHandler.bind(this));

        window.addEventListener('resize', this.onWindowResizeListener);
    }

    /**
     * Removes scrolling interval.
     */
    public beforeDestroy(): void {
        this.isScrollingInterval = false;

        window.removeEventListener('resize', this.onWindowResizeListener);
    }
}
