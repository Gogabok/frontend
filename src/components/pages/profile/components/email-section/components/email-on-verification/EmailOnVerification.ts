import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { OwnEmail } from 'models/Mail';

import VerificationField from 'components/pages/profile/components/email-section/components/verification-field/VerificationField.vue';
import Verified from 'components/pages/profile/components/email-section/components/verified-email/VerifiedEmail.vue';


/**
 * Component, that displays unverified email.
 */
@Component({
    components: {
        'valid-email': Verified,
        'verification-field': VerificationField,
    },
})
export default class ProfileEmailOnVerification extends Vue {
    /**
     * Own email object.
     */
    @Prop({
        default: () => ({}),
        type: Object,
    }) email: OwnEmail;

    /**
     * Sets email verified.
     */
    @Prop({ required: true })
    setEmailVerified: (payload: {
        email: OwnEmail,
        isPublic: boolean,
    }) => Promise<void>;
}
