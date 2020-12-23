import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { CallType } from 'models/Call';

import CallIcon from 'components/icons/CallIcon.vue';
import ChatsIcon from 'components/icons/Chats.vue';
import VideoCameraIcon from 'components/icons/VideoCameraIcon.vue';
import ProfileItem from 'components/pages/contacts/components/profile/components/profile-item/ProfileItem.vue';


/**
 * Component allowing user to make a call to a profile owner.
 */
@Component({
    components: {
        'call-icon': CallIcon,
        'chat-icon': ChatsIcon,
        'profile-item': ProfileItem,
        'video-camera-icon': VideoCameraIcon,
    },
})
export default class ProfileCallSection extends Vue {
    /**
     * Opens a chat with the profile owner.
     */
    public writeMessage(): void {
        this.$emit('message');
    }

    /**
     * Makes an audio call to the profile owner.
     */
    public startAudioCall(): void {
        this.$emit('call', CallType.Audio);
    }

    /**
     * Makes a video call to the profile owner.
     */
    public startVideoCall(): void {
        this.$emit('call', CallType.Video);
    }
}
