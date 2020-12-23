import gql from 'graphql-tag';

export default gql`
    mutation ChangeConversationsOrder($conversations: [ConversationInput!]!) {
        changeConversationsOrder(conversations: $conversations)
    }
`;
