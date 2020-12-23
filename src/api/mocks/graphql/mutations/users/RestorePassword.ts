import gql from 'graphql-tag';

export default gql`
    mutation RestorePassword($login: String!) {
        restorePassword(login: $login) {
            result
            feedbackType
            reason
        }
    }
`;
