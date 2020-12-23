import { mixins } from 'vue-class-component';
import { Component } from 'vue-property-decorator';

import RouterActions from 'mixins/router-actions';

import AngleIcon from 'components/icons/AngleIcon.vue';
import LoginIcon from 'components/icons/LoginIcon.vue';


/**
 * Login page header component.
 */
@Component({
    components: {
        'angle-icon': AngleIcon,
        'login-icon': LoginIcon,
    },
})
export default class LoginHeader extends mixins(RouterActions) {}
