import { DataProxy } from 'apollo-cache';
import { DocumentNode } from 'apollo-link';

import Apollo from 'plugins/Apollo';

import * as mockTypes from 'api/graphql/mock-types';
import { MessageErrors } from 'api/models/ApiErrors';
import Contact from 'models/old/im/Contact';
import ContactListTypes from 'models/old/im/ContactListTypes';
import Conversation from 'models/old/im/Conversation';
import { ConversationListTab } from 'models/old/im/conversation-list/StateTypes';
import Message from 'models/old/im/Message';
import MessageAttachment from 'models/old/im/MessageAttachment';
import ShareResult from 'models/old/ShareResult';

import * as Mutations from 'api/mocks/graphql/mutations';
import * as Queries from 'api/mocks/graphql/queries';

import MessagesMorphers from 'utils/MessagesMorphers';


/**
 * Implementation of internal messaging API.
 */
export default class Im {

    /**
     * Gets active user contacts list from API server.
     *
     * @param type   Contacts list type.
     *
     * @return   Promise with contacts list.
     */
    public static getContacts(
        type: ContactListTypes,
    ): Promise<Contact[]> {
        const queryOptions = this.getContactsQuery(type);
        return Apollo.mockClient.query<{ contacts: Contact[] }>(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            { ...queryOptions, fetchResults: true },
        ).then((result) => result.data.contacts);
    }

    /**
     * Gets recent or favourite active user conversations.
     *
     * @param type     Type of conversations.
     * @param offset   Conversations offset.
     * @param limit    Limit of conversations fetched at once.
     *
     * @return   Promise with conversation list.
     */
    public static getConversations(
        type: ConversationListTab,
        offset: number,
        limit: number,
    ): Promise<
        mockTypes.Conversations[]
        | mockTypes.Conversations_conversations
    > {
        return Apollo.mockClient.query<mockTypes.Conversations>(
            {
                query: Queries.Conversations,
                variables: {
                    limit,
                    offset,
                    type,
                },
            },
        ).then((result) => result.data.conversations);
    }

    /**
     * Change conversations list order.
     *
     * @param conversations Conversations list with changed order.
     *
     * @return   Resolved promise.
     */
    public static changeConversationsOrder(
        conversations: Conversation[],
    ): Promise<void> {
        return Apollo.mockClient.mutate<
            mockTypes.ChangeConversationsOrder,
            mockTypes.ChangeConversationsOrderVariables
        >(
            {
            mutation: Mutations.ChangeConversationsOrder,
            variables: {
                conversations:
                    conversations.map((contact) => ({ id: contact.id })),
            },
        }).then((result) => {
            return (
                !result.data?.changeConversationsOrder
                    ? Promise.reject('Something went wrong')
                    : Promise.resolve()
            );
        });
    }

    /**
     * Removes specified contact from active user contacts list.
     *
     * @param contact   Contact, that must be removed.
     *
     * @return   Resolved promise.
     */
    public static removeContact(
        contact: Conversation,
    ): Promise<void> {
        return Apollo.mockClient.mutate<
            mockTypes.RemoveContact,
            mockTypes.RemoveContactVariables
        >({
            mutation: Mutations.RemoveContact,
            update: (proxy) => {
                [ContactListTypes.FAVOURITES, ContactListTypes.ALL].forEach(
                    (type) => {
                        const query = this.getContactsQuery(type);
                        Apollo.updateQueryCache(proxy, query, (data) => {
                            data.contacts = data.contacts.filter(
                                ({ num }) => num !== contact.id,
                            );
                            return data;
                        });
                    },
                );
            },
            variables: {
                contact: {
                    num: contact.id,
                },
            },
        }).then((result) => (
            !result.data?.removeContact
            ? Promise.reject('Something went wrong')
            : Promise.resolve()
        ));
    }

    /**
     * Marks specified as blocked in active user contacts list.
     *
     * @param contact   Contact, that must be marked as blocked.
     *
     * @return   Resolved promise.
     */
    public static blockContact(
        contact: Conversation,
    ): Promise<void> {
        return Apollo.mockClient.mutate<
            mockTypes.BlockContact,
            mockTypes.BlockContactVariables
        >({
            mutation: Mutations.BlockContact,
            variables: {
                contact: {
                    num: contact.id,
                },
            },
        }).then((result) => (
            !result.data?.blockContact
            ? Promise.reject('Something went wrong')
            : Promise.resolve()
        ));
    }

