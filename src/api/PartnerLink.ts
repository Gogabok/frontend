import Apollo from 'plugins/Apollo';

import * as mockTypes from 'api/graphql/mock-types';

import * as Mutations from 'api/mocks/graphql/mutations';
import * as Queries from 'api/mocks/graphql/queries';


/**
 * Implementation of Partner link API.
 */
export default class PartnerLink {

    /**
     * Returns original path by ID.
     *
     * @param id    ID, that matched to original path.
     *
     * @return Resolved promise with original path.
     */
    public static getOriginalPath(id: string): Promise<string> {
        return Apollo.mockClient.query<{originalPath: string}>({
            fetchResults: true,
            query: Queries.OriginalPath,
            variables: { id },
        }).then((result) => result.data.originalPath);
    }

    /**
     * Updates quantity of visits.
     *
     * @param link    Link for which will be update quantity of visits.
     *
     * @return Resolved promise.
     */
    public static updateLinkVisits(link: string): Promise<unknown> {
        return Apollo.mockClient.mutate<
            mockTypes.UpdateLinkVisits,
            mockTypes.UpdateLinkVisitsVariables
        >({
            mutation: Mutations.UpdateLinkVisits,
            variables: { link },
        }).then((result) =>
            (!result.data || !result.data.updateLinkVisits)
                ? Promise.reject('Something went wrong')
                : Promise.resolve(result.data.updateLinkVisits));
    }
}
