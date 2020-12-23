import { MediaTrack } from 'medea-jason';


export enum CallParticipantStatus {
    DISCONNECTED,
    AWAITING,
    LOADING,
    ACTIVE,
}

export interface CallParticipant {
    id: string;
    callStatus: CallParticipantStatus;
    tracks: {
        video: MediaTrack[],
        audio: MediaTrack[],
    };
    isVideoMuted: boolean;
    isScreenSharingActive: boolean;
    hasVideoBeenActivated: boolean;
    hasAudioBeenActivated: boolean;
    isAudioMuted: boolean;
}
