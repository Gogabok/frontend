import gql from 'graphql-tag';


export default gql`
    mutation SignIn(
        $email: UserEmail,
        $login: UserLogin,
        $num: Num,
        $password: UserPassword!,
        $remember: Boolean!,
    ) {
        createSession(
            email: $email,
            login: $login,
            num: $num,
            password: $password,
            remember: $remember,
        ) {
            error
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
                email
                hasPassword
                id
                login
                name
                num
                unconfirmedEmail
                ver
            }
        }
    }
`;
