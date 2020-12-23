import { Component, Prop, Vue } from 'vue-property-decorator';

import AngleIcon from 'components/icons/AngleIcon.vue';


/**
 * Sidebar menu element component.
 */
@Component({
    components: {
        AngleIcon,
    },
})
export default class MenuElement extends Vue {

    /**
     * Title, displayed on the menu element.
     */
    @Prop(String) title;

    /**
     * Link, to which this menu element should lead.
     */
    @Prop(String) link;

    /**
     * Indicator whether component should be disabled (do not go to the link).
     */
    @Prop({ default: false, required: false }) disabled;
}
