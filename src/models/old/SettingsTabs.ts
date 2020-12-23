/**
 * Available settings tabs.
 */
enum SettingsTabs {
    NONE,
    PRIVACY = 'privacy-tab',
    SECURITY = 'security-tab',
    ACCOUNT = 'account-tab',
}

/**
 * Settings item common interface.
 */
export interface SettingsItem {
    name: string;
    title: string;
}

/**
 * Data model interface for the Email component.
 * It's useful for using with RadDataForm component.
 */
export interface EmailSourceData {
    email: string;
}

/**
 * Data model interface for the Name component.
 * It's useful for using with RadDataForm component.
 */
export interface NameSourceData {
    name: string;
}

/**
 * Data model interface for the UniqueLogin component.
 * It's useful for using with RadDataForm component.
 */
export interface LoginSourceData {
    login: string;
}

/**
 * Data model interface for the Password component.
 * It's useful for using with RadDataForm component.
 */
export interface PasswordSourceData {
    oldPassword: string;
    newPassword: string;
    repeatNewPassword: string;
}


export default SettingsTabs;