    /**
     * Unmarks specified as blocked in active user contacts list.
     *
     * @param contact   Contact, that must be unmarked as blocked.
     *
     * @return   Resolved promise.
     */
    public static unblockContact(
        contact: Contact,
    ): Promise<void> {
        return Apollo.mockClient.mutate<
            mockTypes.UnblockContact,
            mockTypes.UnblockContactVariables
        >({
            mutation: Mutations.UnblockContact,
            update: (proxy) => {
                [ContactListTypes.FAVOURITES, ContactListTypes.ALL].forEach(
                    (type) => {
                        const query = this.getContactsQuery(type);
                        Apollo.updateQueryCache(proxy, query, (data) => {
                            const index = data.contacts.findIndex(
                                ({ num }) => num === contact.num,
                            );
                            contact = { ...contact, isBlockedByMe: false };
                            data.contacts[index] = contact;
                            data.contacts = [
                                ...data.contacts
                                    .filter((cont) => !cont.isBlockedByMe),
                                ...data.contacts
                                    .filter((cont) => cont.isBlockedByMe),
                            ];
                            return data;
                        });
                    },
                );
            },
            variables: {
                contact: {
                    num: contact.num,
                },
            },
        }).then((result) => (
            !result.data?.unblockContact
            ? Promise.reject('Something went wrong')
            : Promise.resolve()
        ));
    }

    /**
     * Mark or unmark specified contact as favourite in active user
     * conversations list.
     *
     * @param contact   Contact, that must be marked or unmarked as favourite.
     *
     * @return   Resolved promise.
     */
    public static toggleRememberContact(
        contact: Conversation,
    ): Promise<void> {
        return Apollo.mockClient.mutate<
            mockTypes.ToggleRememberContact,
            mockTypes.ToggleRememberContactVariables
        >({
            mutation: Mutations.ToggleRememberContact,
            variables: {
                contact: {
                    num: contact.id,
                },
            },
        }).then((result) => (
            !result.data?.toggleRememberContact
            ? Promise.reject('Something went wrong')
            : Promise.resolve()
        ));
    }

    /**
     * Rename specified contact.
     *
     * @param contact   Contact, that must be renamed.
     *
     * @return   Resolved promise with renamed contact.
     */
    public static renameContact(
        contact: Conversation,
    ): Promise<boolean> {
        return Apollo.mockClient.mutate<
            mockTypes.RenameContact,
            mockTypes.RenameContactVariables
        >({
            mutation: Mutations.RenameContact,
            variables: {
                contact: {
                    alias: contact.title,
                    num: contact.id,
                },
            },
        }).then((result) => (
            !result.data?.renameContact
            ? Promise.reject('Something went wrong')
            : Promise.resolve(result.data.renameContact)
        ));
    }

    /**
     * Sharing contact by passed conversation ID with passed link.
     *
     * @param conversationId    Conversation ID to identify contact to share.
     * @param link              Link to the contact that will be shared.
     *
     * @return   Resolved promise with ShareResult.
     */
    public static shareContact(
        conversationId: string,
        link: string,
    ): Promise<ShareResult> {
        return Apollo.mockClient.mutate<
            mockTypes.ShareContact,
            mockTypes.ShareContactVariables
        >({
            mutation: Mutations.ShareContact,
            variables: { conversationId, link },
        }).then((result) => (
            !result.data?.shareContact
            ? Promise.reject('Something went wrong')
            : Promise.resolve(result.data.shareContact)
        ));
    }

