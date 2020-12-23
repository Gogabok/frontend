import Vue, { VueConstructor } from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { CurrentUser } from 'models/CurrentUser';

import GeneralParameters from 'store/modules/general-parameters';
import UserModule from 'store/modules/user';

import { TOGGLE_FORCE_MOBILE_MODE } from 'store/modules/general-parameters/actions';
import { IS_FORCE_MOBILE_MODE } from 'store/modules/general-parameters/getters';
import { GET_USER_DATA } from 'store/modules/user/getters';

import ContactPreview from 'components/common/contact/contact-preview/ContactPreview.vue';
import AboutIcon from 'components/icons/AboutIcon.vue';
import AddContactIcon from 'components/icons/AddContact.vue';
import AngleIcon from 'components/icons/AngleIcon.vue';
import DesktopIcon from 'components/icons/DesktopIcon.vue';
import GetIdIcon from 'components/icons/GetIdIcon.vue';
import LanguageIcon from 'components/icons/LanguageIcon.vue';
import LoginIcon from 'components/icons/LoginIcon.vue';
import MobileIcon from 'components/icons/MobileIcon.vue';
import ReportProblem from 'components/icons/ReportProblem.vue';
import TermsIcon from 'components/icons/TermsIcon.vue';

import MenuElement from './components/menu-element/MenuElement.vue';


type MenuItem = {
    title: string,
    link?: string,
    disabled?: boolean,
    callback?: () => unknown,
    icon: VueConstructor<Vue>,
}

const generalParameters = namespace(GeneralParameters.vuexName);
const userModule = namespace(UserModule.vuexName);

/**
 * Left-side app navigation menu, which allows user to navigate through the app.
 */
@Component({
    components: {
        'about-icon': AboutIcon,
        'add-contact-icon': AddContactIcon,
        'angle-icon': AngleIcon,
        'contact-preview': ContactPreview,
        'desktop-icon': DesktopIcon,
        'det-id-icon': GetIdIcon,
        'language-icon': LanguageIcon,
        'login-icon': LoginIcon,
        'menu-element': MenuElement,
        'mobile-icon': MobileIcon,
        'report-problem': ReportProblem,
        'terms-icon': TermsIcon,
    },
})
export default class LeftSideMenu extends Vue {
    /**
     * Indicator whether force mobile mode is active.
     */
    @generalParameters.Getter(IS_FORCE_MOBILE_MODE)
    public isForceMobileMode: boolean;

    /**
     * Current user account information.
     */
    @userModule.Getter(GET_USER_DATA)
    public currentUserData: CurrentUser;

    /**
     * Menu elements to be displayed.
     */
    public get menuItems(): MenuItem[] {
        const disabled = true;
        return [
            {
                icon: AboutIcon,
                link: '/',
                title: 'About Gapopa',
            },
            {
                disabled,
                icon: LanguageIcon,
                title: 'EN, English',
            },
            {
                disabled,
                icon: GetIdIcon,
                title: 'New Gapopa ID',
            },
            {
                disabled,
                icon: AddContactIcon,
                title: 'Add contact',
            },
            {
                icon: TermsIcon,
                link: '/terms',
                title: 'Terms of use',
            },
            {
                icon: ReportProblem,
                link: '/support',
                title: 'Report a problem',
            },
            {
                icon: LoginIcon,
                link: '/login',
                title: 'Log in',
            },
            {
                callback: this.toggleForceMobileMode,
                icon: this.isForceMobileMode ? DesktopIcon : MobileIcon ,
                title: this.isForceMobileMode
                    ? 'Desktop version'
                    : 'Mobile version',
            },
        ];
    }

    /**
     * Toggles force mobile mode state.
     */
    @generalParameters.Action(TOGGLE_FORCE_MOBILE_MODE)
    public toggleForceMobileMode: () => Promise<void>;

    /**
     * Closes menu on elements click. Triggers element callback if provided.
     *
     * @param callback                  Callback to be triggered on element
     *                                  click.
     */
    public buttonClick(callback?: () => unknown): void {
        if(typeof callback === 'function') callback();
        this.$emit('close');
    }
}
