import { User } from 'models/User';

export enum PopupAlign {
    Center = 'center',
    Start = 'start',
    End = 'end',
}

export enum PopupType {
    Alert = 'alert',
    Confirm = 'confirm',
    Contacts = 'contacts',
}

export interface PopupSettings {
    align: {
        vertical: PopupAlign,
        horizontal: PopupAlign,
    };
    position: {
        bottom: number,
        left: number,
        right: number,
        top: number,
    };
    type: PopupType;
}

export interface IPopup {
    id:                 string;
    confirmCallback:    ContactsListPopupCallback
                        | (() => void )
                        | null;
    settings:           PopupSettings;
    textMessage:        string | null;
}

export class Popup implements IPopup {
    public id: string;
    public confirmCallback: (() => void) | null;
    public settings: PopupSettings;
    public textMessage: string | null;

    constructor(settings: {
        id:                 string,
        confirmCallback:    (() => void) | null,
        settings:           PopupSettings,
        textMessage:        string | null,
    }) {
        this.id = settings.id;
        this.settings = settings.settings;
        this.confirmCallback = settings.confirmCallback;
        this.textMessage = settings.textMessage;
    }
}

export enum ContactsListPopupState {
    AddGroupMember = 'add-contact',
    AddCallMember = 'add-call-member',
    Forward = 'forward',
    SendContact = 'send-contact',
}

type ContactsListPopupCallback =
    (data: { selectedContacts: User[] } ) => void | Promise<void>;

export class ContactsListPopup implements IPopup {
    public id: string;
    public confirmCallback: ContactsListPopupCallback;
    public settings: PopupSettings;
    public textMessage: string | null;
    public state: ContactsListPopupState;
    public disabledContactsIds: string[];
    public preselectedContactsIds: string[];

    constructor(settings: {
        id:                 string,
        settings:           PopupSettings,
        textMessage:        string | null,
        state:              ContactsListPopupState,
        confirmCallback:    ContactsListPopupCallback,
        disabledContactsIds?: string[],
        preselectedContactsIds?: string[],
    }) {
        this.disabledContactsIds = settings.disabledContactsIds || [];
        this.preselectedContactsIds = settings.preselectedContactsIds || [];
        this.id = settings.id;
        this.settings = settings.settings;
        this.confirmCallback = settings.confirmCallback;
        this.textMessage = settings.textMessage;
        this.state = settings.state;
    }
}

export const defaultSettings = {
    align: {
        horizontal: PopupAlign.Center,
        vertical: PopupAlign.End,
    },
    position: {
        bottom: 55,
        left: 400,
        right: 0,
        top: 0,
    },
    state: null,
    type: PopupType.Alert,
};
