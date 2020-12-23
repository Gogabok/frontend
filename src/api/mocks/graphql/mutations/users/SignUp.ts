import gql from 'graphql-tag';

export default gql`
    mutation SignUp {
        signUp {
            accessToken
            expireIn
            gapopaId
        }
    }
`;
