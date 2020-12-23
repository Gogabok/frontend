import { CurrentUser } from 'models/CurrentUser.ts';
import { UserStatusCode } from 'models/UserStatus';

const user: CurrentUser = {
    about: '',
    avatarId: 'profile-attachment-1',
    avatarPath: '',
    blockedUsers: [],
    contacts: [
        'uid-andrey',
        'uid-kirill',
        'uid-alexey',
        'uid-roman',
        'uid-egor',
        'uid-evgeniy',
        'uid-vladislav',
        'uid-greg',
        'uid-alexandr',
        'uid-maria',
    ],
    emails: [{
        isPublic: true,
        isVerified: false,
        value: 'test@mail.com',
    }],
    favoriteContacts: [
        'uid-egor',
    ],
    gallery: [
        {
            id: 'profile-attachment-1',
            poster: 'https://images.ctfassets.net/hrltx12pl8hq/17iLMo2CS9k9k3d2v9uznb/d3e7080e01a1aedca423eb220efc23ee/shutterstock_1096026971_copy.jpg?fit=fill&w=480&h=400',
            src: 'https://images.ctfassets.net/hrltx12pl8hq/17iLMo2CS9k9k3d2v9uznb/d3e7080e01a1aedca423eb220efc23ee/shutterstock_1096026971_copy.jpg?fit=fill&w=480&h=400',
            type: 'image',
        },
        {
            id: 'profile-attachment-2',
            poster: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
            src: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
            type: 'image',
        },
    ],
    hasPassword: true,
    id: 'uid-1',
    lastSeen: new Date().getTime(),
    login: '',
    mutedUsers: [],
    name: '',
    num: 'user-1234',
    status: {
        code: UserStatusCode.Online,
        description: null,
        title: 'Last visit information (by default)',
    },
    ver: '1',
};

export default user;
