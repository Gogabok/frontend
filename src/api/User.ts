import Apollo from 'plugins/Apollo';

import * as mockTypes from 'api/graphql/mock-types';
import { LastUserPhotoInProfile, UserPhotosInProfile } from 'api/Photo';
import * as Types from 'api/graphql/types';
import UserModel from 'models/old/User';
import { UserDisplayNameSetting } from 'models/old/user/MyUser';

import mockedProfileData from 'api/mocks/profile-data';
import { getRightObject } from 'utils/CustomValidations';

import * as UserMutations from 'api/graphql/mutations/user';
import * as MockMutations from 'api/mocks/graphql/mutations';
import * as Queries from 'api/graphql/queries';
import * as MockQueries from 'api/mocks/graphql/queries';


/**
 * Implementation of User API.
 */
export default class User {

    /**
     * Returns true if passed login is occupied, otherwise false.
     *
     * @param login   Login to be checked.
     */
    public static checkUserLoginOccupied(
        login: GraphQLScalars.UserLogin,
    ): Promise<boolean> {
        return Apollo.client.query<
            Types.CheckUserOccupied,
            Types.CheckUserOccupiedVariables
        >({
            query: Queries.CheckUserLoginOccupied,
            variables: { login },
        }).then((result) => result.data.checkUserLoginOccupied);
    }

    /**
     * Returns is user identifiable by passed string.
     *
     * @param userLoginIdentifier   num/email/login of user.
     */
    public static async checkUserIdentifiable(
        userLoginIdentifier: string,
    ): Promise<boolean> {
        const authVariableObject = getRightObject(userLoginIdentifier);

        if (authVariableObject === null) {
            return Promise.resolve(false);
        }
        const result = await Apollo.client.query<
            Types.CheckUserIdentifiable,
            Types.CheckUserIdentifiableVariables
        >({
            query: Queries.CheckUserIdentifiable,
            variables: authVariableObject,
        });
        return result.data.checkUserIdentifiable;
    }

    /**
     * Returns created user data and session data.
     */
    public static signUp(): Promise<Types.SignUp_createUser> {
        return Apollo.client.mutate<Types.SignUp>({
            mutation: UserMutations.SignUp,
        }).then((result) => (
            (result.data?.createUser === undefined)
                ? Promise.reject('Something went wrong')
                : result.data.createUser
        ));
    }

    /**
     * Updates `login` for the authenticated `MyUser` if
     * passed login is not occupied.
     *
     * @param login   Login to be updated.
     */
    public static async updateUserLogin(
        login: GraphQLScalars.UserLogin,
    ): Promise<Types.UpdateUserLogin_updateUserLogin | null> {
        const isLoginOccupied: boolean =
            await this.checkUserLoginOccupied(login);

        if (isLoginOccupied) {
            return null;
        }
        const result = await Apollo.client.mutate<
            Types.UpdateUserLogin,
            Types.UpdateUserLoginVariables
        >({
            mutation: UserMutations.UpdateUserLogin,
            variables: {
                login: login.trim(),
            },
        });
        return (
            (result.data?.updateUserLogin === undefined)
                ? Promise.reject('Something went wrong')
                : result.data.updateUserLogin
        );
    }

    /**
     * Updates `name` for the authenticated `MyUser`.
     *
     * @param name   Name to be changed.
     */
    public static updateUserName(
        name: GraphQLScalars.UserName,
    ): Promise<Types.UpdateUserName_updateUserName> {
        return Apollo.client.mutate<
            Types.UpdateUserName,
            Types.UpdateUserNameVariables
        >({
            mutation: UserMutations.UpdateUserName,
            variables: { name },
        }).then((result) => (
            (result.data?.updateUserName === undefined)
                ? Promise.reject('Something went wrong')
                : result.data.updateUserName
        ));
    }

