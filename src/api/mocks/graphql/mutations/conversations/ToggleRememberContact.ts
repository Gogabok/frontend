import gql from 'graphql-tag';

export default gql`
    mutation ToggleRememberContact($contact: ContactInput!) {
        toggleRememberContact(contact: $contact)
    }
`;
