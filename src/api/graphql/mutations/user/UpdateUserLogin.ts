import gql from 'graphql-tag';


export default gql`
    mutation UpdateUserLogin($login: UserLogin!) {
        updateUserLogin(login: $login) {
            error
        }
    }
`;