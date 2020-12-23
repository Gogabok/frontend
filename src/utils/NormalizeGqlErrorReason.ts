/**
 * Normalizes gql error type to correct dictionary field description.
 *
 * For example:
 * `normalizeGqlErrorReason('WRONG_TOKEN') --> 'wrong-token'`
 *
 * @param source   Source gql error. For example: `WRONG_TOKEN`.
 */
export const normalizeGqlErrorReason = (source: string): string => {
    return source.toLowerCase().replace(/_/g, '-');
};
