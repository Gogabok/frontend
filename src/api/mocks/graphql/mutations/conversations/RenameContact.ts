import gql from 'graphql-tag';

export default gql`
    mutation RenameContact($contact: ContactRenameInput!) {
        renameContact(contact: $contact)
    }
`;
