import Message from 'models/old/im/Message';


export default class MessagesMorphers {

    /**
     * Move last status of each conversation participant to end of
     * conversation messages.
     *
     * @param messages  Message list to update.
     */
    public static pushStatusToTheBottom(messages: Message[]): void {
        const statusList = messages.reduce((res, msg, i) => {
            if ((msg.isStatus)
                && (!msg.mine)
                && (res.findIndex(
                    (status) => {
                        return status.sender?.num === msg.sender?.num;
                    },
                ) === -1)
            ) {
                res.push(messages.splice(i, 1)[0]);
            }
            return res;
        }, [] as Message[]);
        statusList.forEach((status) => messages.push(status));
    }
}
