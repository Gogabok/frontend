import Vue from 'vue';
import { Component } from 'vue-property-decorator';


export type DebouncedSearchData = {
    isBeingDebounced: boolean,
    lastValue: string,
}

/**
 * Debounced search mixin.
 */
@Component
export default class DebouncedSearch extends Vue {
    /**
     * Search string value.
     */
    public searchString: string = '';

    /**
     * Interval used to debounce search request.
     */
    public debounceInterval: number | null = null;

    /**
     * Timestamp of last search string change.
     */
    public lastSearchStringUpdateTime: number;

    /**
     * Search request debounce time.
     */
    public readonly searchDebounceTime: number = 400;

    /**
     * Debounce search state.
     *
     * - `isBeingDebounced`:  Indicator, whether search is currently being
     *                        debounced.
     *
     * - `lastValue`:         Last search string value user finished typing.
     */
    private innerData: DebouncedSearchData = {
        isBeingDebounced: false,
        lastValue: '',
    };

    /**
     * Function to be called whenever user finishes typing.
     */
    private debouncedSearchFunction: (string) => Promise<void> | void;

    /**
     * Debounce search state.
     */
    protected get debounceSearchData(): DebouncedSearchData {
        return this.innerData;
    }

    /**
     * Sets `searchString` equal to search input value.
     * Also, calls `debounceSearchFunction` if user finished entering search
     * value, it's not empty and differs from `lastValue`. Resets debounce
     * parameters.
     *
     * @param value                     Search field input value.
     */
    public updateSearchString(value: string): void {
        this.searchString = value;
        if(value === '') {
            clearInterval(this.debounceInterval as number);
            this.debounceInterval = null;
            return;
        }

        if(
            !this.innerData.isBeingDebounced
            && value !== this.innerData.lastValue
        ) {
            this.innerData.isBeingDebounced = true;
        }

        this.lastSearchStringUpdateTime = new Date().getTime();
        this.innerData.lastValue = value;
        if(!this.debounceInterval) {
            this.debounceInterval = setInterval(() => {
                if (new Date().getTime() - this.lastSearchStringUpdateTime
                    >= this.searchDebounceTime) {
                    if(
                        value !== this.innerData.lastValue
                        && this.debouncedSearchFunction
                    ) {
                        this.debouncedSearchFunction(this.searchString);
                    }
                    clearInterval(this.debounceInterval as number);
                    this.debounceInterval = null;
                    this.innerData.isBeingDebounced = false;
                }
            }, 100);
        }
    }

    /**
     * Sets `debounceSearchFunction` value.
     *
     * @param callback                  Function to be called when user finishes
     *                                  typing.
     */
    protected setDebouncedSearchFunction(
        callback: (string) => Promise<void> | void,
    ): void {
        this.debouncedSearchFunction = callback;
    }
}
