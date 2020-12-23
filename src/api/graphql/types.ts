/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ConfirmUserEmail
// ====================================================

export interface ConfirmUserEmail_confirmUserEmail_user {
  __typename: "MyUser";
  /**
   * Email address of this `MyUser`.
   *
   * `email` allows `MyUser` to perform sign-in, when combined with password.
   *
   * `email` allows `MyUser` to recover his password.
   *
   * `MyUser` may choose `email` to be his `User.displayName`, but in general
   * `email` is not intended to be a public information.
   */
  email: GraphQLScalars.UserEmail | null;
  /**
   * Newly set email address of this `MyUser` that requires confirmation.
   *
   * It doesn't provide any `email` related capabilities. Once confirmed it becomes
   * a `MyUser.email` field unlocking the expected capabilities.
   */
  unconfirmedEmail: GraphQLScalars.UserEmail | null;
}

export interface ConfirmUserEmail_confirmUserEmail {
  __typename: "ConfirmUserEmailResult";
  /**
   * `MyUser` with `email` and `unconfirmedEmail` fields being updated.
   *
   * `null` if mutation failed.
   */
  user: ConfirmUserEmail_confirmUserEmail_user | null;
  /**
   * Error of confirming `MyUser`'s email address.
   *
   * `null` if mutation succeeded.
   */
  error: ConfirmUserEmailError | null;
}

export interface ConfirmUserEmail {
  /**
   * Finishes `email` address updating for the `MyUser` identified by the provided confirmation `token`.
   *
   * Sets `MyUser.unconfirmedEmail` as `MyUser.email` if the provided confirmation `token` authenticates successfully.
   *
   * Authentication: no
   *
   * Idempotent:
   * Succeeds as no-op if an email address associated with the provided confirmation `token` is set as `MyUser.email` already.
   *
   * Result:
   * It's guaranteed that either returned `user` or `error` is not `null`.
   */
  confirmUserEmail: ConfirmUserEmail_confirmUserEmail;
}

