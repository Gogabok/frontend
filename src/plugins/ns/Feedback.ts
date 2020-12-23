import { Feedback, FeedbackShowOptions } from 'nativescript-feedback';


/**
 * Wrapper for `nativescript-feedback` plugin.
 *
 * {@link https://github.com/EddyVerbruggen/nativescript-feedback}
 */
export default class NativeFeedback {

    /**
     * Private instance of feeedback plugin.
     * Must be a singleton.
     */
    private static feedback: Feedback;

    /**
     * Initializes plugin.
     */
    public static init(): void {
        this.feedback = new Feedback();
    }

    /**
     * Calls feedback's success method.
     */
    public static success(
        options: FeedbackShowOptions,
    ): void {
        this.feedback.success({ ...options });
    }

    /**
     * Calls feedback's error method.
     */
    public static error(
        options: FeedbackShowOptions,
    ): void {
        this.feedback.error({ ...options });
    }
}
