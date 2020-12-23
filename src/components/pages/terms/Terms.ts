import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { MetaInfo } from 'models/MetaInfo';

import TermsIcon from 'components/icons/TermsIcon.vue';


/**
 * Terms of use page component.
 */
@Component({
    components: {
        'terms-icon': TermsIcon,
    },
})
export default class Terms extends Vue {
    /**
     * Page meta information:
     * - title;
     * - meta tags content;
     * - etc.
     */
    public get metaInfo(): MetaInfo {
        return {
            meta: [
                { content: 'Terms of Use description', name: 'description' },
                { content: 'Terms of Use keywords', name: 'keywords' },
            ],
            title: 'Terms of Use',
        };
    }
}