    /**
     * Sends support request.
     *
     * @param conversationId    Conversation ID to identify contact that must
     *                          be supported.
     * @param amount            Donation amount.
     * @param message           User message (comments to donation).
     * @param translate         Is need translate user message.
     *
     * @return    Resolved promise with mutation result.
     */
    public static supportContact(
        conversationId: string,
        amount: number,
        message: string,
        translate: boolean,
    ): Promise<mockTypes.SupportContact_supportContact> {
        return Apollo.mockClient.mutate<
            mockTypes.SupportContact,
            mockTypes.SupportContactVariables
        >({
            mutation: Mutations.SupportContact,
            variables: {
                amount,
                conversationId,
                message,
                translate,
            },
        }).then((result) => (
            !result.data?.supportContact
            ? Promise.reject('Something went wrong')
            : Promise.resolve(result.data.supportContact)
        ));
    }

    /**
     * Change status of the active user.
     *
     * @param status   New user status.
     *
     * @return   Resolved promise.
     */
    public static changeUserStatus(status: string): Promise<void> {
        return Apollo.mockClient.mutate<
            mockTypes.ChangeUserStatus,
            mockTypes.ChangeUserStatusVariables
        >({
            mutation: Mutations.ChangeUserStatus,
            variables: { status },
        }).then((result) => (
            !result.data?.changeUserStatus
            ? Promise.reject('Something went wrong')
            : Promise.resolve()
        ));
    }

    /**
     * Change slogan of the active user.
     *
     * @param slogan      New user slogan.
     * @param translate   Is need translate slogan.
     *
     * @return   Resolved promise.
     */
    public static changeUserSlogan(
        slogan: string,
        translate: boolean,
    ): Promise<void> {
        return Apollo.mockClient.mutate<
            mockTypes.ChangeUserSlogan,
            mockTypes.ChangeUserSloganVariables
        >({
            mutation: Mutations.ChangeUserSlogan,
            variables: { slogan, translate },
        }).then((result) => (
            !result.data?.changeUserSlogan
            ? Promise.reject('Something went wrong')
            : Promise.resolve()
        ));
    }

    /**
     * Gets conversation messages by conversation ID from API server.
     *
     * @param conversationId    Conversation ID.
     * @param count             Max length of returned messages list.
     * @param lastMessageId     Last Message ID in available messages list.
     * @param onlyPhoto         Optional, is fetched messages have to be a photo
     *                          attachments.
     * @param reverseFetch      Optional, is fetch must be reversed.
     *
     * @return  Resolved promise, with object, that contains messages, has more
     *          flag, and total count number of messages that can be
     *          fetched by passed conversation ID and onlyPhoto flag.
     */
    public static getConversationMessages(
        conversationId: string,
        count: number,
        lastMessageId: string,
        onlyPhoto?: boolean,
        reverseFetch?: boolean,
    ): Promise<{ messages: Message[], hasMore: boolean, totalCount: number }> {
        return Apollo.mockClient.query<{ conversationMessages: {
            messages: Message[],
            hasMore: boolean,
            totalCount: number,
        }, }>({
            ...this.getConversationMessagesQuery(
                conversationId,
                count,
                lastMessageId,
                onlyPhoto,
                reverseFetch,
            ),
            fetchResults: true,
        }).then((result) => result.data.conversationMessages);
    }

    /**
     * Move last status of each conversation participant to end of
     * conversation messages.
     *
     * @param conversationId    Conversation ID that have to be updated.
     * @param count             Max length of returned messages list.
     */
    public static pushStatusToTheBottomCacheUpdate(
        conversationId: string,
        count: number,
    ): void {
        const query = this.getConversationMessagesQuery(conversationId, count);
        Apollo.updateQueryCache(Apollo.client, query, (data) => {
            const messages = data.conversationMessages.messages;
            MessagesMorphers.pushStatusToTheBottom(messages);
            return data;
        });
    }

