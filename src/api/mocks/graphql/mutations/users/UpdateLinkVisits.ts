import gql from 'graphql-tag';

export default gql`
    mutation UpdateLinkVisits ($link: String!) {
        updateLinkVisits(link: $link)
    }
`;
