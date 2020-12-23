import Vue from 'vue';
import Component from 'vue-class-component';

import DefaultPage from '../default-page/DefaultPage.vue';


/**
 * Not found page component.
 */
@Component({
    components: {
        DefaultPage,
    },
})
export default class NotFound extends Vue {

    /**
     * Returns meta information of page, such as:
     * title, meta tags content etc.
     *
     * @return    Object, that contains page meta info.
     */
    public metaInfo(): any { // eslint-disable-line
        return {
            meta: [
                { content: 'Not found page description', name: 'description' },
                { content: 'not found, page, keywords', name: 'keywords' },
            ],
            title: this.$t('pages.not-found.title'),
        };
    }
}
