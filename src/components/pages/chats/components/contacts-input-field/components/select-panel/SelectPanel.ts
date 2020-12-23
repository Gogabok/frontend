import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import DeleteIcon from 'components/icons/DeleteIcon.vue';
import ForwardIcon from 'components/icons/ForwardIcon.vue';
import PlusIcon from 'components/icons/PlusIcon.vue';
import ShareIcon from 'components/icons/ShareIcon.vue';


/**
 * Component, that allows user to forward/delete selected messages.
 */
@Component({
    components: {
        'delete-icon': DeleteIcon,
        'forward-icon': ForwardIcon,
        'plus-icon': PlusIcon,
        'share-icon': ShareIcon,
    },
})
export default class SelectPanel extends Vue {
    /**
     * Indicator whether panel should be visible.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isVisible;

    /**
     * Indicator whether any message is selected.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isAnyMessageSelected;

    /**
     * Indicator whether it is removal or forward selection.
     */
    @Prop({
        default: 'forward',
        type: String,
    }) type;

    /**
     * Indicator whether delete confirm window is visible.
     */
    public isVisibleDeleteConfirm: boolean = false;

    /**
     * Calls target action based on select type.
     */
    public actionButtonClickHandler(): void {

        const conditions = {
            0: this.type === 'forward',
            1: this.type === 'delete',
        };

        const actions = {
            0: () => this.$parent.$emit('forward'),
            1: () => {
                if(!this.isVisibleDeleteConfirm) {
                    this.isVisibleDeleteConfirm = true;
                } else {
                    this.$parent.$emit('delete');
                    this.isVisibleDeleteConfirm = false;
                }
            },
        };

        Object.entries(conditions).forEach(
            ([key, value]) => value && actions[key](),
        );
    }
}
