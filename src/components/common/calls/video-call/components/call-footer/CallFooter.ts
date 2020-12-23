import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

import { clamp } from 'utils/math';

import { CallParticipantStatus } from 'models/CallParticipant';

import PlusIcon from 'components/icons/PlusIcon.vue';

import Participant from './components/participant/Participant.vue';


enum Direction {
    Left,
    Right,
}

/**
 * Component displaying call participants who should not be displayed on main
 * call window.
 */
@Component({
    components: {
        'participant': Participant,
        'plus-icon': PlusIcon,
    },
})
export default class CallFooter extends Vue {
    /**
     * List of users, who are visible on the main window.
     */
    @Prop({ default: () => ([]) }) mainWindowUsersIds: string[];

    /**
     * List of call participants.
     */
    @Prop({ default: () => ({}) }) listOfParticipants: Array<{
        id: string,
        status: CallParticipantStatus,
    }>;

    /**
     * Indicator whether dragged user can be potentially moved here from the
     * main window.
     */
    @Prop({ default: false }) isTarget: boolean;

    /**
     * Indicator whether it's a group call.
     */
    @Prop({ default: false }) isGroupChat: boolean;

    /**
     * Postfix for user's screen stream.
     * Used to separate user's device video stream from display stream.
     */
    @Prop() SCREEN_POSTFIX: string;

    /**
     * Indicator whether participants container has been scrolled to the end.
     */
    public isScrolledToTheEnd: boolean = true;

    /**
     * Indicator whether participants container has been scrolled to the start.
     */
    public isScrolledToTheStart: boolean = true;

    /**
     * Direction enum copy to get access to it from template.
     */
    public Direction: typeof Direction = Direction;

    /**
     * Interval that scrolls container.
     */
    private scrollInterval: number;

    /**
     * `scrollInterval` period in milliseconds.
     */
    private readonly scrollIntervalPeriod = 100;

    /**
     * Indicator whether contents of the participants container are wider than
     * container itself.
     */
    public isParticipantsContainerFull: boolean = false;

    /**
     * Users to be displayed.
     */
    public get usersToDisplay(): string[] {
        return this.listOfParticipants
            .filter(({ id }) => !this.mainWindowUsersIds.includes(id))
            .map(({ id }) => id);
    }

    /**
     * Inits movement handler.
     *
     * @param event                     `mousedown`|`touchstart` event.
     * @param id                        ID of the user to be moved.
     */
    public startDragging(event: MouseEvent | TouchEvent, id: string): void {
        this.$emit('start-move', event, id);
    }

    /**
     * Updates `isScrolledToTheEnd` and `isScrolledToTheStart` indicators.
     *
     * @param event                     `scroll` event.
     */
    public scrollHandler(event: Event): void {
        const t = <HTMLElement>event.target;
        this.isScrolledToTheStart = t.scrollLeft === 0;
        this.isScrolledToTheEnd =
            t.scrollLeft + t.clientWidth === t.scrollWidth;
    }

    /**
     * Checks whether `event` is emitted by `touch` event.
     *
     * @param event                         `touch` | `mouse` event.
     */
    private isTouchEvent(event: MouseEvent | TouchEvent): boolean {
        return event.type.includes('touch');
    }

    /**
     * Scrolls participants container to the provided direction for `10px`.
     *
     * @param direction                 Direction to scroll to ('left'|'right').
     */
    public scrollTo(direction: Direction): void {
        const target = <HTMLElement>this.$refs.participantsContainer;
        target.scrollTo(
            clamp(
                target.scrollLeft + (direction === Direction.Left ? -10: 10),
                0,
                target.clientWidth,
            ),
            0,
        );
    }

    /**
     * Removes `touchend`|`mouseup` listener and clears `scrollInterval`.
     * interval.
     *
     * @param event                     `mouse`|`touch` event.
     */
    public clearListeners(event: MouseEvent | TouchEvent): void {
        window.removeEventListener(
            this.isTouchEvent(event)
                ? 'touchend'
                : 'mouseup',
            this.clearListeners,
        );
        clearInterval(this.scrollInterval);
    }

    /**
     * Sets `scrollInterval` interval, that scrolls participants container to
     * provided direction each `scrollIntervalPeriod` milliseconds.
     *
     * @param event                     `mouse`|`touch` event.
     * @param direction                 Direction to scroll to.
     */
    public scroll(event: MouseEvent | TouchEvent, direction: Direction): void {
        this.scrollInterval = setInterval(
            () => this.scrollTo(direction),
            this.scrollIntervalPeriod,
        );

        window.addEventListener(
            this.isTouchEvent(event)
                ? 'touchend'
                : 'mouseup',
            this.clearListeners,
        );
    }

    /**
     * Sets `isParticipantsContainerFull` indicator to `true` if contents of
     * participants container are wider than container itself.
     */
    public checkIfContainerIsFull(): void {
        const target = <HTMLElement>this.$refs.participantsContainer;
        const childWidth =
            target.querySelector('*:first-child')?.clientWidth || 0;
        const childMargin = 10;
        this.isParticipantsContainerFull = target.clientWidth <
            target.childElementCount * childWidth +
            (childMargin * (target.childElementCount - 1));
    }

    /**
     * Checks whether participants container is full whenever
     * `mainWindowUsersIds` (list of participants, visible in main window) is
     * updated.
     */
    @Watch('mainWindowUsersIds')
    public watchWindowUsersIds(): void {
        this.$nextTick(() => this.checkIfContainerIsFull());
    }

    /**
     * Checks whether participants container is full whenever
     * `listOfParticipants` (list of call participants) is updated.
     */
    @Watch('listOfParticipants')
    public watchListOfParticipants(): void {
        this.$nextTick(() => this.checkIfContainerIsFull());
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to check whether participants
     * container is full.
     */
    public mounted(): void {
        this.$nextTick(() => this.checkIfContainerIsFull());
    }
}
