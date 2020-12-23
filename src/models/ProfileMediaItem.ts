export type ProfileMediaItemType = 'video' | 'image';

export interface ProfileMediaItem {
    poster: string;
    type: ProfileMediaItemType;
    src: string;
    id: string;
}
