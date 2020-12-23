import gql from 'graphql-tag';

export default gql`
    mutation RemoveContact($contact: ContactInput!) {
        removeContact(contact: $contact)
    }
`;
