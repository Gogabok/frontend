import gql from 'graphql-tag';

export default gql`
    mutation DeleteConversationMessage($messageId: ID!) {
        deleteConversationMessage(messageId: $messageId)
    }
`;
