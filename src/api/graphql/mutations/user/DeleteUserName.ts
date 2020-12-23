import gql from 'graphql-tag';


export default gql`
    mutation DeleteUserName {
        deleteUserName {
            user {
                name
            }
            error
        }
    }
`;
