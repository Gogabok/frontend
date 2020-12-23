import gql from 'graphql-tag';

export default gql`
    mutation RestoreAllConversationMessages($conversationId: ID!) {
        restoreAllConversationMessages(conversationId: $conversationId)
        refreshConversationStartDate(conversationId: $conversationId) {
            id
            messagesFrom
        }
    }
`;
