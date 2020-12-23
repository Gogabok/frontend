import gql from 'graphql-tag';

export default gql`
    mutation ChangeDefaultId($defaultId: String!, $defaultIdType: String!) {
        changeDefaultId(defaultId: $defaultId, defaultIdType: $defaultIdType) {
            reason
            result
        }
    }
`;
