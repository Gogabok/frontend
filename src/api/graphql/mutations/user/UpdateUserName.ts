import gql from 'graphql-tag';


export default gql`
    mutation UpdateUserName($name: UserName!) {
        updateUserName(name: $name) {
            name
        }
    }
`;