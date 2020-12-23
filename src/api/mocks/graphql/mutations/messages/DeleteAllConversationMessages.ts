import gql from 'graphql-tag';

export default gql`
    mutation DeleteAllConversationMessages(
        $conversationId: ID!
        $lastMessageId: ID!
    ) {
        deleteAllConversationMessages(
            conversationId: $conversationId
            lastMessageId: $lastMessageId
        )
        refreshConversationStartDate(conversationId: $conversationId) {
            id
            messagesFrom
        }
    }
`;
