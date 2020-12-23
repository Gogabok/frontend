import Component from 'vue-class-component';

import HomeCore from '../Home.core';

import SwipeMenuMixin from 'mixins/swipe-menu.ts';

import AddContactIcon from 'components/icons/AddContact.vue';
import GetIdIcon from 'components/icons/GetIdIcon.vue';
import LoginIcon from 'components/icons/LoginIcon.vue';


/**
 * Home page component.
 *
 * Also represents a basic application template.
 */
@Component({
    components: {
        AddContactIcon,
        GetIdIcon,
        LoginIcon,
    },
    mixins: [SwipeMenuMixin],
})
export default class Home extends HomeCore {

    /**
     * Returns meta information of page, such as:
     * title, meta tags content etc.
     *
     * @return    Object, that contains page meta info.
     */
    public metaInfo(): any { // eslint-disable-line
        return {
            meta: [
                { content: 'Home page description', name: 'description' },
                { content: 'home, page, keywords', name: 'keywords' },
            ],
            title: this.$t('pages.home.title'),
        };
    }
}
