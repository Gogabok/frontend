import gql from 'graphql-tag';

export default gql`
    mutation SupportContact(
        $conversationId: ID!,
        $amount: Float!,
        $message: String!,
        $translate: Boolean!,
    ) {
        supportContact(
            conversationId: $conversationId,
            amount: $amount,
            message: $message,
            translate: $translate,
        ) {
            emptyDonation
            lessThanAllowed
            outOfFunds
            success
        }
    }
`;
