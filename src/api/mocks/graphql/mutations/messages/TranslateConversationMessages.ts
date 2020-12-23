import gql from 'graphql-tag';

export default gql`
    mutation TranslateConversationMessages($messageIds: [ID!]!) {
        translateConversationMessages(messageIds: $messageIds)
    }
`;
