import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import CheckedIcon from 'components/icons/CheckedIcon.vue';


/**
 * Page side-menu search bar element allowing user to search for specific
 * elements in side-menu and toggle between regular and select modes.
 * Also, allows user to select/deselect all items on select mode.
 */
@Component({
    components: {
        'checked-icon': CheckedIcon,
    },
})
export default class SearchBar extends Vue {
    /**
     * Indicator whether all contacts are selected.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) areAllItemsSelected;

    /**
     * Amount of contacts selected.
     */
    @Prop({
        default: 0,
        type: Number,
    }) amountOfSelectedItems;

    /**
     * Indicator whether select mode is active.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isSelectMode;

    /**
     * Sets select mode state.
     *
     * @param value     New `isSelectMode` value.
     */
    public setSelectMode(value: boolean): void {
        this.$emit('set-select-mode', value);
    }

    /**
     * Sets all items selected/deselected.
     *
     * @param value                     Indicator whether all items should be
     *                                  selected or deselected. If it's not
     *                                  provided, selection will be toggled.
     */
    public selectAll(value?: boolean): void {
        this.$emit('toggle-select-all', value);
    }

    /**
     * Deselects all items, sets `isSelectMode` false.
     */
    public cancelButtonClickHandler(): void {
        this.setSelectMode(false);
        this.selectAll(false);
    }

    /**
     * Emits `search-string-update` event to update search string value.
     */
    public searchFunction(value: string): void {
        this.$emit('search-string-update', value.trim().toLowerCase());
    }
}
