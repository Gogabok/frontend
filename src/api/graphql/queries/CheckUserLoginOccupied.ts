import gql from 'graphql-tag';


export default gql`
    query CheckUserOccupied($login: UserLogin!) {
        checkUserLoginOccupied(login: $login)
    }
`;
