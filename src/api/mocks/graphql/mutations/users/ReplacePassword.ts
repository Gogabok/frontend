import gql from 'graphql-tag';

export default gql`
    mutation ReplacePassword($oldPassword: String!, $password: String!) {
        replacePassword(oldPassword: $oldPassword, password: $password) {
            reason
            result
        }
    }
`;
