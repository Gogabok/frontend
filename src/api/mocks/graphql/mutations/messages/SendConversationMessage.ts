import gql from 'graphql-tag';

export default gql`
    mutation SendConversationMessage(
        $message: MessageInput!,
        $files: [Upload!]
    ) {
        sendConversationMessage(message: $message, files: $files) {
            id
            sentAt
            status
            attachment {
                id
                type
                src
                name
                size
                error {
                    name
                    message
                }
            }
        }
    }
`;
