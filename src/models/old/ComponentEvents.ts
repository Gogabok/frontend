/**
 * Events names, used for identify custom events of components.
 */

export enum EditableContentEvents {
    MESSAGE_SEND = 'message-send',
    MESSAGE_UPDATED = 'message-updated',
    SHOW_ATTACHMENT_WARNING ='show-attachment-warning',
    TOGGLE = 'toggle'
}

export enum TopMenuItemEvents {
    CLOSE = 'close'
}

export enum SigninEvents {
    RESTORE_PASSWORD = 'restore-password'
}

export enum AvatarEditorEvents {
    CLOSE = 'close'
}

export enum AsidePanelEvents {
    MOUNTED = 'mounted'
}

export enum ModalWindowEvents {
    MOUNTED = 'mounted'
}

export enum PersonalTextEditorEvents {
    CLOSE = 'close',
    STATE_CHANGE = 'state-change'
}

export enum TimelineEvents {
    CHANGE = 'change',
}

export enum MessageMenuEvents {
    SET_MENU_STATE = 'set-menu-state',
    SEND_MESSAGE = 'send-message',
    TRANSLATE_DECLINE = 'translate-decline'
}

export enum SettingsItemEvents {
    EDITOR_SHOW = 'editor-show',
    EDITOR_HIDE = 'editor-hide'
}

export enum MakeDonationEvents {
    AMOUNT_UPDATED = 'amount-updated'
}

export enum AttachmentWarningEvents {
    CLOSE = 'close'
}

export enum AttachmentFullscreenEvents {
    UPDATE__CURRENT_INDEX = 'update:currentIndex'
}

export enum MessagesContainerEvents {
    SET_IS_MESSAGES_EMPTY = 'set-is-messages-empty',
    MESSAGES_MENU = 'messages-menu',
    SET_MENU_STATE = 'set-menu-state'
}