    /**
     * Deletes `name` for the authenticated `MyUser`.
     */
    public static async deleteUserName(): Promise<
        Types.DeleteUserName_deleteUserName
    > {
        const mutationResult =
            await Apollo.client.mutate<
                Types.DeleteUserName
            >({
                mutation: UserMutations.DeleteUserName,
            });
        return mutationResult.data?.deleteUserName === undefined
            ? Promise.reject('Something went wrong')
            : mutationResult.data.deleteUserName;
    }

    /**
     * Signing in with userLoginIdentifier and password.
     *
     * @param userLoginIdentifier   num/email/login of user.
     * @param password              secret user's password.
     * @param remember              is need to remember user after signin.
     *
     * @returns   Resolved promise with createSession object.
     */
    public static signIn(
        userLoginIdentifier: GraphQLScalars.Num
            | GraphQLScalars.UserEmail
            | GraphQLScalars.UserLogin,
        password: GraphQLScalars.UserPassword,
        remember: boolean,
    ): Promise<Types.SignIn_createSession> {
        const authVariableObject = getRightObject(userLoginIdentifier);

        if (authVariableObject === null) {
            return Promise.reject('Something went wrong');
        }

        return Apollo.client.mutate<Types.SignIn, Types.SignInVariables>({
            mutation: UserMutations.SignIn,
            variables: {
                ...authVariableObject,
                password,
                remember,
            },
        }).then((result) => (
            (result.data?.createSession === undefined)
                ? Promise.reject('Something went wrong')
                : result.data.createSession
        ));
    }

    /**
     * Handles session renewal by remember token.
     *
     * @param rememberToken   Token of remembered user session.
     */
    public static renewSession(
        rememberToken: string,
    ): Promise<Types.RenewSession_renewSession> {
        return Apollo.client.mutate<
            Types.RenewSession,
            Types.RenewSessionVariables
        >({
            mutation: UserMutations.RenewSession,
            variables: {
                token: rememberToken,
            },
        }).then((result) => (
            (result.data?.renewSession === undefined)
                ? Promise.reject('Something went wrong')
                : result.data.renewSession
        ));
    }

    /**
     * Updates password for the authenticated `MyUser`.
     *
     * @param newPassword   Password to update `MyUser` with.
     * @param oldPassword   Current password of `MyUser` for mutation
     *                      authentication.
     */
    public static async updateUserPassword(
        newPassword: GraphQLScalars.UserPassword,
        oldPassword?: GraphQLScalars.UserPassword,
    ): Promise<Types.UpdateUserPassword_updateUserPassword> {
        const mutationResult =
            await Apollo.client.mutate<
                Types.UpdateUserPassword,
                Types.UpdateUserPasswordVariables
            >({
                mutation: UserMutations.UpdateUserPassword,
                variables: {
                    new: newPassword,
                    old: oldPassword,
                },
            });

        return mutationResult.data?.updateUserPassword === undefined
            ? Promise.reject('Something went wrong')
            : mutationResult.data.updateUserPassword;
    }

    /**
     * Initiates password recovery for an authenticated user
     * identified by the provided `email`.
     *
     * @param email    Email address to send password recovery link to.
     */
    public static async recoverUserPassword(
        email: GraphQLScalars.UserEmail,
    ): Promise<boolean> {
        const mutationResult =
            await Apollo.client.mutate<
                Types.RecoverUserPassword,
                Types.RecoverUserPasswordVariables
            >({
                mutation: UserMutations.RecoverUserPassword,
                variables: { email },
            });

        return mutationResult.data?.recoverUserPassword === undefined
            ? Promise.reject('Something went wrong')
            : mutationResult.data.recoverUserPassword;
    }

