import gql from 'graphql-tag';


export default gql`
    mutation ConfirmUserEmail($token: UserEmailConfirmationToken!) {
        confirmUserEmail(token: $token) {
            user {
                email
                unconfirmedEmail
            }
            error
        }
    }
`;
