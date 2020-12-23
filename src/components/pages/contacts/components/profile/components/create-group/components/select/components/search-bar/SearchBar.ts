import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import CheckedIcon from 'components/icons/CheckedIcon.vue';


/**
 * Forward interface search bar. Lets user to search for an exact contact.
 */
@Component({
    components: {
        'checked-icon': CheckedIcon,
    },
})
export default class SearchBar extends Vue {
    /**
     * Indicator whether all contacts are chosen.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) areAllContactsChosen;

    /**
     * Selects/deselects all contacts.
     */
    public selectAllContacts(): void {
        this.$emit('select-all-contacts');
    }

    /**
     * Emits `search-string-update` event to the parent to update the search
     * string value.
     */
    public inputHandler(event: InputEvent): void {
        this.$emit(
            'search-string-update',
            (event.target as HTMLInputElement).value,
        );
    }
}