    /**
     * Resets password for the `MyUser` authenticated by the provided
     * PasswordRecoveryToken`.
     *
     * @param newPassword   New password.
     * @param token         Password recovery token.
     */
    public static async resetUserPassword(
        newPassword: GraphQLScalars.UserPassword,
        token: GraphQLScalars.PasswordRecoveryToken,
    ): Promise<Types.ResetUserPassword_resetUserPassword> {
        const mutationResult =
            await Apollo.client.mutate<
                Types.ResetUserPassword,
                Types.ResetUserPasswordVariables
            >({
                mutation: UserMutations.ResetUserPassword,
                variables: {
                    new: newPassword,
                    token,
                },
            });

        return mutationResult.data?.resetUserPassword === undefined
            ? Promise.reject('Something went wrong')
            : mutationResult.data.resetUserPassword;
    }

     /**
     * Finishes `email` address updating for the `MyUser` identified by
     * the provided confirmation `token`.
     *
     * @param token   Confirmation token for `MyUser`
     *                identification and mutation authentication.
     */
    public static async confirmUserEmail(
        token: GraphQLScalars.UserEmailConfirmationToken,
    ): Promise<Types.ConfirmUserEmail_confirmUserEmail> {
        const mutationResult =
            await Apollo.client.mutate<
                Types.ConfirmUserEmail,
                Types.ConfirmUserEmailVariables
            >({
                mutation: UserMutations.ConfirmUserEmail,
                variables: { token },
            });

        return mutationResult.data?.confirmUserEmail === undefined
            ? Promise.reject('Something went wrong')
            : mutationResult.data?.confirmUserEmail;
    }

    /**
     * Initiates `email` address updating for the authenticated `MyUser`.
     *
     * @param email   Email to be updated.
     */
    public static async updateUserEmail(
        email: GraphQLScalars.UserEmail,
    ): Promise<Types.UpdateUserEmail_updateUserEmail> {
        const mutationResult =
            await Apollo.client.mutate<
                Types.UpdateUserEmail,
                Types.UpdateUserEmailVariables
            >({
                mutation: UserMutations.UpdateUserEmail,
                variables: {
                    email: email.trim(),
                },
            });

        return mutationResult.data?.updateUserEmail === undefined
            ? Promise.reject('Something went wrong')
            : mutationResult.data?.updateUserEmail;
    }

    /**
     * Sends to `MyUser.unconfirmedEmail` address an email message with a new
     * confirmation link.
     */
    public static async resendUserEmailConfirmation(): Promise<
        Types.ResendUserEmailConfirmation_resendUserEmailConfirmation
    > {
        const mutationResult =
            await Apollo.client.mutate<
                Types.ResendUserEmailConfirmation
            >({
                mutation: UserMutations.ResendUserEmailConfirmation,
            });

        return mutationResult.data?.resendUserEmailConfirmation === undefined
            ? Promise.reject('Something went wrong')
            : mutationResult.data?.resendUserEmailConfirmation;
    }

    /**
     * Removes current `unconfirmedEmail` for the authenticated `MyUser`.
     */
    public static async deleteUnconfirmedEmail(): Promise<
        Types.DeleteUnconfirmedEmail_deleteUnconfirmedEmail
    > {
        const mutationResult =
            await Apollo.client.mutate<
                Types.DeleteUnconfirmedEmail
            >({
                mutation: UserMutations.DeleteUnconfirmedEmail,
            });

        return mutationResult.data?.deleteUnconfirmedEmail === undefined
            ? Promise.reject('Something went wrong')
            : mutationResult.data.deleteUnconfirmedEmail;
    }

    /**
     * Changes `displayNameSetting` of authorized user.
     *
     * @param setting     Type of setting for displaying MyUser's name.
     *
     * @return    Resolved promise with `updateUserDisplayName` result.
     */
    public static async updateUserDisplayName(
        setting: UserDisplayNameSetting,
    ): Promise<Types.UpdateUserDisplayName_updateUserDisplayName> {
        const mutationResult =
            await Apollo.client.mutate<
                Types.UpdateUserDisplayName,
                Types.UpdateUserDisplayNameVariables
            >({
                mutation: UserMutations.UpdateUserDisplayName,
                variables: { setting },
            });

        return mutationResult.data?.updateUserDisplayName === undefined
            ? Promise.reject('Something went wrong')
            : Promise.resolve(mutationResult.data.updateUserDisplayName);
    }

