import gql from 'graphql-tag';

export default gql`
    query UserPhotosForProfile($userId: ID!, $offset: Int, $limit: Int) {
        userPhotos(userId: $userId, offset: $offset, limit: $limit) {
            photos {
                id
                sizes {
                    smallHeight
                }
            }
        }
    }
`;
