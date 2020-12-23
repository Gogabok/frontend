import gql from 'graphql-tag';


export default gql`
    mutation SignUp {
        createUser {
            user {
                id
                num
                ver
            }
            session {
                token
                expireAt
                ver
            }
        }
    }
`;
