import gql from 'graphql-tag';


export default gql`
    mutation RenewSession($token: RememberToken!) {
        renewSession(token: $token) {
            remembered {
                expireAt
                token
                ver
            }
            session {
                expireAt
                token
                ver
            }
            user {
                displayNameSetting
                email
                hasPassword
                id
                login
                name
                num
                unconfirmedEmail
                ver
            }
            error
        }
    }
`;
