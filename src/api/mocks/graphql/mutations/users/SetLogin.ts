import gql from 'graphql-tag';

export default gql`
    mutation SetLogin($login: String!) {
        setLogin(login: $login) {
            reason
            result
        }
    }
`;
