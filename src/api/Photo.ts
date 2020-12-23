import mockedProfileData from 'api/mocks/profile-data';


/**
 * Query result for users in profile.
 */
export interface UserPhotosInProfile extends UserPhotos {

    /**
     * Photos list.
     */
    photos: UserPhotoInProfile[];
}

/**
 * Generic user photos result query, that supports pagination and lazy loading.
 */
interface UserPhotos {

    /**
     * Part or whole list of user photos, limited by request params.
     */
    photos: any[], // eslint-disable-line

    /**
     * Total amount of user photos.
     */
    total: number;
}

/**
 * User photo in profile.
 */
export interface UserPhotoInProfile {

    /**
     * Photo ID.
     */
    id: string;

    /**
     * Describes available photo sizes.
     */
    sizes: {
        smallHeight: string,
    };
}

/**
 * Last user photo in profile.
 */
export interface LastUserPhotoInProfile {

    /**
     * Available photo sizes.
     */
    sizes: {
        mediumHeight: string,
    };
}

/**
 * Implementation of Photo API.
 */
export default class Photo {

    /**
     * Returns images for user in defined range.
     *
     * @param limit     Amount of images loaded per one time.
     * @param offset    Records offset for query in database.
     * @param userId    User ID.
     *
     * @return   Promise with user images.
     */
    public static getUserPhotosForProfile(
        userId: string, // eslint-disable-line @typescript-eslint/no-unused-vars
        offset: number, // eslint-disable-line @typescript-eslint/no-unused-vars
        limit: number, // eslint-disable-line @typescript-eslint/no-unused-vars
    ): Promise<UserPhotosInProfile> {
        // TODO mock just for prototype server
        return Promise.resolve(mockedProfileData.userPhotos);
        // return Apollo.mockClient.query<{ userPhotos: UserPhotosInProfile}>({
        //     query: Queries.UserPhotosForProfile,
        //     variables: { userId, offset, limit },
        // }).then((result) => result.data.userPhotos);
    }
}
