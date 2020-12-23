/**
 * Indicator which shows buttons state of active call.
 */
export default class ButtonsState {

    /**
     * Indicator whether user camera is on.
     */
    public isCameraOn: boolean;

    /**
     * Indicator whether user microphone is on.
     */
    public isMicOn: boolean;

    /**
     * Indicator whether call buttons are hidden.
     */
    public isHidden: boolean;

    /**
     * Default constructor.
     */
    public constructor(isCameraOn?: boolean, isMicOn?: boolean) {
        this.isCameraOn = isCameraOn || false;
        this.isMicOn = isMicOn || true;
        this.isHidden = false;
    }
}
