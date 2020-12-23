import gql from 'graphql-tag';

export default gql`
    mutation SetPassword($password: String!) {
        setPassword(password: $password) {
            reason
            result
        }
    }
`;
