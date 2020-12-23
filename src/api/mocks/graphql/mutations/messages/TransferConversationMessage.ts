import gql from 'graphql-tag';

export default gql`
    mutation TransferConversationMessage(
        $messageId: ID!
        $conversationIds: [ID!]!
    ) {
        transferConversationMessage(
            messageId: $messageId
            conversationIds: $conversationIds
        ) {
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
    }
`;
