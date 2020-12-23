import gql from 'graphql-tag';

export default gql`
    mutation UnblockContact($contact: ContactInput!) {
        unblockContact(contact: $contact)
    }
`;
