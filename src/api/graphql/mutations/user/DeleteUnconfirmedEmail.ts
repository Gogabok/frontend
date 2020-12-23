import gql from 'graphql-tag';


export default gql`
    mutation DeleteUnconfirmedEmail {
        deleteUnconfirmedEmail {
            unconfirmedEmail
        }
    }
`;
