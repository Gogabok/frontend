import gql from 'graphql-tag';


export default gql`
    mutation UpdateUserDisplayName($setting: UserDisplayNameSetting!) {
        updateUserDisplayName(setting: $setting) {
            user {
                displayNameSetting
            }
            error
        }
    }
`;