    /**
     * Adds new specified message to the conversation messages list.
     * Deletes message by its ID. Update apollo query cache.
     *
     * @param conversationId    Conversation ID, for update apollo cache.
     * @param count             Count messages to load, for update apollo cache.
     * @param messageId         Message ID that must be deleted.
     *
     * @return  Resolved promise, with deleted at time in ISO 8601
     *          format.
     */
    public static deleteConversationMessage(
        conversationId: string,
        count: number,
        messageId: string,
    ): Promise<string> {
        return Apollo.mockClient.mutate<
            mockTypes.DeleteConversationMessage,
            mockTypes.DeleteConversationMessageVariables
        >({
            mutation: Mutations.DeleteConversationMessage,
            update: (proxy, { data: mutationData }) => {
                if (!mutationData || !mutationData.deleteConversationMessage) {
                    return;
                }
                const query = this.getConversationMessagesQuery(
                    conversationId,
                    count,
                );
                Apollo.updateQueryCache(proxy, query, (data: {
                    conversationMessages: {
                        messages: Message[],
                        hasMore: boolean,
                    },
                }) => {
                    const message = data.conversationMessages.messages
                        .find(({ id }) => id === messageId);
                    if (message !== undefined && !message.deleted) {
                        message.deleted = true;
                        message.deletedAt =
                            mutationData.deleteConversationMessage;
                    }
                    return data;
                });
            },
            variables: { messageId },
        }).then((result) => {
                if (result.data?.deleteConversationMessage === undefined) {
                    return Promise.reject('Something went wrong');
                }
                if (result.data?.deleteConversationMessage === null) {
                    return Promise.reject(MessageErrors.ALREADY_REMOVED);
                }
                return Promise.resolve(result.data.deleteConversationMessage);
            });
    }

    /**
     * Restores message by its ID. Update apollo query cache.
     *
     * @param conversationId    Conversation ID, for update apollo cache.
     * @param count             Count messages to load, for update apollo cache.
     * @param messageId         Message ID that must be restored.
     *
     * @return  Resolved promise, with success flag of message restore.
     */
    public static restoreConversationMessage(
        conversationId: string,
        count: number,
        messageId: string,
    ): Promise<boolean> {
        return Apollo.mockClient.mutate<
            mockTypes.RestoreConversationMessage,
            mockTypes.RestoreConversationMessageVariables
        >({
            mutation: Mutations.RestoreConversationMessage,
            update: (proxy, { data: mutationData }) => {
                if (!mutationData || !mutationData.restoreConversationMessage) {
                    return;
                }
                const query = this.getConversationMessagesQuery(
                    conversationId,
                    count,
                );
                Apollo.updateQueryCache(proxy, query, (data: {
                    conversationMessages: {
                        messages: Message[],
                        hasMore: boolean,
                    },
                }) => {
                    const message = data.conversationMessages.messages
                        .find(({ id }) => id === messageId);
                    if (message !== undefined) {
                        message.deleted = false;
                        message.deletedAt = null;
                    }
                    return data;
                });
            },
            variables: { messageId },
        }).then((result) => (
            !result.data?.restoreConversationMessage
            ? Promise.reject('Something went wrong')
            : Promise.resolve(result.data.restoreConversationMessage)
        ));
    }

    /**
     * Deletes messages by conversation ID. Update apollo query cache.
     *
     * @param conversationId    Conversation ID.
     * @param count             Count messages to load, for update apollo cache.
     * @param lastMessageId     Message ID, from which, messages must be
     *                          removed.
     *
     * @return  Resolved promise, with deleted at time in ISO 8601 format.
     */
    public static deleteAllConversationMessages(
        conversationId: string,
        count: number,
        lastMessageId: string,
    ): Promise<mockTypes.DeleteAllConversationMessages> {
        return Apollo.mockClient.mutate<
            mockTypes.DeleteAllConversationMessages,
            mockTypes.DeleteAllConversationMessagesVariables
        >({
            mutation: Mutations.DeleteAllConversationMessages,
            update: (proxy, { data: mutationData }) => {
                if ((!mutationData)
                    || (!mutationData.deleteAllConversationMessages)
                ) {
                    return;
                }
                const query = this.getConversationMessagesQuery(
                    conversationId,
                    count,
                );
                Apollo.updateQueryCache(proxy, query, (data: {
                    conversationMessages: {
                        messages: Message[],
                        hasMore: boolean,
                    },
                }) => {
                    data.conversationMessages.hasMore = false;
                    data.conversationMessages.messages
                        .forEach((message) => {
                            if (message.deleted) {
                                return;
                            }
                            message.deleted = true;
                            message.deletedAt =
                                mutationData.deleteAllConversationMessages;
                        });
                    return data;
                });
            },
            variables: { conversationId, lastMessageId },
        }).then((result) => (
            !result.data
                ? Promise.reject('Something went wrong')
                : Promise.resolve(
                    {
                        ...result.data,
                    } as mockTypes.DeleteAllConversationMessages,
                )
        ));
    }

