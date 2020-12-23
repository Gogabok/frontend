import { mixins } from 'vue-class-component';
import { Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { SearchResult, SideMenuElement } from 'models/SideMenuElement';

import DebouncedSearch from 'mixins/debouncedSearch';

import GeneralParameters from 'store/modules/general-parameters';

import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';


const generalParameters = namespace(GeneralParameters.vuexName);

/**
 * Page side menu core functionality.
 */
@Component
export default class SideMenu<U, T extends SideMenuElement<U>> extends mixins(
    DebouncedSearch,
) {
    /**
     * Items to be presented.
     */
    @Prop({ default: [], required: true }) items: T[];

    /**
     * List of selected chats.
     */
    public selectedItems: T[] = [];

    /**
     * Indicator whether select mode is active.
     */
    public isSelectMode: boolean = false;

    /**
     * Global search results.
     */
    public globalSearchResultData: {
        exact: U[],
        similar: U[],
    } = {
        exact: [],
        similar: [],
    };

    /**
     * Indicator whether global search results are being fetched from the
     * server.
     */
    public isFetchingData: boolean = false;

    /**
     * Function, that does request to the server to fetch data, related to
     * `searchString`.
     */
    public globalSearchRequest:
        (searchString: string) => Promise<SearchResult<U>>;

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
     * Indicator whether mobile mode is enabled.
     */
    public get isMobileMode(): boolean {
        return this.isForceMobileMode || this.isNativeMobileMode;
    }

    /**
     * Indicator whether all items are selected.
     */
    public get areAllItemsSelected(): boolean {
        return this.selectedItems.length === this.items.length;
    }

    /**
     * Global and local search requests united.
     */
    public get searchResult(): {
        global: {
            data: SearchResult<U>,
            lastRequest: string,
        },
        local: {
            data: SearchResult<U>,
            lastRequest: string,
        },
    } {
        return {
            local: this.localSearchResult,
            // Eslint-disable-line is used to save correct order when this
            // results are rendered to view.
            global: this.globalSearchResult, // eslint-disable-line
        };
    }

    /**
     * Local search result.
     */
    public get localSearchResult(): {
        data: SearchResult<U>,
        lastRequest: string,
    } {
        return {
            data: {
                exact: this.items
                    .filter(item => item.is(this.searchString))
                    .map(item => item.value()),
                similar: this.items
                    .filter(item => item.contains(this.searchString))
                    .map(item => item.value()),
            },
            lastRequest: this.searchString,
        };
    }

    /**
     * Global search result.
     */
    public get globalSearchResult(): {
        data: SearchResult<U>,
        lastRequest: string,
    } {
        return {
            data: this.debounceSearchData.isBeingDebounced
                || (
                    this.isFetchingData
                    && this.searchString !== this.debounceSearchData.lastValue
                )
                ? {
                    exact: [],
                    similar: [],
                }
                : this.globalSearchResultData,
            lastRequest: this.debounceSearchData.lastValue,
        };
    }

    /**
     * Indicator whether at least one item is selected.
     */
    public get isAnyItemSelected(): boolean {
        return this.selectedItems.length > 0;
    }

    /**
     * Sets global search request function.
     *
     * @param request                   Function that does request to the server
     *                                  to fetch data, related to
     *                                  `searchString`.
     */
    protected setGlobalSearchRequest(
        request: (searchString: string) => Promise<SearchResult<U>>,
    ): void {
        this.globalSearchRequest = request;
    }

    /**
     * Sets `isFetchingData` indicator state, fetches related data from the
     * server and saves it to `globalSearchResultData`.
     *
     * @param value                     Search string.
     */
    private async globalSearch(value: string): Promise<void> {
        this.isFetchingData = true;
        await this.globalSearchRequest(value)
            .then((data: SearchResult<U>) => {
                this.globalSearchResultData = data;
            });

        this.isFetchingData = false;
    }

    /**
     * Handles item selection.
     *
     * @param selectedItem              Selected item.
     */
    public selectItem(selectedItem: T): void {
        if (this.isSelectMode) {
            if (this.selectedItems.includes(selectedItem)) {
                this.selectedItems =
                    this.selectedItems.filter(item => item !== selectedItem);
            } else {
                this.selectedItems.push(selectedItem);
            }
        }
    }

    /**
     * Sets select mode state.
     *
     * @param value                     New select mode state.
     */
    public setSelectMode(value: boolean): void {
        this.isSelectMode = value;
        if (!value) {
            this.selectedItems = [];
        }
    }

    /**
     * Selects/deselects all chats based on current select state and provided
     * value.
     *
     * @param value (optional)          Indicator whether all chats should
     *                                  be selected or deselected.
     */
    public selectAllItems(value?: boolean): void {
        (
            this.selectedItems.length === this.items.length
            || value === false
        ) && value !== true
            ? this.selectedItems = []
            : this.selectedItems = this.items;
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to set callback to be called when
     * debounced search is resolved.
     */
    public mounted(): void {
        this.setDebouncedSearchFunction(this.globalSearch);
    }
}
