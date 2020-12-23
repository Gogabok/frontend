import gql from 'graphql-tag';

export default gql`
    mutation RemoveEmail($email: String!) {
        removeEmail(email: $email) {
            reason
            result
        }
    }
`;