    /**
     * Restores messages by conversation ID. Update apollo query cache.
     *
     * @param conversationId    Conversation ID.
     * @param count             Count messages to load, for update apollo cache.
     *
     * @return  Resolved promise, with allowed time in ISO 8601 format since
     *          when deleted messages can be restored.
     */
    public static restoreAllConversationMessages(
        conversationId: string,
        count: number,
    ): Promise<mockTypes.RestoreAllConversationMessages> {
        return Apollo.mockClient.mutate<
            mockTypes.RestoreAllConversationMessages,
            mockTypes.RestoreAllConversationMessagesVariables
        >({
            mutation: Mutations.RestoreAllConversationMessages,
            update: (proxy, { data: mutationData }) => {
                if ((!mutationData)
                    || (!mutationData.restoreAllConversationMessages)
                ) {
                    return;
                }
                const query = this.getConversationMessagesQuery(
                    conversationId,
                    count,
                );
                Apollo.updateQueryCache(proxy, query, (data: {
                    conversationMessages: {
                        messages: Message[],
                        hasMore: boolean,
                    },
                }) => {
                    const allowedTime =
                        mutationData.restoreAllConversationMessages;
                    data.conversationMessages.hasMore = true;
                    data.conversationMessages.messages
                        .forEach((message) => {
                            if ((message.deletedAt !== null)
                                && (Date.parse(allowedTime)
                                    < Date.parse(message.deletedAt))
                            ) {
                                message.deleted = false;
                                message.deletedAt = null;
                            }
                        });
                    return data;
                });
            },
            variables: { conversationId },
        }).then((result) => (
            !result.data
            ? Promise.reject('Something went wrong')
            : Promise.resolve(
                { ...result.data } as mockTypes.RestoreAllConversationMessages,
            )
        ));
    }

    /**
     * Adds new specified message to the conversation messages list. And update
     * conversationMessages apollo query cache.
     *
     * @param message   Message, that must be added.
     * @param count     Count of messages to load (required for conversation
     *                  messages query cache update).
     * @param files     Attached to message files.
     *
     * @return   Added messages with already assigned ID and sent time.
     */
    public static sendConversationMessage(
        message: Message,
        count: number,
        files: File[],
    ): Promise<Message[]> {
        const newMessages: Message[] = [];
        return Apollo.mockClient.mutate<
            mockTypes.SendConversationMessage,
            mockTypes.SendConversationMessageVariables
        >({
            mutation: Mutations.SendConversationMessage,
            update: (proxy, { data: mutationData }) => {
                const query = this.getConversationMessagesQuery(
                    message.conversationId,
                    count,
                );
                if (!mutationData || !mutationData.sendConversationMessage) {
                    return;
                }
                mutationData.sendConversationMessage.forEach((sendMessage) => {
                    const newMessage = { ...message };
                    newMessage.id = sendMessage.id;
                    newMessage.sentAt = sendMessage.sentAt;
                    newMessage.status = sendMessage.status;
                    newMessage.attachment =
                        (sendMessage.attachment as MessageAttachment);
                    if (sendMessage.attachment !== null) {
                        newMessage.text = null;
                    }
                    (newMessage as any).__typename = sendMessage.__typename; // eslint-disable-line
                    newMessages.push(newMessage);
                });
                Apollo.updateQueryCache(proxy, query, (data) => {
                    data.conversationMessages.messages.push(...newMessages);
                    return data;
                });
            },
            variables: {
                files,
                message: {
                    attachments: null,
                    conversationId: message.conversationId,
                    text: message.text,
                    translate: message.translate,
                },
            },
        }).then((result) => (
            !result.data?.sendConversationMessage
            ? Promise.reject('Something went wrong')
            : Promise.resolve(newMessages)
        ));
    }

