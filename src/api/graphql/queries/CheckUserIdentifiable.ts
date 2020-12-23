import gql from 'graphql-tag';


export default gql`
    query CheckUserIdentifiable(
        $num: Num,
        $login: UserLogin,
        $email: UserEmail
    ) {
        checkUserIdentifiable(
            num: $num,
            email: $email,
            login: $login
        )
    }
`;
