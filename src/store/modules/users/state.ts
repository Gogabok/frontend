import { UserPartial } from 'models/User.ts';

import { users } from 'localdata/users';


export default class UsersState {
    /**
     * List of users core information related to current app user's contacts or
     * chats.
     */
    public users: UserPartial[];

    constructor() {
        this.users = users;
    }
}
