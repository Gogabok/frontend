import { screen } from 'tns-core-modules/platform';
import { Component, Vue } from 'vue-property-decorator';


/**
 * Common accordion-item component with expandable content.
 */
@Component
export default class AccordionItem extends Vue {

    /**
     * Indicator whether content should be shown.
     */
    public isOpened: boolean = false;

    /**
     * Toggles isOpened state.
     */
    public toggle(): void {
        this.isOpened = !this.isOpened;
    }

    /**
     * Returns current actual width of the screen.
     */
    public get actualWidth(): number {
        return screen.mainScreen.widthDIPs;
    }
}
