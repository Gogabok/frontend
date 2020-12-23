import { Component, Prop } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';

import { sendVerificationCode } from 'utils/profileRequests';

import { OwnEmail } from 'models/Mail';

import ProfileFieldProgressIndicator from 'mixins/profileFieldProgressIndicator';

import CheckedIcon from 'components/icons/CheckedIcon.vue';
import WatchIcon from 'components/icons/WatchIcon.vue';


/**
 * Component, that allows user to enter and send email verification code.
 */
@Component({
    components: {
        'accept-icon': CheckedIcon,
        'loading-icon': WatchIcon,
    },
})
export default class VerificationField extends mixins(
    ProfileFieldProgressIndicator,
) {
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

    /**
     * Indicator whether verification code is being re-sent.
     */
    public isResent: boolean = false;

    /**
     * Code, entered by user.
     */
    public code: string = '';

    /**
     * Error to be displayed.
     */
    public error: string | null = null;


    /**
     * Sends verification code. Sets email verified if it's correct.
     */
    public async verifyMail(): Promise<void> {
        this.startLoading();
        const isOk = await sendVerificationCode({
            code: this.code,
            email: this.email.value,
        });

        if(isOk) {
            await this.setEmailVerified({
                email: this.email,
                isPublic: false,
            });
            this.succeed();
        } else {
            this.fail();
        }
    }

    /**
     * Sends verification code to provided email and sets `isResent` indicator
     * to `true`.
     */
    public reSendCode(): void {
        !this.isResent && (this.isResent = true);
        sendVerificationCode({
            code: this.code,
            email: this.email.value,
        });
    }
}
