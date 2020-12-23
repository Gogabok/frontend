import gql from 'graphql-tag';

export default gql`
    mutation SetName($name: String!) {
        setName(name: $name) {
            reason
            result
        }
    }
`;
