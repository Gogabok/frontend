import { MessageAttachment } from 'models/Attachment';
import { ContactType } from 'models/Contact';
import { Dialog } from 'models/Dialog';
import { User, UserCore } from 'models/User';

interface IChatCore {
    dialogs: Dialog[];
    participants: string[] | User[];
    type: ContactType;
    attachments: MessageAttachment[];
    id: string;
    isKicked: boolean;
    isLeft: boolean;
    ver: string;
}

export interface ChatPartial extends IChatCore{
    participants: string[];
}

export interface Chat extends UserCore, IChatCore {
    isBlocked: boolean;
    isMuted: boolean;
    mutedUntil: number | null;
    isFavorite: boolean;
    participants: User[];
    hasOngoingCall: boolean;
}
