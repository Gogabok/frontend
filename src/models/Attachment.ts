export type AttachmentType = 'audio' | 'video' | 'doc' | 'image';

export interface Attachment {
    type: AttachmentType;
    extension: string;
    size: number;
    name: string;
    src: string | File;
    poster: string;
    id: string;
}

export interface MessageAttachment extends Attachment {
    src: string;
}