    /**
     * Make transfer message request, and update apollo conversation messages
     * cache.
     *
     * @param message           Message, that have to be transferred.
     * @param conversationIds   Conversation IDs array.
     * @param count             Count of messages to load (required for
     *                          conversation messages query cache update).
     *
     * @return  Resolved promise with transferred messages list.
     */
    public static transferConversationMessage(
        message: Message,
        conversationIds: string[],
        count: number,
    ): any { // eslint-disable-line
        return Apollo.mockClient.mutate<
            mockTypes.TransferConversationMessage,
            mockTypes.TransferConversationMessageVariables
        >({
            mutation: Mutations.TransferConversationMessage,
            update: (proxy, { data: mutationData }) => {
                if ((!mutationData)
                    || (!mutationData.transferConversationMessage)
                ) {
                    return;
                }
                conversationIds.forEach((id) => Apollo.updateQueryCache(
                    proxy,
                    this.getConversationMessagesQuery(id, count),
                    (data) => {
                        const msg = mutationData.transferConversationMessage
                            .find((m) => m.conversationId === id);
                        if (msg !== undefined) {
                            data.conversationMessages.messages.push(msg);
                        }
                        return data;
                    },
                ));
            },
            variables: {
                conversationIds,
                messageId: message.id,
            },
        }).then((result) => (
            !result.data?.transferConversationMessage
            ? Promise.reject('Something went wrong')
            : Promise.resolve(result.data.transferConversationMessage)
        ));
    }

    /**
     * Makes translate request.
     *
     * @param messageIds    Message IDs that will be translated.
     *
     * @return  Resolved promise.
     */
    public static translateConversationMessages(
        messageIds: string[],
    ): Promise<void> {
        return Apollo.mockClient.mutate<
            mockTypes.TranslateConversationMessages,
            mockTypes.TranslateConversationMessagesVariables
        >({
            mutation: Mutations.TranslateConversationMessages,
            variables: { messageIds },
        }).then((result) => (
            !result.data?.translateConversationMessages
            ? Promise.reject('Something went wrong')
            : Promise.resolve()
        ));
    }

    /**
     * Subscribe to new messages added into conversation.
     *
     * @param senderId       User ID of sender correspondent.
     * @param recipientId    User ID of recipient correspondent.
     * @param next           Callback function, that will be called on
     *                       subscription triggering.
     */
    public static subscribeToMessageAddedFor(
        senderId: any, // eslint-disable-line
        recipientId: any, // eslint-disable-line
        next: (data: { conversationMessageAdded: Message }) => void, // eslint-disable-line
    ): void {
        /*Apollo.subscribe(
            'conversationMessageAdded',
            Subscriptions.ConversationMessageAdded,
            next,
            { senderId, recipientId },
        );*/
    }

    /**
     * Returns ContactsByType query options.
     *
     * @param type   Contacts list type.
     *
     * @return  ContactsByType query options.
     */
    private static getContactsQuery(
        type: ContactListTypes,
    ): DataProxy.Query<unknown> {
        return {
            query: Queries.ContactsByType,
            variables: {
                type: (type === ContactListTypes.FAVOURITES)
                    ? 'favourites'
                    : 'all',
            },
        };
    }

    /**
     * Returns ConversationMessages query options.
     *
     * @param conversationId    Conversation ID.
     * @param count             Count messages to load.
     * @param lastMessageId     Last loaded message ID.
     * @param onlyPhoto         Optional, is fetched messages have to be a photo
     *                          attachments.
     * @param reverseFetch      Optional, is fetch must be reversed.
     *
     * @returns     ConversationMessages query options.
     */
    private static getConversationMessagesQuery(
        conversationId: string,
        count: number,
        lastMessageId: string = '',
        onlyPhoto?: boolean,
        reverseFetch?: boolean,
    ): {
        query: DocumentNode,
        variables: {
            conversationId: string,
            count: number,
            lastMessageId: string,
            onlyPhoto: boolean | undefined,
            reverseFetch: boolean | undefined,
        },
    } {
        return {
            query: Queries.ConversationMessages,
            variables: {
                conversationId,
                count,
                lastMessageId,
                onlyPhoto,
                reverseFetch,
            },
        };
    }
}
