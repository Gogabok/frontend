import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import CallIcon from 'components/icons/CallIcon.vue';


/**
 * End call button component allowing user to end the call.
 */
@Component({
    components: {
        'call-icon': CallIcon,
    },
})
export default class EndCallButton extends Vue {
    /**
     * Emits `end-call` event to end the call.
     */
    public endCall(): void {
        this.$emit('end-call');
    }
}
