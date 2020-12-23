import gql from 'graphql-tag';

export default gql`
    mutation FollowUser(
        $followerUserId: ID!
        $targetUserId: ID!
        $isFollow: Boolean!
    ) {
        followUser(
            followerUserId: $followerUserId
            targetUserId: $targetUserId
            isFollow: $isFollow
        ) {
            gapopaId
            isFollowedByMe
            followers
        }
    }
`;
