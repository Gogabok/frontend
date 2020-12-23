import gql from 'graphql-tag';


export default gql`
    mutation ResetUserPassword(
        $new: UserPassword!,
        $token: PasswordRecoveryToken!
    ) {
        resetUserPassword(new: $new, token: $token) {
            user {
                hasPassword
            }
            error
        }
    }
`;
