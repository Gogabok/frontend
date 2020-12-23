import { mixins } from 'vue-class-component';
import { Component, Prop } from 'vue-property-decorator';

import RouterActions from 'mixins/router-actions';

import PasswordIcon from 'components/icons/PasswordIcon.vue';
import AngleIcon from 'components/icons/AngleIcon.vue';


/**
 * New password header component.
 */
@Component({
    components: {
        'angle-icon': AngleIcon,
        'password-icon': PasswordIcon,
    },
})
export default class PasswordHeader extends mixins(RouterActions) {
    /**
     * Page title string value.
     */
    @Prop({ default: '' }) pageTitle: string;

    /**
     * Indicator, whether arrow is visible.
     */
    @Prop({ default: false }) isArrowVisible: boolean;
}
