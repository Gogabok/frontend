import gql from 'graphql-tag';


export default gql`
    mutation RecoverUserPassword($email: UserEmail!) {
        recoverUserPassword(email: $email)
    }
`;
