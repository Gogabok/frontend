import { Apollo as ApolloType } from 'types/apollo';

const Apollo = TNS_ENV
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    ? require('./apollo/ns/Apollo').default
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    : require('./apollo/web/Apollo').default;

export default (Apollo as ApolloType);
