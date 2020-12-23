import { User } from 'models/User';

export type ContactType = 'group' | 'person';

export interface Contact extends User {
    isFavorite: boolean;
    type: ContactType;
}
