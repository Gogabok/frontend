import { MessageAttachment } from 'models/Attachment';

export type MessageStatusType = 'read' | 'sent' | 'delivered' | 'unread';

export interface Message {
    id: string;
    num: string;
    time: number;
    isUserMessage: boolean;
    message: string;
    repliedMessage: Message | null;
    status: MessageStatusType;
    forwarded: boolean;
    forwardedFromUser: {
        name: string | null,
        id: string,
        num: string,
    } | null;
    userId: string;
    mediaGroup: MessageAttachment[] | null;
    attachment: MessageAttachment | null;
}
