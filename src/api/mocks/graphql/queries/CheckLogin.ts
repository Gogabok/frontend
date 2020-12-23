import gql from 'graphql-tag';

export default gql`
    query CheckLogin($login: String!) {
        checkLogin(login: $login) {
            result
            reason
        }
    }
`;
