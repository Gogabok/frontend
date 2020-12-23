import Vue  from 'vue';
import { Component, Prop } from 'vue-property-decorator';


/**
 * Page side-menu items group component containing a list of components, grouped
 * by some parameters and label bar, that describes the that parameter.
 */
@Component
export default class ItemsGroup extends Vue {
    /**
     * Label of the group.
     */
    @Prop({
        default: 'Favorites',
        type: String,
    }) label;

    /**
     * Indicator whether group header is hidden.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isHeaderHidden: boolean;

    /**
     * Indicator whether items are beings fetched.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isLoading;
}
