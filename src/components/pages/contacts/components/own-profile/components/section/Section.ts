import Vue, { VueConstructor } from 'vue';
import { Component, Prop } from 'vue-property-decorator';


/**
 * Component used as template for own-profile section.
 */
@Component
export default class OwnProfileSection extends Vue {
    /**
     * Section name.
     */
    @Prop({ required: true }) name: string;

    /**
     * Section icon.
     */
    @Prop({ required: true }) icon: VueConstructor<Vue>;

    /**
     * Indicator whether section is expanded.
     */
    public isExpanded: boolean = false;

    /**
     * Section max height on opened state (required for the animation to be more
     * precise).
     */
    public maxHeight = 0;

    /**
     * Toggles section `isExpanded` state.
     */
    public toggleExpandedState(): void {
        this.isExpanded = !this.isExpanded;
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to set `maxHeight` value based on
     * content height.
     */
    public mounted(): void {
        this.$nextTick(() => {
            const el = <HTMLElement>this.$refs.content;
            this.maxHeight = el.scrollHeight;
        });
    }
}
