import Vue from 'vue';
import { Component } from 'vue-property-decorator';


/**
 * Page side-menu footer component allowing user to do to some actions with
 * selected elements (actions are provided in `<slot>` element).
 */
@Component
export default class ContactsMenuFooter extends Vue {
    /**
     * Closes select mode.
     */
    public closeSelectMode(): void {
        this.$emit('close-select-mode');
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to hide app bottom menu.
     */
    public mounted(): void {
        const bottomMenu =
            this.$root.$el.querySelector('.app-bottom-menu') as HTMLElement;
        bottomMenu.classList.add('hidden');
    }

    /**
     * Hooks `beforeDestroy` Vue lifecycle stage to show app bottom menu.
     */
    public beforeDestroy(): void {
        const bottomMenu =
            this.$root.$el.querySelector('.app-bottom-menu') as HTMLElement;
        bottomMenu.classList.remove('hidden');
    }
}
