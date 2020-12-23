import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';


/**
 * Contacts list popup header component.
 */
@Component
export default class Header extends Vue {
    /**
     * Indicator whether all contacts are selected.
     */
    @Prop({ default: false }) areAllContactSelected: boolean;

    /**
     * Sets search string value.
     */
    @Prop(Function) setSearchValue;

    /**
     * Search string value.
     */
    public searchValue: string = '';

    /**
     * Sets search value.
     */
    @Watch('searchValue')
    onSearchValueChanged(searchValue: string): void {
        this.setSearchValue(searchValue);
    }
}
