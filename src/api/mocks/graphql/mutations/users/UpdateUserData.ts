import gql from 'graphql-tag';

export default gql`
    mutation UpdateUserData($user: UserInput!) {
        updateUserData(user: $user)
    }
`;
