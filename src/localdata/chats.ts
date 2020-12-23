import { ChatPartial } from 'models/Chat';

function generateMessages() {
    const messages = [];
    let id = 21141608200901939;
    for(let i = 100; i < 999; i++) {
        messages.push({
            attachment: null,
            forwarded: false,
            forwardedFromUser: null,
            id: `chid-0000${id++}`,
            isUserMessage: true,
            mediaGroup: null,
            message: `Test message-${i}`,
            num: `0000000000000${i}`,
            repliedMessage: null,
            status: 'sent',
            time: 1608201080128 + i,
            userId: 'uid-andrey',
        });
    }
    return messages;
}

export const chats =  [
    {
        attachments: [],
        dialogs: [
            {
             date: new Date().getTime(),
             messages: [
                 {
                     attachment: null,
                     forwarded: false,
                     forwardedFromUser: null,
                     id: 'chid-000019991606225443284',
                     isUserMessage: true,
                     mediaGroup: null,
                     message: 'test unread message',
                     num: '00000001',
                     repliedMessage: null,
                     status: 'unread',
                     time: new Date().getTime() - 366 * 1000 * 70 * 60 * 24,
                     userId: 'uid-roman',
                 },
                ],
            },
        ],
        id: 'uid-verstka',
        isKicked: false,
        isLeft: false,
        participants: [
            'uid-andrey',
            'uid-kirill',
            'uid-roman',
            'uid-alexey',
        ],
        type: 'group',
        ver: '1',
    },
    {
        attachments: [],
        dialogs: [
            {
                date: 1608201080128,
                messages: generateMessages(),
             },
        ],
        id: 'chid-00002114',
        isKicked: false,
        isLeft: false,
        participants: ['uid-andrey', 'uid-kirill'],
        type: 'person',
        ver: '1',
    },
] as ChatPartial[];

export default chats;