    /**
     * Deletes `Session` of `MyUser` by the given `AccessToken`.
     *
     * @param token   User's AccessToken.
     */
    public static async deleteSession(
        token: GraphQLScalars.AccessToken,
    ): Promise<boolean> {
        const mutationResult =
            await Apollo.client.mutate<
                Types.DeleteSession,
                Types.DeleteSessionVariables
            >({
                mutation: UserMutations.DeleteSession,
                variables: { token },
            });
        return mutationResult.data?.deleteSession === undefined
            ? Promise.reject('Something went wrong')
            : Promise.resolve(mutationResult.data.deleteSession);
    }

    /**
     * =========================================================================
     * ===================== Mock API requests below: ==========================
     * =========================================================================
     */

    /**
     * Follows or un-follows specified follower from target user.
     *
     * @param follower      Follower user.
     * @param targetUser    Target user.
     * @param isFollow      Flag, that specifies if this is following
     *                      or un-following process.
     *
     * @return   Resolved Promise with updated target user.
     */
    public static follow(
        follower: UserModel,
        targetUser: UserModel,
        isFollow: boolean,
    ): Promise<unknown> {
        return Apollo.mockClient.mutate<
            mockTypes.FollowUser,
            mockTypes.FollowUserVariables
        >({
            mutation: MockMutations.FollowUser,
            variables: {
                followerUserId: follower.num,
                isFollow,
                targetUserId: targetUser.num,
            },
        }).then((result) => (!result.data || !result.data.followUser)
            ? Promise.reject('Something went wrong')
            : Promise.resolve(result.data.followUser));
    }

    /**
     * Returns user with available marital statuses and languages.
     *
     * @param id      ID of user.
     * @param limit   Amount of user images, that will be load.
     *
     * @return   Promise with user profile.
     */
    public static getProfileData(
        id: string, // eslint-disable-line @typescript-eslint/no-unused-vars
        limit: number, // eslint-disable-line @typescript-eslint/no-unused-vars
    ): Promise<ProfileData> {
        // TODO mock just for prototype server
        return Promise.resolve(mockedProfileData);
        // return Apollo.mockClient.query<ProfileData>({
        //     fetchResults: true,
        //     query: MockQueries.UserProfile,
        //     variables: { userId: id, userPhotosLimit: limit },
        // }).then((result) => result.data);
    }

    /**
     * Authenticate user by passed login and password.
     *
     * @param login      User login.
     * @param password   User password.
     *
     * @return   Resolved promise with auth data.
     */
    public static auth(
        login: string,
        password: string,
    ): Promise<mockTypes.Auth_auth> {
        login = login.replace(new RegExp('^&'), '');
        return Apollo.mockClient.query<
            mockTypes.Auth,
            mockTypes.AuthVariables
        >({
            fetchResults: true,
            query: MockQueries.Auth,
            variables: { login, password },
        }).then((result) => result.data.auth);
    }

    /**
     * Check available access token.
     *
     * @param accessToken   Authorization access token.
     *
     * @return   Resolved promise with auth data.
     */
    public static checkAuth(accessToken: string): Promise<mockTypes.Auth_auth> {
        return Apollo.mockClient.query<
            mockTypes.Auth,
            mockTypes.AuthVariables
        >({
            fetchResults: true,
            query: MockQueries.Auth,
            variables: { accessToken },
        }).then((result) => result.data.auth);
    }

    /**
     * Check available user login.
     *
     * @param login    User login to check.
     *
     * @return   Resolved promise with result.
     */
    public static checkLogin(login: string): Promise<
        mockTypes.CheckLogin_checkLogin
    > {
        login = login.replace(new RegExp('^&'), '');
        return Apollo.mockClient.query<
            mockTypes.CheckLogin,
            mockTypes.CheckLoginVariables
        >({
            fetchResults: true,
            query: MockQueries.CheckLogin,
            variables: { login },
        }).then((result) => result.data.checkLogin);
    }

