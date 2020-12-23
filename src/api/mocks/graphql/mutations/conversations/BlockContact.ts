import gql from 'graphql-tag';

export default gql`
    mutation BlockContact($contact: ContactInput!) {
        blockContact(contact: $contact)
    }
`;
