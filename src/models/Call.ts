/**
 * Describes available call types.
 */
export enum CallType {
    Audio = 'audio',
    Video = 'video',
}

/**
 * Describes available call states.
 */
export enum CallStates {
    NONE,
    LOADING,
    AWAITING,
    ACTIVE,
    RECONNECTING,

    ENDED,
    DECLINED,
    BUSY,
    FAILED_TO_CONNECT,
    NO_RESPONSE,
}

export enum MediaDeviceType {
    Video = 'video',
    Audio = 'audio',
    All = 'all',
}

export const DeviceTypeAsString = {
    0: 'audio',
    1: 'video',
};

/**
 * Video capture device.
 */
export enum CameraType {
    Front = 'facingModeUser',
    Back = 'facingModeEnvironment',
    Screen = 'screen',
}

export enum MediaKind {
    /**
     * Audio track.
     */
    Audio,
    /**
     * Video track.
     */
    Video,
}
/**
 * Describes the directions that the camera can face, as seen from the user's
 * perspective. Representation of [VideoFacingModeEnum][1].
 *
 * [1]: https://w3.org/TR/mediacapture-streams/#dom-videofacingmodeenum
 */
export enum FacingMode {
    /**
     * Facing toward the user (a self-view camera).
     */
    User,
    /**
     * Facing away from the user (viewing the environment).
     */
    Environment,
    /**
     * Facing to the left of the user.
     */
    Left,
    /**
     * Facing to the right of the user.
     */
    Right,
}
/**
 * Media source type.
 */
export enum MediaSourceKind {
    /**
     * Media is sourced from some media device (webcam or microphone).
     */
    Device,
    /**
     * Media is obtained with screen-capture.
     */
    Display,
}
