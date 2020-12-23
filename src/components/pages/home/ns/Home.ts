import { Component } from 'vue-property-decorator';

import HomeCore from '../Home.core';

import CommonActionBar from 'components/common/ns/common-action-bar/CommonActionBar.vue';


/**
 * Home page component.
 */
@Component({
    components: {
        CommonActionBar,
    },
})
export default class Home extends HomeCore {}