export interface ConfirmUserEmailVariables {
  token: GraphQLScalars.UserEmailConfirmationToken;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteSession
// ====================================================

export interface DeleteSession {
  /**
   * Deletes `Session` of `MyUser` by the given `AccessToken`.
   *
   * Authentication: mandatory
   *
   * Idempotent:
   * Succeeds as no-op if `Session` with the given `AccessToken` is already
   *     deleted.
   *
   *
   * Result:
   * Always returns `true`, never returns `false`.
   */
  deleteSession: boolean;
}

export interface DeleteSessionVariables {
  token: GraphQLScalars.AccessToken;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteUnconfirmedEmail
// ====================================================

export interface DeleteUnconfirmedEmail_deleteUnconfirmedEmail {
  __typename: "MyUser";
  /**
   * Newly set email address of this `MyUser` that requires confirmation.
   *
   * It doesn't provide any `email` related capabilities. Once confirmed it becomes
   * a `MyUser.email` field unlocking the expected capabilities.
   */
  unconfirmedEmail: GraphQLScalars.UserEmail | null;
}

export interface DeleteUnconfirmedEmail {
  /**
   * Removes current `unconfirmedEmail` for the authenticated `MyUser` if any.
   *
   * Authentication: mandatory
   *
   * Idempotent:
   * Succeeds as no-op if the `unconfirmedEmail` address is `null` already.
   */
  deleteUnconfirmedEmail: DeleteUnconfirmedEmail_deleteUnconfirmedEmail;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteUserName
// ====================================================

export interface DeleteUserName_deleteUserName_user {
  __typename: "MyUser";
  /**
   * Name of this `MyUser`.
   *
   * `name` of `MyUser` is not unique and is intended for displaying `MyUser` in a
   * well-readable form. It can be either first name, or last name of `MyUser`,
   * both of them, or even some nickname.
   *
   * `MyUser` may choose `name` to be his `User.displayName`
   */
  name: GraphQLScalars.UserName | null;
}

export interface DeleteUserName_deleteUserName {
  __typename: "DeleteUserNameResult";
  /**
   * `MyUser` with `name` field being deleted.
   *
   * `null` if mutation failed.
   */
  user: DeleteUserName_deleteUserName_user | null;
  /**
   * Error of deleting `MyUser`'s name.
   *
   * `null` if mutation succeeded.
   */
  error: DeleteUserNameError | null;
}

export interface DeleteUserName {
  /**
   * Deletes `MyUser.name` for the authenticated `MyUser`.
   *
   * Authentication: mandatory
   *
   * Idempotent:
   * Succeeds as no-op if `MyUser` has no `name` already.
   *
   * Result:
   * It's guaranteed that either returned `user` or `error` is not `null`.
   */
  deleteUserName: DeleteUserName_deleteUserName;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RecoverUserPassword
// ====================================================

export interface RecoverUserPassword {
  /**
   * Initiates password recovery for a `MyUser` identified by the provided `email`.
   *
   *
   * Sends to this `email` address an email message with a password recovery link.
   * Once `User` follows this link, he is able to reset his password to a new one.
   *
   * If `MyUser` has no password yet, then this mutation still may be used for recovering his sign-in capability.
   *
   * Authentication: no
   *
   * Non-idempotent:
   * Each time sends a new unique password recovery link.
   *
   * Result:
   * Returns `true` if `User` with the provided `email` exists and the link was sent, otherwise `false`.
   */
  recoverUserPassword: boolean;
}

export interface RecoverUserPasswordVariables {
  email: GraphQLScalars.UserEmail;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RenewSession
// ====================================================

export interface RenewSession_renewSession_remembered {
  __typename: "RememberedSession";
  /**
   * Datetime of this `RememberedSession` expiration in [RFC 3339] format. Once
   * expired it's not usable anymore and a new `RememberedSession` should be
   * created via `Mutations.createSession`.
   *
   * Client applications are supposed to use this field for tracking
   * `RememberedSession`'s expiration and sign out `User`s properly.
   *
   * [RFC 3339]: https: // tools.ietf.org/html/rfc3339#section-5.8
   */
  expireAt: GraphQLScalars.DateTimeUtc;
  /**
   * Unique remember token of this `RememberedSession`.
   *
   * This one should be used for `Session` renewal via `Mutations.renewSession` and
   * is NOT usable as a Bearer Authentication token.
   */
  token: GraphQLScalars.RememberToken;
  /**
   * Version of this `RememberedSession`'s state.
   *
   * It increases monotonically, so may be used (and is intended) for tracking state's actuality.
   */
  ver: GraphQLScalars.Version;
}

export interface RenewSession_renewSession_session {
  __typename: "Session";
  /**
   * Datetime of this `Session` expiration in [RFC 3339] format. Once expired it's
   * not usable anymore and a new `Session` should be created via
   * `Mutations.createSession` or `Mutations.renewSession`.
   *
   * Client applications are supposed to use this field for tracking `Session`'s
   * expiration and renewing it before authentication errors occur.
   *
   * [RFC 3339]: https: // tools.ietf.org/html/rfc3339#section-5.8
   */
  expireAt: GraphQLScalars.DateTimeUtc;
  /**
   * Unique authentication token of this `Session`.
   *
   * This one should be used as a Bearer Authentication token.
   */
  token: GraphQLScalars.AccessToken;
  /**
   * Version of this `Session`'s state.
   *
   * It increases monotonically, so may be used (and is intended) for tracking state's actuality.
   */
  ver: GraphQLScalars.Version;
}

export interface RenewSession_renewSession_user {
  __typename: "MyUser";
  /**
   * Setting of how this `MyUser`'s name is displayed in client applications (via `User.displayName`).
   *
   * `MyUser` can choose to display his name in client applications either as
   * `MyUser.name`, `MyUser.num`, `MyUser.login` or `MyUser.email`.
   *
   * Default is `MyUser.num`.
   */
  displayNameSetting: UserDisplayNameSetting;
  /**
   * Email address of this `MyUser`.
   *
   * `email` allows `MyUser` to perform sign-in, when combined with password.
   *
   * `email` allows `MyUser` to recover his password.
   *
   * `MyUser` may choose `email` to be his `User.displayName`, but in general
   * `email` is not intended to be a public information.
   */
  email: GraphQLScalars.UserEmail | null;
  /**
   * Indicator that this `MyUser` has password.
   *
   * Password allows `MyUser` to perform sign-in, when combined with `login`, `email` or `num`.
   */
  hasPassword: boolean;
  /**
   * Unique ID of this `MyUser`.
   *
   * Once assigned it never changes.
   */
  id: GraphQLScalars.UserId;
  /**
   * Unique login of this `MyUser`.
   *
   * `login` allows `MyUser` to perform sign-in, when combined with password.
   *
   * `MyUser` may choose `login` to be his `User.displayName`, but in general
   * `login` is not intended to be a public information.
   */
  login: GraphQLScalars.UserLogin | null;
  /**
   * Name of this `MyUser`.
   *
   * `name` of `MyUser` is not unique and is intended for displaying `MyUser` in a
   * well-readable form. It can be either first name, or last name of `MyUser`,
   * both of them, or even some nickname.
   *
   * `MyUser` may choose `name` to be his `User.displayName`
   */
  name: GraphQLScalars.UserName | null;
  /**
   * Unique number of this `MyUser`.
   *
   * `num` is intended for easier `MyUser` identification by other `User`s. It's just like a telephone number in a real life.
   *
   *
   * `num` allows `MyUser` to perform sign-in, when combined with password.
   *
   * It may be reused by another `User` in future, once this `MyUser` becomes
   * unreachable (sign-in for this `MyUser` is impossible).
   */
  num: GraphQLScalars.Num;
  /**
   * Newly set email address of this `MyUser` that requires confirmation.
   *
   * It doesn't provide any `email` related capabilities. Once confirmed it becomes
   * a `MyUser.email` field unlocking the expected capabilities.
   */
  unconfirmedEmail: GraphQLScalars.UserEmail | null;
  /**
   * Version of this `User`'s state.
   *
   * It increases monotonically, so may be used (and is intended) for tracking state's actuality.
   */
  ver: GraphQLScalars.Version;
}

export interface RenewSession_renewSession {
  __typename: "RenewSessionResult";
  /**
   * Renewed `RememberedSession`.
   *
   * `null` if mutation failed.
   */
  remembered: RenewSession_renewSession_remembered | null;
  /**
   * Renewed `Session`.
   *
   * It will expire in 24 hours after creation.
   *
   * `null` if mutation failed.
   */
  session: RenewSession_renewSession_session | null;
  /**
   * `MyUser` that `Session` was renewed for.
   *
   * `null` if mutation failed.
   */
  user: RenewSession_renewSession_user | null;
  /**
   * Error of renewing `Session`.
   *
   * `null` if mutation succeeded.
   */
  error: RenewSessionError | null;
}

export interface RenewSession {
  /**
   * Renews `Session` of `MyUser` by the given `RememberToken`. Invalidates the
   * provided `RememberToken` and returns a new one, which should be used instead.
   *
   *
   * Authentication: no
   *
   * Non-idempotent:
   * Each time creates a new `Session` and generates new `RememberToken`.
   *
   *
   * Result:
   * It's guaranteed that either returned `session`, `remembered` and `user` or `error` is not `null`.
   */
  renewSession: RenewSession_renewSession;
}

export interface RenewSessionVariables {
  token: GraphQLScalars.RememberToken;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ResendUserEmailConfirmation
// ====================================================

export interface ResendUserEmailConfirmation_resendUserEmailConfirmation_user {
  __typename: "MyUser";
  /**
   * Newly set email address of this `MyUser` that requires confirmation.
   *
   * It doesn't provide any `email` related capabilities. Once confirmed it becomes
   * a `MyUser.email` field unlocking the expected capabilities.
   */
  unconfirmedEmail: GraphQLScalars.UserEmail | null;
}

export interface ResendUserEmailConfirmation_resendUserEmailConfirmation {
  __typename: "ResendUserEmailConfirmationResult";
  /**
   * `MyUser` for which email confirmation has been resent.
   *
   * `null` if mutation failed.
   */
  user: ResendUserEmailConfirmation_resendUserEmailConfirmation_user | null;
  /**
   * Error of resending `MyUser`'s email confirmation.
   *
   * `null` if mutation succeeded.
   */
  error: ResendUserEmailConfirmationError | null;
}

export interface ResendUserEmailConfirmation {
  /**
   * Resends new `MyUser.unconfirmedEmail` address confirmation link for the authenticated `MyUser`.
   *
   * Sends to `MyUser.unconfirmedEmail` address an email message with a new
   * confirmation link. Once `User` follows this link the `email` address will be
   * confirmed and set as `email` field of `MyUser` unlocking the related capabilities.
   *
   * Authentication: mandatory
   *
   * Non-Idempotent:
   * Each time generates new confirmation link.
   *
   * Result:
   * It's guaranteed that either returned `user` or `error` is not `null`.
   */
  resendUserEmailConfirmation: ResendUserEmailConfirmation_resendUserEmailConfirmation;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ResetUserPassword
// ====================================================

export interface ResetUserPassword_resetUserPassword_user {
  __typename: "MyUser";
  /**
   * Indicator that this `MyUser` has password.
   *
   * Password allows `MyUser` to perform sign-in, when combined with `login`, `email` or `num`.
   */
  hasPassword: boolean;
}

export interface ResetUserPassword_resetUserPassword {
  __typename: "ResetUserPasswordResult";
  /**
   * `MyUser` with `has_password` field being updated.
   *
   * `null` if mutation failed.
   */
  user: ResetUserPassword_resetUserPassword_user | null;
  /**
   * Error resetting `MyUser`'s password.
   *
   * `null` if mutation succeeded.
   */
  error: ResetUserPasswordError | null;
}

export interface ResetUserPassword {
  /**
   * Resets password for the `MyUser` authenticated by the provided `PasswordRecoveryToken`.
   *
   * If `MyUser` has no password yet, then `new` password will be his first password unlocking the sign-in capability.
   *
   * Authentication: no
   *
   * Non-idempotent:
   * `PasswordRecoveryToken` can only be used once.
   *
   *
   * Result:
   * It's guaranteed that either returned `user` or `error` is not `null`.
   */
  resetUserPassword: ResetUserPassword_resetUserPassword;
}

export interface ResetUserPasswordVariables {
  new: GraphQLScalars.UserPassword;
  token: GraphQLScalars.PasswordRecoveryToken;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SignIn
// ====================================================

export interface SignIn_createSession_remembered {
  __typename: "RememberedSession";
  /**
   * Datetime of this `RememberedSession` expiration in [RFC 3339] format. Once
   * expired it's not usable anymore and a new `RememberedSession` should be
   * created via `Mutations.createSession`.
   *
   * Client applications are supposed to use this field for tracking
   * `RememberedSession`'s expiration and sign out `User`s properly.
   *
   * [RFC 3339]: https: // tools.ietf.org/html/rfc3339#section-5.8
   */
  expireAt: GraphQLScalars.DateTimeUtc;
  /**
   * Unique remember token of this `RememberedSession`.
   *
   * This one should be used for `Session` renewal via `Mutations.renewSession` and
   * is NOT usable as a Bearer Authentication token.
   */
  token: GraphQLScalars.RememberToken;
  /**
   * Version of this `RememberedSession`'s state.
   *
   * It increases monotonically, so may be used (and is intended) for tracking state's actuality.
   */
  ver: GraphQLScalars.Version;
}

export interface SignIn_createSession_session {
  __typename: "Session";
  /**
   * Datetime of this `Session` expiration in [RFC 3339] format. Once expired it's
   * not usable anymore and a new `Session` should be created via
   * `Mutations.createSession` or `Mutations.renewSession`.
   *
   * Client applications are supposed to use this field for tracking `Session`'s
   * expiration and renewing it before authentication errors occur.
   *
   * [RFC 3339]: https: // tools.ietf.org/html/rfc3339#section-5.8
   */
  expireAt: GraphQLScalars.DateTimeUtc;
  /**
   * Unique authentication token of this `Session`.
   *
   * This one should be used as a Bearer Authentication token.
   */
  token: GraphQLScalars.AccessToken;
  /**
   * Version of this `Session`'s state.
   *
   * It increases monotonically, so may be used (and is intended) for tracking state's actuality.
   */
  ver: GraphQLScalars.Version;
}

export interface SignIn_createSession_user {
  __typename: "MyUser";
  /**
   * Email address of this `MyUser`.
   *
   * `email` allows `MyUser` to perform sign-in, when combined with password.
   *
   * `email` allows `MyUser` to recover his password.
   *
   * `MyUser` may choose `email` to be his `User.displayName`, but in general
   * `email` is not intended to be a public information.
   */
  email: GraphQLScalars.UserEmail | null;
  /**
   * Indicator that this `MyUser` has password.
   *
   * Password allows `MyUser` to perform sign-in, when combined with `login`, `email` or `num`.
   */
  hasPassword: boolean;
  /**
   * Unique ID of this `MyUser`.
   *
   * Once assigned it never changes.
   */
  id: GraphQLScalars.UserId;
  /**
   * Unique login of this `MyUser`.
   *
   * `login` allows `MyUser` to perform sign-in, when combined with password.
   *
   * `MyUser` may choose `login` to be his `User.displayName`, but in general
   * `login` is not intended to be a public information.
   */
  login: GraphQLScalars.UserLogin | null;
  /**
   * Name of this `MyUser`.
   *
   * `name` of `MyUser` is not unique and is intended for displaying `MyUser` in a
   * well-readable form. It can be either first name, or last name of `MyUser`,
   * both of them, or even some nickname.
   *
   * `MyUser` may choose `name` to be his `User.displayName`
   */
  name: GraphQLScalars.UserName | null;
  /**
   * Unique number of this `MyUser`.
   *
   * `num` is intended for easier `MyUser` identification by other `User`s. It's just like a telephone number in a real life.
   *
   *
   * `num` allows `MyUser` to perform sign-in, when combined with password.
   *
   * It may be reused by another `User` in future, once this `MyUser` becomes
   * unreachable (sign-in for this `MyUser` is impossible).
   */
  num: GraphQLScalars.Num;
  /**
   * Newly set email address of this `MyUser` that requires confirmation.
   *
   * It doesn't provide any `email` related capabilities. Once confirmed it becomes
   * a `MyUser.email` field unlocking the expected capabilities.
   */
  unconfirmedEmail: GraphQLScalars.UserEmail | null;
  /**
   * Version of this `User`'s state.
   *
   * It increases monotonically, so may be used (and is intended) for tracking state's actuality.
   */
  ver: GraphQLScalars.Version;
}

export interface SignIn_createSession {
  __typename: "CreateSessionResult";
  /**
   * Error of creating new `Session`.
   *
   * `null` if mutation succeeded.
   */
  error: CreateSessionError | null;
  /**
   * Created `RememberedSession` for `Session` renewal.
   *
   * It will expire in 90 days (~ 3 months) after creation.
   *
   * May be not-`null` only if `remember` flag was specified when calling `Mutations.createSession`.
   *
   * `null` if `remember` argument of `Mutations.createSession` wasn't specified or is `false`.
   *
   * `null` if mutation failed or `MyUser` with specified `num`/`login`/`email` doesn't exist.
   */
  remembered: SignIn_createSession_remembered | null;
  /**
   * Created `Session`.
   *
   * It will expire in 24 hours after creation.
   *
   * `null` if mutation failed or `MyUser` with specified `num`/`login`/`email` doesn't exist.
   */
  session: SignIn_createSession_session | null;
  /**
   * `MyUser` that `Session` was created for.
   *
   * `null` if mutation failed or `MyUser` with specified `num`/`login`/`email` doesn't exist.
   */
  user: SignIn_createSession_user | null;
}

export interface SignIn {
  /**
   * Creates new `Session` for `MyUser` identified by given `num`, `login` or `email`. Represents a sing-in action.
   *
   * Exactly one of `num`/`login`/`email` arguments must be specified (be non-`null`).
   *
   * Authentication: no
   *
   * Non-idempotent:
   * Each time creates a new `Session`.
   *
   * Result:
   * If the `MyUser` with specified `num`/`login`/`email` doesn't exist then `null`
   * is returned for all `session`, `user` and `error` in the result.
   */
  createSession: SignIn_createSession;
}

export interface SignInVariables {
  email?: GraphQLScalars.UserEmail | null;
  login?: GraphQLScalars.UserLogin | null;
  num?: GraphQLScalars.Num | null;
  password: GraphQLScalars.UserPassword;
  remember: boolean;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SignUp
// ====================================================

export interface SignUp_createUser_user {
  __typename: "MyUser";
  /**
   * Unique ID of this `MyUser`.
   *
   * Once assigned it never changes.
   */
  id: GraphQLScalars.UserId;
  /**
   * Unique number of this `MyUser`.
   *
   * `num` is intended for easier `MyUser` identification by other `User`s. It's just like a telephone number in a real life.
   *
   *
   * `num` allows `MyUser` to perform sign-in, when combined with password.
   *
   * It may be reused by another `User` in future, once this `MyUser` becomes
   * unreachable (sign-in for this `MyUser` is impossible).
   */
  num: GraphQLScalars.Num;
  /**
   * Version of this `User`'s state.
   *
   * It increases monotonically, so may be used (and is intended) for tracking state's actuality.
   */
  ver: GraphQLScalars.Version;
}

export interface SignUp_createUser_session {
  __typename: "Session";
  /**
   * Unique authentication token of this `Session`.
   *
   * This one should be used as a Bearer Authentication token.
   */
  token: GraphQLScalars.AccessToken;
  /**
   * Datetime of this `Session` expiration in [RFC 3339] format. Once expired it's
   * not usable anymore and a new `Session` should be created via
   * `Mutations.createSession` or `Mutations.renewSession`.
   *
   * Client applications are supposed to use this field for tracking `Session`'s
   * expiration and renewing it before authentication errors occur.
   *
   * [RFC 3339]: https: // tools.ietf.org/html/rfc3339#section-5.8
   */
  expireAt: GraphQLScalars.DateTimeUtc;
  /**
   * Version of this `Session`'s state.
   *
   * It increases monotonically, so may be used (and is intended) for tracking state's actuality.
   */
  ver: GraphQLScalars.Version;
}

export interface SignUp_createUser {
  __typename: "CreateUserResult";
  /**
   * Created `MyUser`.
   */
  user: SignUp_createUser_user;
  /**
   * `Session` of the created `MyUser`.
   *
   * It will expire in 24 hours after `MyUser` creation.
   */
  session: SignUp_createUser_session;
}

export interface SignUp {
  /**
   * Creates new `MyUser` having only `id` and unique `num` fields, and creates a
   * new `Session` for this `MyUser` (valid for 24 hours).
   *
   * Authentication: no
   *
   * Non-idempotent:
   * Each time creates a new unique `MyUser`.
   */
  createUser: SignUp_createUser;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUserDisplayName
// ====================================================

export interface UpdateUserDisplayName_updateUserDisplayName_user {
  __typename: "MyUser";
  /**
   * Setting of how this `MyUser`'s name is displayed in client applications (via `User.displayName`).
   *
   * `MyUser` can choose to display his name in client applications either as
   * `MyUser.name`, `MyUser.num`, `MyUser.login` or `MyUser.email`.
   *
   * Default is `MyUser.num`.
   */
  displayNameSetting: UserDisplayNameSetting;
}

export interface UpdateUserDisplayName_updateUserDisplayName {
  __typename: "UpdateUserDisplayNameResult";
  /**
   * `MyUser` with `displayNameSetting` field being updated.
   *
   * `null` if mutation failed.
   */
  user: UpdateUserDisplayName_updateUserDisplayName_user | null;
  /**
   * Error of updating `MyUser`'s display name.
   *
   * `null` if mutation succeeded.
   */
  error: UpdateDisplayNameError | null;
}

export interface UpdateUserDisplayName {
  /**
   * Sets up `MyUser.displayNameSetting` for the authenticated `MyUser`, updating the way his `User.displayName` is displayed.
   *
   * Authentication: mandatory
   *
   * Idempotent:
   * Succeeds as no-op if `MyUser` uses the provided `displayNameSetting` already.
   *
   * Result:
   * It's guaranteed that either returned `user` or `error` is not `null`.
   */
  updateUserDisplayName: UpdateUserDisplayName_updateUserDisplayName;
}

export interface UpdateUserDisplayNameVariables {
  setting: UserDisplayNameSetting;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUserEmail
// ====================================================

export interface UpdateUserEmail_updateUserEmail_user {
  __typename: "MyUser";
  /**
   * Newly set email address of this `MyUser` that requires confirmation.
   *
   * It doesn't provide any `email` related capabilities. Once confirmed it becomes
   * a `MyUser.email` field unlocking the expected capabilities.
   */
  unconfirmedEmail: GraphQLScalars.UserEmail | null;
}

export interface UpdateUserEmail_updateUserEmail {
  __typename: "UpdateUserEmailResult";
  /**
   * `MyUser` with `email` or `unconfirmedEmail` fields being updated.
   *
   * `null` if mutation failed.
   */
  user: UpdateUserEmail_updateUserEmail_user | null;
  /**
   * Error of updating `MyUser`'s email address.
   *
   * `null` if mutation succeeded.
   */
  error: UpdateUserEmailError | null;
}

export interface UpdateUserEmail {
  /**
   * Initiates `email` address updating for the authenticated `MyUser`.
   *
   * Sets the given `email` address as an `unconfirmedEmail` field of `MyUser` and
   * sends to this address an email message with a confirmation link. Once `User`
   * follows this link the `email` address will be confirmed and set as `email`
   * field of `MyUser` unlocking the related capabilities.
   *
   * Authentication: mandatory
   *
   * Idempotent:
   * Succeeds as no-op if `MyUser` uses the provided `email` already (either as `email` or as `unconfirmedEmail` field).
   *
   * Result:
   * It's guaranteed that either returned `user` or `error` is not `null`.
   */
  updateUserEmail: UpdateUserEmail_updateUserEmail;
}

export interface UpdateUserEmailVariables {
  email: GraphQLScalars.UserEmail;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUserLogin
// ====================================================

export interface UpdateUserLogin_updateUserLogin {
  __typename: "UpdateUserLoginResult";
  /**
   * Error of updating `MyUser`'s login.
   *
   * `null` if mutation succeeded.
   */
  error: UpdateUserLoginError | null;
}

export interface UpdateUserLogin {
  /**
   * Updates `login` for the authenticated `MyUser`.
   *
   * Sets the given `login` as a `login` field of `MyUser`.
   *
   * Authentication: mandatory
   *
   * Idempotent:
   * Succeeds as no-op if `MyUser` uses the provided `login` already.
   *
   * Result:
   * It's guaranteed that either returned `user` or `error` is not `null`.
   */
  updateUserLogin: UpdateUserLogin_updateUserLogin;
}

export interface UpdateUserLoginVariables {
  login: GraphQLScalars.UserLogin;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUserName
// ====================================================

export interface UpdateUserName_updateUserName {
  __typename: "MyUser";
  /**
   * Name of this `MyUser`.
   *
   * `name` of `MyUser` is not unique and is intended for displaying `MyUser` in a
   * well-readable form. It can be either first name, or last name of `MyUser`,
   * both of them, or even some nickname.
   *
   * `MyUser` may choose `name` to be his `User.displayName`
   */
  name: GraphQLScalars.UserName | null;
}

export interface UpdateUserName {
  /**
   * Updates `name` for the authenticated `MyUser`.
   *
   * Sets the given `name` as an `name` field of `MyUser`.
   *
   * Authentication: mandatory
   *
   * Idempotent:
   * Succeeds as no-op if `MyUser` uses the provided `name` already.
   */
  updateUserName: UpdateUserName_updateUserName;
}

export interface UpdateUserNameVariables {
  name: GraphQLScalars.UserName;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUserPassword
// ====================================================

export interface UpdateUserPassword_updateUserPassword_user {
  __typename: "MyUser";
  /**
   * Indicator that this `MyUser` has password.
   *
   * Password allows `MyUser` to perform sign-in, when combined with `login`, `email` or `num`.
   */
  hasPassword: boolean;
}

export interface UpdateUserPassword_updateUserPassword {
  __typename: "UpdateUserPasswordResult";
  /**
   * `MyUser` with `has_password` field being updated.
   *
   * `null` if mutation failed.
   */
  user: UpdateUserPassword_updateUserPassword_user | null;
  /**
   * Error of updating `MyUser`'s password.
   *
   * `null` if mutation succeeded.
   */
  error: UpdateUserPasswordError | null;
}

export interface UpdateUserPassword {
  /**
   * Updates password for the authenticated `MyUser`.
   *
   * If `MyUser` has no password yet (when sets his password), then `old` password
   * is not required. Otherwise (when changes his password), it's mandatory to
   * specify the `old` one.
   *
   * Authentication: mandatory
   *
   * Non-idempotent:
   * Each time renews the password even if it's the same.
   *
   * Result:
   * It's guaranteed that either returned `user` or `error` is not `null`.
   */
  updateUserPassword: UpdateUserPassword_updateUserPassword;
}

export interface UpdateUserPasswordVariables {
  new: GraphQLScalars.UserPassword;
  old?: GraphQLScalars.UserPassword | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CheckUserIdentifiable
// ====================================================

export interface CheckUserIdentifiable {
  /**
   * Checks if some `MyUser` can be identified by given `num`, `login` or `email`.
   *
   * Exactly one of `num`/`login`/`email` arguments must be specified (be non-`null`).
   *
   * Authentication: no
   */
  checkUserIdentifiable: boolean;
}

export interface CheckUserIdentifiableVariables {
  num?: GraphQLScalars.Num | null;
  login?: GraphQLScalars.UserLogin | null;
  email?: GraphQLScalars.UserEmail | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CheckUserOccupied
// ====================================================

export interface CheckUserOccupied {
  /**
   * Checks if the given `login` is occupied by some `User`.
   *
   * Authentication: mandatory
   */
  checkUserLoginOccupied: boolean;
}

export interface CheckUserOccupiedVariables {
  login: GraphQLScalars.UserLogin;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * Possible errors of confirming `MyUser`'s email address via `Mutations.confirmUserEmail`.
 */
export enum ConfirmUserEmailError {
  OCCUPIED = "OCCUPIED",
  WRONG_TOKEN = "WRONG_TOKEN",
}

/**
 * Possible errors of creating new `Session` via `Mutations.createSession`.
 */
export enum CreateSessionError {
  WRONG_PASSWORD = "WRONG_PASSWORD",
}

/**
 * Possible errors of deleting `MyUser`'s name via `Mutations.deleteUserName`.
 */
export enum DeleteUserNameError {
  IS_DISPLAY_NAME = "IS_DISPLAY_NAME",
}

/**
 * Possible errors of renewing `Session` via `Mutations.renewSession`.
 */
export enum RenewSessionError {
  WRONG_REMEMBER_TOKEN = "WRONG_REMEMBER_TOKEN",
}

/**
 * Possible errors of resending `MyUser`'s email confirmation via `Mutations.resendUserEmailConfirmation`.
 */
export enum ResendUserEmailConfirmationError {
  NO_UNCONFIRMED_EMAIL = "NO_UNCONFIRMED_EMAIL",
}

/**
 * Possible errors of resetting `MyUser`'s password via `Mutations.resetUserPassword`.
 */
export enum ResetUserPasswordError {
  WRONG_TOKEN = "WRONG_TOKEN",
}

/**
 * Possible errors of updating `MyUser`'s display name via `Mutations.updateUserDisplayName`.
 */
export enum UpdateDisplayNameError {
  NO_EMAIL = "NO_EMAIL",
  NO_LOGIN = "NO_LOGIN",
  NO_NAME = "NO_NAME",
}

/**
 * Possible errors of updating `MyUser`'s email address via `Mutations.updateUserEmail`.
 */
export enum UpdateUserEmailError {
  OCCUPIED = "OCCUPIED",
}

/**
 * Possible errors of setting `MyUser`'s login via `Mutations.updateUserLogin`.
 */
export enum UpdateUserLoginError {
  OCCUPIED = "OCCUPIED",
}

/**
 * Possible errors of updating `MyUser`'s password via `Mutations.updateUserPassword`.
 */
export enum UpdateUserPasswordError {
  WRONG_OLD_PASSWORD = "WRONG_OLD_PASSWORD",
}

/**
 * Type of setting for displaying `MyUser`'s name in client applications (via `User.displayName`).
 *
 * `MyUser` can choose to display his name in client applications either as
 * `MyUser.name`, `MyUser.num`, `MyUser.login` or `MyUser.email`.
 */
export enum UserDisplayNameSetting {
  EMAIL = "EMAIL",
  LOGIN = "LOGIN",
  NAME = "NAME",
  NUM = "NUM",
}

//==============================================================
// END Enums and Input Objects
//==============================================================