    /**
     * Logout authorized user.
     */
    public static logout(): Promise<boolean> {
        return Apollo.mockClient.query<mockTypes.Logout>({
            fetchResults: true,
            query: MockQueries.Logout,
        }).then((result) => result.data.logout);
    }

    /**
     * Restore user password.
     *
     * @param login    User login to restore password.
     *
     * @return   Resolved promise with result.
     */
    public static restorePassword(login: string): Promise<
        mockTypes.RestorePassword_restorePassword
    > {
        login = login.replace(new RegExp('^&'), '');
        return Apollo.mockClient.mutate<
            mockTypes.RestorePassword,
            mockTypes.RestorePasswordVariables
        >({
            mutation: MockMutations.RestorePassword,
            variables: { login },
        }).then((result) => (!result.data || !result.data.restorePassword)
            ? Promise.reject('Something went wrong')
            : Promise.resolve(result.data.restorePassword));
    }

    /**
     * Set email for user account.
     *
     * @return   Resolved promise with result.
     */
    public static setEmail(
        email: string,
    ): Promise<mockTypes.SetEmail_setEmail> {
        return Apollo.mockClient.mutate<
            mockTypes.SetEmail,
            mockTypes.SetEmailVariables
        >({
            mutation: MockMutations.SetEmail,
            variables: { email },
        })
            .then((result) => (
                !result.data?.setEmail
                    ? Promise.reject('Something went wrong')
                    : Promise.resolve(result.data.setEmail)
            ));
    }

    /**
     * Remove email from user account.
     *
     * @return   Resolved promise with result.
     */
    public static removeEmail(
        email: string,
    ): Promise<mockTypes.RemoveEmail_removeEmail> {
        return Apollo.mockClient.mutate<
            mockTypes.RemoveEmail,
            mockTypes.RemoveEmailVariables
        >({
            mutation: MockMutations.RemoveEmail,
            variables: { email },
        })
            .then((result) => (
                !result.data?.removeEmail
                    ? Promise.reject('Something went wrong')
                    : Promise.resolve(result.data.removeEmail)
            ));
    }

    /**
     * Set name for user account.
     *
     * @return   Resolved promise with result.
     */
    public static setName(name: string): Promise<
        mockTypes.SetName_setName
    > {
        return Apollo.mockClient.mutate<
            mockTypes.SetName,
            mockTypes.SetNameVariables
        >({
            mutation: MockMutations.SetName,
            variables: { name },
        })
            .then((result) => (
                !result.data?.setName
                    ? Promise.reject('Something went wrong')
                    : Promise.resolve(result.data.setName)
            ));
    }

    /**
     * Sets passed string as login.
     *
     * @param login    String to set as login.
     *
     * @return    Resolved promise with set login result.
     */
    public static setLogin(
        login: string,
    ): Promise<mockTypes.SetLogin_setLogin> {
        return Apollo.mockClient.mutate<
            mockTypes.SetLogin,
            mockTypes.SetLoginVariables
        >({
            mutation: MockMutations.SetLogin,
            variables: { login },
        }).then((result) => (
            !result.data?.setLogin
            ? Promise.reject('Something went wrong')
            : Promise.resolve(result.data.setLogin)
        ));
    }

    /**
     * Sets passed file image as avatar.
     *
     * @param avatar    Image to set as avatar.
     *
     * @return    Resolved promise with set avatar result.
     */
    public static setAvatar(
        avatar: Blob,
    ): Promise<mockTypes.SetAvatar_setAvatar> {
        return Apollo.mockClient.mutate<
            mockTypes.SetAvatar,
            mockTypes.SetAvatarVariables
        >({
            mutation: MockMutations.SetAvatar,
            variables: { avatar },
        }).then((result) => (
            !result.data?.setAvatar
            ? Promise.reject('Something went wrong')
            : Promise.resolve(result.data.setAvatar)
        ));
    }

