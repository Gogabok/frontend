export enum UserStatusCode {
    Online = 'is-online',
    Away = 'is-away',
    Private = 'is-private',
    Busy = 'is-busy',
    Custom = 'custom',
}

export type UserStatus = {
    code: UserStatusCode,
    description: string | null,
    title: string,
    id: string,
}
