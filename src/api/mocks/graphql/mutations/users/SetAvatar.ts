import gql from 'graphql-tag';

export default gql`
    mutation SetAvatar($avatar: Upload!) {
        setAvatar(avatar: $avatar) {
            reason
            result
            src
        }
    }
`;
