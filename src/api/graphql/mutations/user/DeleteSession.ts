import gql from 'graphql-tag';


export default gql`
    mutation DeleteSession($token: AccessToken!) {
        deleteSession(token: $token)
    }
`;
