import gql from 'graphql-tag';

export default gql`
    query ConversationMessages(
        $conversationId: ID!,
        $count: Int,
        $lastMessageId: ID,
        $onlyPhoto: Boolean,
        $reverseFetch: Boolean,
    ) {
        conversationMessages(
            conversationId: $conversationId,
            count: $count,
            lastMessageId: $lastMessageId,
            onlyPhoto: $onlyPhoto,
            reverseFetch: $reverseFetch,
        ) {
            messages {
                id
                conversationId
                mine
                text
                sentAt
                transferedFrom {
                    gapopaId
                    alias
                    photo
                }
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
            hasMore
            totalCount
        }
    }
`;
