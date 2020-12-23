import gql from 'graphql-tag';

export default gql`
    mutation ShareContact($conversationId: ID!, $link: String!) {
        shareContact(conversationId: $conversationId, link: $link) {
            alreadyExist
            exceedsMaxLength
            isEmpty
            link
            notValid
            success
        }
    }
`;
