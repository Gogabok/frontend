import { Chat } from 'models/Chat';
import { SideMenuElement } from 'models/SideMenuElement';
import { User } from 'models/User';


type Contact = Chat | User;

/**
 * Contacts and Chats pages side menu element.
 */
export class ContactCard extends SideMenuElement<Contact> {
    /**
     * Creates new instance of SideMenuElement.
     *
     * @param _value                    Element underlying value.
     */
    constructor(private _value: Contact) {
        super(_value);
    }

    /**
     * Checks whether item partially satisfies search parameters.
     *
     * @param searchString              Search string value.
     */
    contains(searchString: string): boolean {
        searchString = searchString.toLowerCase();
        return (
            this._value.name
            && this._value.name.toLowerCase().includes(searchString)
        ) || this._value.num.toLowerCase().includes(searchString);
    }

    /**
     * Checks whether item fully satisfies search parameters.
     *
     * @param searchString              Search string value.
     */
    public is(searchString: string): boolean {
        return this._value.name && this._value.name === searchString
            || this._value.num === searchString;
    }

    /**
     * Returns string representation of this element.
     */
    public toString(): string {
        return this._value.name || `&${this._value.num}`;
    }

    /**
     * Returns whether element is in user's favorites list.
     */
    public isFavorite(): boolean {
        return this._value.isFavorite;
    }

    /**
     * Returns element ID.
     */
    public id(): string {
        return this._value.id;
    }

    /**
     * Returns element underlying value.
     */
    public value(): Contact {
        return this._value;
    }
}
