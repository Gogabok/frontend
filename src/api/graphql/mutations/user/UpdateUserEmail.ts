import gql from 'graphql-tag';


export default gql`
    mutation UpdateUserEmail($email: UserEmail!) {
        updateUserEmail(email: $email) {
            user {
                unconfirmedEmail
            }
            error
        }
    }
`;
