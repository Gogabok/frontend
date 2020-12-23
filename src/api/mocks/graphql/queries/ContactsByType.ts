import gql from 'graphql-tag';

export default gql`
    query ContactsByType($type: String!) {
        contacts(type: $type) {
            gapopaId
            login
            name
            alias
            photo
            status
            unreadCount
            isRequested
            isNew
            isFavourite
            isBlockedByMe
            isMeBlocked
        }
    }
`;
