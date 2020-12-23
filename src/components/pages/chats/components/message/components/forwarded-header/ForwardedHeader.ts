import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import ForwardIcon from 'components/icons/ForwardIcon.vue';


/**
 * Forwarded message header component. Indicates, that message was forwarded and
 * provides info about origin.
 */
@Component({
    components: {
        'forward-icon': ForwardIcon,
    },
})
export default class ForwardedHeader extends Vue {
    /**
     * User name.
     */
    @Prop({
        required: true,
        type: String,
    }) num;
}
