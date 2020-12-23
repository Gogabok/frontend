import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';

import { smoothTransition } from 'utils/animations';
import { clamp } from 'utils/math';
import { MovementHandler, MovementHandlerData } from 'utils/moveHandler';


/**
 * Menu swipe events logic.
 */
@Component
export default class SwipeMenu extends Vue {
    /**
     * Max angle which will still start menu transition.
     */
    public readonly MAX_SWIPE_ANGLE = 35;

    /**
     * Min distance to pass to toggle menu state.
     */
    public readonly SWIPE_DIST_TO_SUCCEED = 150;

    /**
     * Movement handler responsible for menu movement.
     */
    public movementHandler: MovementHandler = new MovementHandler();

    /**
     * List of elements to be moved via touch events.
     */
    public get elementsToMove(): HTMLElement[] {
        return [
            this.menu.$el as HTMLElement,
            document.getElementById('bottomMenu') as HTMLElement,
        ];
    }

    /**
     * Return menu component by ref.
     */
    public get menu(): Vue {
        return this.$refs.contactMenu as Vue;
    }

    /**
     * Indicator whether swipe is disabled.
     */
    public get isSwipeDisabled(): boolean {
        return !!this.$route.query.dsw;
    }

    /**
     * Returns app component by ref.
     */
    public get app(): HTMLElement {
        return this.$refs.app as HTMLElement;
    }

    /**
     * Width of the app container element.
     */
    public get appContainerWidth(): number {
        return (document.querySelector(
            '#page-wrap',
        ) as HTMLElement).clientWidth;
    }

    /**
     * Bottom app menu element.
     */
    public get bottomMenu(): HTMLElement {
        return document.getElementById('bottomMenu') as HTMLElement;
    }

    /**
     * Opens menu element.
     */
    public openMenu(): void {
        const queryParamsWithoutId = Object.entries(this.$route.query).filter(
            ([param]) => param !== 'id',
        );

        this.$router.replace({
            path: this.$route.path,
            query: Object.fromEntries(queryParamsWithoutId),
        }).catch(e => {
            if (e._name === 'NavigationDuplicated') {
                this.$router.go(1);
            }
        });
    }

    /**
     * Closes menu element.
     */
    public closeMenu(): void {
        this.$router.replace({
            path: this.$route.path,
            query: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                id: this.selectedChatId,
            },
        }).catch(e => {
            if (e._name === 'NavigationDuplicated') {
                this.$router.go(1);
            }
        });
    }

    /**
     * Gets position of the touch event relative to page wrapper.
     *
     * @param e             `touch` event.
     */
    public getPositionByDevice(e: {changedTouches}): { x: number, y: number } {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!this.isMobileMode && !this.isForceMobileMode) {
            return {
                x: e.changedTouches[0].pageX,
                y: e.changedTouches[0].pageY,
            };
        } else {
            const wrapWidth = this.appContainerWidth;
            const diff = (window.innerWidth - wrapWidth) / 2;
            return {
                x: e.changedTouches[0].pageX - diff,
                y: e.changedTouches[0].pageY,
            };
        }
    }

    /**
     * Removes all style changes on desktop version.
     *
     * @param isMobileMode      Indicator whether mobile mode is active.
     */
    @Watch('isMobileMode')
    watchIsMobileMode(isMobileMode: boolean): void {
        if(!isMobileMode) {
            this.elementsToMove.forEach(element => {
                element.style.left = '';
                element.style.transform = '';
                element.style.transition = '';
            });
        } else {
            this.elementsToMove.forEach(
                element => element.style.left =
                    `${this.isMenuOpen ? '0px' : '-100%'}`,
            );
        }
    }

    /**
     * Starts menu dragging.
     *
     * @param e                         `touchstart` | `mousedown` event.
     */
    public startHandler(e: TouchEvent | MouseEvent): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if(!this.isMobileMode) return;
        if (e.type !== 'touchstart') return;
        if (this.isSwipeDisabled) return;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if(this.isMenuOpen && !this.selectedChatId) return;

        this.movementHandler.start(e);
    }

    /**
     * Sets initial position of the menu element.
     * Also, adds move and end touch events.
     *
     * @param data                      Movement handler data.
     */
    public onStart(data: MovementHandlerData): void | boolean {
        const { x: initialX } = data.initialPosition;

        if(!this.isMenuOpen && initialX > 60) return false;
        if( this.isMenuOpen
            && initialX < this.appContainerWidth - 60) return false;
    }

    /**
     * Moves `elementsToMove` according to finger position.
     *
     * @param data     `touchmove` event.
     */
    public onMove(data: MovementHandlerData): void | boolean {
        const { x: dX, y: dY } = data.diff;

        const angle = Math.abs(Math.atan2(dY,dX) / Math.PI * 180);

        if( angle > this.MAX_SWIPE_ANGLE
            && angle < 180 - this.MAX_SWIPE_ANGLE) return false;

        const [minValue, maxValue] = [
            this.isMenuOpen ? -this.appContainerWidth : 0,
            this.isMenuOpen ? 0 : this.appContainerWidth,
        ];

        this.elementsToMove.forEach(
            element => element.style.transform = `translateX(${clamp(
                dX,
                minValue,
                maxValue,
            )}px)`,
        );
    }

    /**
     * Changes menu state based on `dX`.
     * Also, removes `touchmove` and `touchend` event listeners.
     *
     * @param data                      Movement handler data.
     */
    public onEnd(data: MovementHandlerData): void {
        const { x: dX } = data.diff;
        if(Math.abs(dX) > this.SWIPE_DIST_TO_SUCCEED) {
            this.isMenuOpen
                ? this.closeMenu()
                : this.openMenu();
        } else {
            const elements = this.elementsToMove;
            const duration = 200;
            const settings = {
                transform: '',
                transition: `${duration}ms transform ease-in-out`,
            };
            smoothTransition({ elements, settings });
        }
    }

    /**
     * Indicator whether menu should be visible.
     */
    public get isMenuOpen(): boolean {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return !this.$route.query.id || !this.isMobileMode;
    }

    /**
     * Smoothly animates `elementToMove` to new state on route change.
     *
     * @param isMenuOpen    Indicator whether menu should be open.
     */
    @Watch('$route.query.id')
    watchIsMenuOpen(isMenuOpen: string): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if(!this.isMobileMode) return;
        const duration = 200;

        const settings = {
            left: `${!isMenuOpen ? '0px' : '-100%'}`,
            transform: '',
            transition: `${duration}ms left ease-in-out,
                         ${duration}ms transform ease-in-out`,
        };

        const elements = this.elementsToMove;

        smoothTransition({ elements, settings });
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to set `elementsToMove` styles based
     * on `isMenuOpen` state.
     */
    public async mounted(): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if(!this.isMobileMode) return;
        this.movementHandler.onStart(this.onStart.bind(this));
        this.movementHandler.onMove(this.onMove.bind(this));
        this.movementHandler.onEnd(this.onEnd.bind(this));

        this.$nextTick(() => {
            this.elementsToMove.forEach(
                element => element.style.left =
                    `${this.isMenuOpen ? '0px' : '-100%'}`,
            );
        });
    }
}