    /**
     * Sets passed string as password.
     *
     * @param password    String to set as password.
     *
     * @return    Resolved promise with set password result.
     */
    public static setPassword(
        password: string,
    ): Promise<mockTypes.SetPassword_setPassword> {
        return Apollo.mockClient.mutate<
            mockTypes.SetPassword,
            mockTypes.SetPasswordVariables
        >({
            mutation: MockMutations.SetPassword,
            variables: { password },
        }).then((result) => (
            !result.data?.setPassword
            ? Promise.reject('Something went wrong')
            : Promise.resolve(result.data.setPassword)
        ));
    }

    /**
     * Replaces passed string as password.
     *
     * @param oldPassword Old password string.
     * @param password    String to replace password.
     *
     * @return    Resolved promise with replace password result.
     */
    public static replacePassword(
        oldPassword: string,
        password: string,
    ): Promise<mockTypes.ReplacePassword_replacePassword> {
        return Apollo.mockClient.mutate<
            mockTypes.ReplacePassword,
            mockTypes.ReplacePasswordVariables
        >({
            mutation: MockMutations.ReplacePassword,
            variables: { oldPassword, password },
        }).then((result) => (
            !result.data?.replacePassword
            ? Promise.reject('Something went wrong')
            : Promise.resolve(result.data.replacePassword)
        ));
    }

    /**
     * Changes Default ID of authorized user.
     *
     * @param defaultId     New Default ID.
     * @param defaultIdType Type of the Default ID.
     *
     * @return    Resolved promise with change Default ID result.
     */
    public static changeDefaultId(
        defaultId: string,
        defaultIdType: string,
    ): Promise<mockTypes.ChangeDefaultId_changeDefaultId> {
        return Apollo.mockClient.mutate<
            mockTypes.ChangeDefaultId,
            mockTypes.ChangeDefaultIdVariables
        >({
            mutation: MockMutations.ChangeDefaultId,
            variables: {
                defaultId,
                defaultIdType,
            },
        }).then((result) => (
            !result.data?.changeDefaultId
            ? Promise.reject('Something went wrong')
            : Promise.resolve(result.data.changeDefaultId)
        ));
    }

    /**
     * Updates user data.
     *
     * @param user   User that will be updated.
     *
     * @return   Resolved promise.
     */
    public static updateUserData(user: UserModel): Promise<void> {
        return Apollo.mockClient.mutate<
            mockTypes.UpdateUserData,
            mockTypes.UpdateUserDataVariables
        >({
            mutation: MockMutations.UpdateUserData,
            variables: {
                user: {
                    birth: user.birth,
                    education: user.education,
                    gender: user.gender,
                    job: user.job,
                    language: user.language,
                    location: user.location,
                    login: user.login,
                    maritalStatus: user.maritalStatus,
                    name: user.name,
                    num: user.num,
                    photo: user.photo,
                    slogan: user.slogan,
                    status: user.status,
                },
            },
        }).then((result) => {
            return (!result.data || !result.data.updateUserData
                ? Promise.reject('Something went wrong')
                : Promise.resolve());
        });
    }
}

/**
 * User following mutation result.
 */
export interface FollowedUser {

    /**
     * Unique user ID.
     */
    id: string;

    /**
     * Flag, that specifies if user is currently followed by authorized user.
     */
    isFollowedByMe: boolean;

    /**
     * Number of user followers.
     */
    followers: number;
}

/**
 * Describes user profile data, required for rendering profile page.
 */
export interface ProfileData {

    /**
     * Application user.
     */
    user: UserModel;

    /**
     * List of available marital statuses for user.
     */
    maritalStatuses: string[];

    /**
     * List of available languages for user.
     */
    languages: string[];

    /**
     * Photo amount.
     */
    // photoAmount: number;

    /**
     * First part of user photos limited by query.
     */
    userPhotos: UserPhotosInProfile;

    /**
     * User last photo in bigger resolution.
     */
    userLastPhoto: LastUserPhotoInProfile;
}
