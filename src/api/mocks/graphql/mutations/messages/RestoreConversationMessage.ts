import gql from 'graphql-tag';

export default gql`
    mutation RestoreConversationMessage($messageId: ID!) {
        restoreConversationMessage(messageId: $messageId)
    }
`;
