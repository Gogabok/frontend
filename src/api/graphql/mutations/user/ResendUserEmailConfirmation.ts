import gql from 'graphql-tag';


export default gql`
    mutation ResendUserEmailConfirmation {
        resendUserEmailConfirmation {
            user {
                unconfirmedEmail
            }
            error
        }
    }
`;
