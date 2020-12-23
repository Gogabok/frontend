import gql from 'graphql-tag';

export default gql`
    mutation ChangeUserSlogan($slogan: String!, $translate: Boolean!) {
        changeUserSlogan(slogan: $slogan, translate: $translate)
    }
`;
