import gql from 'graphql-tag';

export default gql`
    query OriginalPath($id: ID!) {
        originalPath(id: $id)
    }
`;
