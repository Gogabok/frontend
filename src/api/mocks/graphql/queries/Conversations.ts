import gql from 'graphql-tag';

export default gql`
    query Conversations(
        $type: String!,
        $offset: Int,
        $limit: Int,
    ) {
        conversations(
            type: $type,
            offset: $offset,
            limit: $limit,
        ) {
            conversations {
                id
                photo
                status
                unreadCount
                isFavourite
                description
                title
                notices
                participants {
                    gapopaId
                    alias
                    name
                    login
                }
                messages {
                    id
                    conversationId
                    mine
                    text
                    sentAt
                    sender {
                        gapopaId
                        alias
                        photo
                    }
                    attachment {
                        id
                        type
                        src
                        name
                        size
                    }
                    deleted
                    deletedAt
                    deletable
                    isNotification
                    isStatus
                    status
                }
                hasMoreMessages
                messagesFrom
                photoAttachments {
                    id
                    attachment {
                        id
                        type
                        src
                        name
                        size
                    }
                }
                photoAttachmentsCount
            }
            hasMore
        }
    }
`;
