import gql from 'graphql-tag';

export default gql`
    query UserProfile($userId: ID!, $userPhotosLimit: Int) {
        user(userId: $userId) {
            gapopaId
            slogan
            name
            login
            photo
            status
            birth
            language
            maritalStatus
            location
            education
            job
            gender
            isFollowedByMe
            emails
            isPasswordSet
            defaultId
            defaultIdType
        }
        maritalStatuses
        languages
        userPhotos(userId: $userId, limit: $userPhotosLimit) {
            photos {
                id
                sizes {
                    smallHeight
                }
            }
            total
        }
        userLastPhoto(userId: $userId) {
            id
            sizes {
                mediumHeight
            }
        }
    }
`;
