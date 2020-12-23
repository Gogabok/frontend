import Vue, { VueConstructor } from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import AngleIcon from 'components/icons/AngleIcon.vue';


/**
 * Component used as template for own-profile action.
 */
@Component({
    components: {
        'angle-icon': AngleIcon,
    },
})
export default class OwnProfileAction extends Vue {
    /**
     * Name of the action.
     */
    @Prop({ required: true }) name: string;

    /**
     * Icon of the action.
     */
    @Prop({ required: true }) icon: VueConstructor<Vue>;
}
