import gql from 'graphql-tag';

export default gql`
    mutation SetEmail($email: String!) {
        setEmail(email: $email) {
            reason
            result
        }
    }
`;
