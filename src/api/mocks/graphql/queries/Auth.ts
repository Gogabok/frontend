import gql from 'graphql-tag';

export default gql`
    query Auth($login: String, $password: String, $accessToken: String) {
        auth(login: $login, password: $password, accessToken: $accessToken) {
            authMessage
            accessToken
            expireIn
            user {
                gapopaId
                login
                name
                photo
                status
                slogan
                funds
                emails
                isPasswordSet
                defaultId
                defaultIdType
            }
        }
    }
`;
