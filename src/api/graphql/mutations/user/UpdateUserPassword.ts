import gql from 'graphql-tag';


export default gql`
    mutation UpdateUserPassword(
        $new: UserPassword!,
        $old: UserPassword
    ) {
        updateUserPassword(new: $new, old: $old){
            user {
                hasPassword
            }
            error
        }
    }
`;
