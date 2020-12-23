import { Component, Prop, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import GeneralParameters from 'store/modules/general-parameters';

import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';

import ChatsIcon from 'components/icons/Chats.vue';
import ContactIcon from 'components/icons/ContactIcon.vue';
import MenuIcon from 'components/icons/MenuIcon.vue';
import ShareIcon from 'components/icons/ShareIcon.vue';


const generalParameters = namespace(GeneralParameters.vuexName);

/**
 * Responsive bottom menu component, that contains two left and right aligned
 * blocks with navigation links.
 */
@Component({
    components: {
        ChatsIcon,
        ContactIcon,
        MenuIcon,
        ShareIcon,
    },
})
export default class BottomMenu extends Vue {
    /**
     * Indicator whether menu is visible.
     */
    @Prop(Boolean) readonly isMenuOpen: boolean;

    /**
     * Indicator whether bottom menu is hidden.
     */
    @Prop(Boolean) readonly isVisible: boolean;

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
     * Indicator whether mobile mode is active.
     */
    public get isMobileMode(): boolean {
        return this.isForceMobileMode || this.isNativeMobileMode;
    }

    /**
     * Menu items list element.
     */
    public get itemsList(): HTMLElement {
        return this.$refs.itemsList as HTMLElement;
    }

    /**
     * Toggles menu panel visibility.
     */
    public menuClickHandler(): void {
        this.$emit('toggle-menu');
    }

    /**
     * Closes menu click.
     */
    public menuItemClickHandler(): void {
        if (this.isMenuOpen) {
            this.menuClickHandler();
        }
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to add `click` event listeners to all
     * non-menu-opening elements.
     */
    public mounted(): void {
        this.itemsList.querySelectorAll('.item:not(.menu)').forEach(
            element => element.addEventListener(
                'click',
                this.menuItemClickHandler,
            ),
        );
    }

    /**
     * Hooks `beforeDestroy` Vue lifecycle stage to remove `click` event
     * listeners of all non-menu-opening elements.
     */
    public beforeDestroy(): void {
        this.itemsList.querySelectorAll('.item:not(.menu)').forEach(
            element => element.removeEventListener(
                'click',
                this.menuItemClickHandler,
            ),
        );
    }
}
