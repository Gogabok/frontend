import { Identifiable, Searchable, ToString } from 'models/GeneralInterfaces';
import { VueConstructor } from 'vue';

export interface ISideMenuElement<T> extends
    Searchable,
    ToString,
    Identifiable {
    isFavorite: () => boolean;
    value: () => T;
}

export type Group<T extends Identifiable> = {
    label: string,
    content: T[],
    isLoading: boolean,
    icon?: VueConstructor<Vue>,
    isHeaderHidden?: boolean,
}

export type SearchResult<T> = {
    exact: T[],
    similar: T[],
}

/**
 * Page side menu element.
 */
export class SideMenuElement<T> implements ISideMenuElement<T > {
    /**
     * Checks whether element contains provided data.
     * @param data
     */
    public contains(data: any): boolean { //eslint-disable-line
        return false;
    }

    /**
     * Returns ID of the element.
     */
    public id(): string {
        return '';
    }

    /**
     * Checks whether element equals provided data.
     * @param data
     */
    public is(data: any): boolean { // eslint-disable-line
        return false;
    }

    /**
     * Indicator whether element is in `favorites`.
     */
    public isFavorite(): boolean {
        return false;
    }

    /**
     * Returns underlying value.
     */
    public value(): T {
        return this.val;
    }

    /**
     * Creates new instance of SideMenuElement class.
     *
     * @param val                       underlying value of the element.
     */
    constructor(private val: T) {}
}
