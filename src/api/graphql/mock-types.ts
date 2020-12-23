/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: BlockContact
// ====================================================

export interface BlockContact {
  blockContact: boolean;
}

export interface BlockContactVariables {
  contact: ContactInput;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ChangeConversationsOrder
// ====================================================

export interface ChangeConversationsOrder {
  changeConversationsOrder: boolean;
}

export interface ChangeConversationsOrderVariables {
  conversations: ConversationInput[];
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveContact
// ====================================================

export interface RemoveContact {
  removeContact: boolean;
}

export interface RemoveContactVariables {
  contact: ContactInput;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RenameContact
// ====================================================

export interface RenameContact {
  renameContact: boolean;
}

export interface RenameContactVariables {
  contact: ContactRenameInput;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ShareContact
// ====================================================

export interface ShareContact_shareContact {
  __typename: "ShareResult";
  alreadyExist: boolean | null;
  exceedsMaxLength: boolean | null;
  isEmpty: boolean | null;
  link: string | null;
  notValid: boolean | null;
  success: boolean | null;
}

export interface ShareContact {
  shareContact: ShareContact_shareContact | null;
}

export interface ShareContactVariables {
  conversationId: string;
  link: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SupportContact
// ====================================================

export interface SupportContact_supportContact {
  __typename: "SupportContact";
  emptyDonation: boolean | null;
  lessThanAllowed: boolean | null;
  outOfFunds: boolean | null;
  success: boolean | null;
}

export interface SupportContact {
  supportContact: SupportContact_supportContact | null;
}

export interface SupportContactVariables {
  conversationId: string;
  amount: number;
  message: string;
  translate: boolean;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ToggleRememberContact
// ====================================================

export interface ToggleRememberContact {
  toggleRememberContact: boolean;
}

export interface ToggleRememberContactVariables {
  contact: ContactInput;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UnblockContact
// ====================================================

export interface UnblockContact {
  unblockContact: boolean;
}

export interface UnblockContactVariables {
  contact: ContactInput;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteAllConversationMessages
// ====================================================

export interface DeleteAllConversationMessages_refreshConversationStartDate {
  __typename: "Conversation";
  id: string;
  messagesFrom: string | null;
}

export interface DeleteAllConversationMessages {
  deleteAllConversationMessages: string;
  refreshConversationStartDate: DeleteAllConversationMessages_refreshConversationStartDate;
}

export interface DeleteAllConversationMessagesVariables {
  conversationId: string;
  lastMessageId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteConversationMessage
// ====================================================

export interface DeleteConversationMessage {
  deleteConversationMessage: string | null;
}

export interface DeleteConversationMessageVariables {
  messageId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RestoreAllConversationMessages
// ====================================================

export interface RestoreAllConversationMessages_refreshConversationStartDate {
  __typename: "Conversation";
  id: string;
  messagesFrom: string | null;
}

export interface RestoreAllConversationMessages {
  restoreAllConversationMessages: string;
  refreshConversationStartDate: RestoreAllConversationMessages_refreshConversationStartDate;
}

export interface RestoreAllConversationMessagesVariables {
  conversationId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RestoreConversationMessage
// ====================================================

export interface RestoreConversationMessage {
  restoreConversationMessage: boolean;
}

export interface RestoreConversationMessageVariables {
  messageId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SendConversationMessage
// ====================================================

export interface SendConversationMessage_sendConversationMessage_attachment_error {
  __typename: "Error";
  name: string;
  message: string;
}

export interface SendConversationMessage_sendConversationMessage_attachment {
  __typename: "MessageAttachment";
  id: string | null;
  type: string | null;
  src: string | null;
  name: string;
  size: number | null;
  error: SendConversationMessage_sendConversationMessage_attachment_error | null;
}

export interface SendConversationMessage_sendConversationMessage {
  __typename: "Message";
  id: string;
  sentAt: string;
  status: string;
  attachment: SendConversationMessage_sendConversationMessage_attachment | null;
}

export interface SendConversationMessage {
  sendConversationMessage: SendConversationMessage_sendConversationMessage[];
}

export interface SendConversationMessageVariables {
  message: MessageInput;
  files?: any[] | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: TransferConversationMessage
// ====================================================

export interface TransferConversationMessage_transferConversationMessage_transferedFrom {
  __typename: "Contact";
  num: string;
  alias: string;
  photo: string;
}

export interface TransferConversationMessage_transferConversationMessage_sender {
  __typename: "Contact";
  num: string;
  alias: string;
  photo: string;
}

export interface TransferConversationMessage_transferConversationMessage_attachment {
  __typename: "MessageAttachment";
  id: string | null;
  type: string | null;
  src: string | null;
  name: string;
  size: number | null;
}

export interface TransferConversationMessage_transferConversationMessage {
  __typename: "Message";
  id: string;
  conversationId: string;
  mine: boolean;
  text: string | null;
  sentAt: string;
  transferedFrom: TransferConversationMessage_transferConversationMessage_transferedFrom | null;
  sender: TransferConversationMessage_transferConversationMessage_sender | null;
  attachment: TransferConversationMessage_transferConversationMessage_attachment | null;
  deleted: boolean;
  deletedAt: string | null;
  deletable: boolean;
  isNotification: boolean | null;
  isStatus: boolean | null;
  status: string;
}

export interface TransferConversationMessage {
  transferConversationMessage: TransferConversationMessage_transferConversationMessage[];
}

export interface TransferConversationMessageVariables {
  messageId: string;
  conversationIds: string[];
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: TranslateConversationMessages
// ====================================================

export interface TranslateConversationMessages {
  translateConversationMessages: boolean;
}

export interface TranslateConversationMessagesVariables {
  messageIds: string[];
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ChangeDefaultId
// ====================================================

export interface ChangeDefaultId_changeDefaultId {
  __typename: "ChangeDefaultIdResult";
  reason: string | null;
  result: boolean;
}

export interface ChangeDefaultId {
  changeDefaultId: ChangeDefaultId_changeDefaultId;
}

export interface ChangeDefaultIdVariables {
  defaultId: string;
  defaultIdType: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ChangeUserSlogan
// ====================================================

export interface ChangeUserSlogan {
  changeUserSlogan: boolean;
}

export interface ChangeUserSloganVariables {
  slogan: string;
  translate: boolean;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ChangeUserStatus
// ====================================================

export interface ChangeUserStatus {
  changeUserStatus: boolean;
}

export interface ChangeUserStatusVariables {
  status: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: FollowUser
// ====================================================

export interface FollowUser_followUser {
  __typename: "User";
  num: string;
  isFollowedByMe: boolean;
  followers: number;
}

export interface FollowUser {
  followUser: FollowUser_followUser | null;
}

export interface FollowUserVariables {
  followerUserId: string;
  targetUserId: string;
  isFollow: boolean;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveEmail
// ====================================================

export interface RemoveEmail_removeEmail {
  __typename: "RemoveEmailResult";
  reason: string | null;
  result: boolean;
}

export interface RemoveEmail {
  removeEmail: RemoveEmail_removeEmail;
}

export interface RemoveEmailVariables {
  email: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ReplacePassword
// ====================================================

export interface ReplacePassword_replacePassword {
  __typename: "ResetPasswordResult";
  reason: string | null;
  result: boolean;
}

export interface ReplacePassword {
  replacePassword: ReplacePassword_replacePassword;
}

export interface ReplacePasswordVariables {
  oldPassword: string;
  password: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RestorePassword
// ====================================================

export interface RestorePassword_restorePassword {
  __typename: "RestorePassword";
  result: boolean;
  feedbackType: string | null;
  reason: string | null;
}

export interface RestorePassword {
  restorePassword: RestorePassword_restorePassword;
}

export interface RestorePasswordVariables {
  login: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetAvatar
// ====================================================

export interface SetAvatar_setAvatar {
  __typename: "SetAvatarResult";
  reason: string | null;
  result: boolean;
  src: string;
}

export interface SetAvatar {
  setAvatar: SetAvatar_setAvatar;
}

export interface SetAvatarVariables {
  avatar: any;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetEmail
// ====================================================

export interface SetEmail_setEmail {
  __typename: "SetEmailResult";
  reason: string | null;
  result: boolean;
}

export interface SetEmail {
  setEmail: SetEmail_setEmail;
}

export interface SetEmailVariables {
  email: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetLogin
// ====================================================

export interface SetLogin_setLogin {
  __typename: "SetLoginResult";
  reason: string | null;
  result: boolean;
}

export interface SetLogin {
  setLogin: SetLogin_setLogin;
}

export interface SetLoginVariables {
  login: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetName
// ====================================================

export interface SetName_setName {
  __typename: "SetNameResult";
  reason: string | null;
  result: boolean;
}

export interface SetName {
  setName: SetName_setName;
}

export interface SetNameVariables {
  name: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetPassword
// ====================================================

export interface SetPassword_setPassword {
  __typename: "SetPasswordResult";
  reason: string | null;
  result: boolean;
}

export interface SetPassword {
  setPassword: SetPassword_setPassword;
}

export interface SetPasswordVariables {
  password: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SignUp
// ====================================================

export interface SignUp_signUp {
  __typename: "SignUp";
  accessToken: string;
  expireIn: number;
  num: string;
}

export interface SignUp {
  signUp: SignUp_signUp;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateLinkVisits
// ====================================================

export interface UpdateLinkVisits {
  updateLinkVisits: boolean;
}

export interface UpdateLinkVisitsVariables {
  link: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUserData
// ====================================================

export interface UpdateUserData {
  updateUserData: boolean;
}

export interface UpdateUserDataVariables {
  user: UserInput;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Auth
// ====================================================

export interface Auth_auth_user {
  __typename: "User";
  num: string;
  login: string | null;
  name: string | null;
  photo: string;
  status: string;
  slogan: string | null;
  funds: number;
  emails: string[];
  isPasswordSet: boolean;
  defaultId: string;
  defaultIdType: string;
}

export interface Auth_auth {
  __typename: "Auth";
  authMessage: string;
  accessToken: string | null;
  expireIn: number | null;
  user: Auth_auth_user | null;
}

export interface Auth {
  auth: Auth_auth;
}

export interface AuthVariables {
  login?: string | null;
  password?: string | null;
  accessToken?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CheckLogin
// ====================================================

export interface CheckLogin_checkLogin {
  __typename: "CheckLoginResult";
  result: boolean;
  reason: string | null;
}

export interface CheckLogin {
  checkLogin: CheckLogin_checkLogin;
}

export interface CheckLoginVariables {
  login: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ContactsByType
// ====================================================

export interface ContactsByType_contacts {
  __typename: "Contact";
  num: string;
  login: string | null;
  name: string | null;
  alias: string;
  photo: string;
  status: string;
  unreadCount: number | null;
  isRequested: boolean | null;
  isNew: boolean | null;
  isFavourite: boolean | null;
  isBlockedByMe: boolean | null;
  isMeBlocked: boolean | null;
}

export interface ContactsByType {
  contacts: ContactsByType_contacts[];
}

export interface ContactsByTypeVariables {
  type: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ConversationMessages
// ====================================================

export interface ConversationMessages_conversationMessages_messages_transferedFrom {
  __typename: "Contact";
  num: string;
  alias: string;
  photo: string;
}

export interface ConversationMessages_conversationMessages_messages_sender {
  __typename: "Contact";
  num: string;
  alias: string;
  photo: string;
}

export interface ConversationMessages_conversationMessages_messages_attachment {
  __typename: "MessageAttachment";
  id: string | null;
  type: string | null;
  src: string | null;
  name: string;
  size: number | null;
}

export interface ConversationMessages_conversationMessages_messages {
  __typename: "Message";
  id: string;
  conversationId: string;
  mine: boolean;
  text: string | null;
  sentAt: string;
  transferedFrom: ConversationMessages_conversationMessages_messages_transferedFrom | null;
  sender: ConversationMessages_conversationMessages_messages_sender | null;
  attachment: ConversationMessages_conversationMessages_messages_attachment | null;
  deleted: boolean;
  deletedAt: string | null;
  deletable: boolean;
  isNotification: boolean | null;
  isStatus: boolean | null;
  status: string;
}

export interface ConversationMessages_conversationMessages {
  __typename: "ConversationMessages";
  messages: ConversationMessages_conversationMessages_messages[];
  hasMore: boolean;
  totalCount: number;
}

export interface ConversationMessages {
  conversationMessages: ConversationMessages_conversationMessages;
}

export interface ConversationMessagesVariables {
  conversationId: string;
  count?: number | null;
  lastMessageId?: string | null;
  onlyPhoto?: boolean | null;
  reverseFetch?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Conversations
// ====================================================

export interface Conversations_conversations_conversations_participants {
  __typename: "Contact";
  num: string;
  alias: string;
  name: string | null;
  login: string | null;
}

export interface Conversations_conversations_conversations_messages_sender {
  __typename: "Contact";
  num: string;
  alias: string;
  photo: string;
}

export interface Conversations_conversations_conversations_messages_attachment {
  __typename: "MessageAttachment";
  id: string | null;
  type: string | null;
  src: string | null;
  name: string;
  size: number | null;
}

export interface Conversations_conversations_conversations_messages {
  __typename: "Message";
  id: string;
  conversationId: string;
  mine: boolean;
  text: string | null;
  sentAt: string;
  sender: Conversations_conversations_conversations_messages_sender | null;
  attachment: Conversations_conversations_conversations_messages_attachment | null;
  deleted: boolean;
  deletedAt: string | null;
  deletable: boolean;
  isNotification: boolean | null;
  isStatus: boolean | null;
  status: string;
}

export interface Conversations_conversations_conversations_photoAttachments_attachment {
  __typename: "MessageAttachment";
  id: string | null;
  type: string | null;
  src: string | null;
  name: string;
  size: number | null;
}

export interface Conversations_conversations_conversations_photoAttachments {
  __typename: "Message";
  id: string;
  attachment: Conversations_conversations_conversations_photoAttachments_attachment | null;
}

export interface Conversations_conversations_conversations {
  __typename: "Conversation";
  id: string;
  photo: string;
  status: string;
  unreadCount: number | null;
  isFavourite: boolean | null;
  description: string;
  title: string;
  notices: boolean | null;
  participants: Conversations_conversations_conversations_participants[];
  messages: Conversations_conversations_conversations_messages[];
  hasMoreMessages: boolean;
  messagesFrom: string | null;
  photoAttachments: Conversations_conversations_conversations_photoAttachments[];
  photoAttachmentsCount: number;
}

export interface Conversations_conversations {
  __typename: "Conversations";
  conversations: Conversations_conversations_conversations[];
  hasMore: boolean;
}

export interface Conversations {
  conversations: Conversations_conversations;
}

export interface ConversationsVariables {
  type: string;
  offset?: number | null;
  limit?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Logout
// ====================================================

export interface Logout {
  logout: boolean;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OriginalPath
// ====================================================

export interface OriginalPath {
  originalPath: string;
}

export interface OriginalPathVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserPhotosForProfile
// ====================================================

export interface UserPhotosForProfile_userPhotos_photos_sizes {
  __typename: "PhotoSizes";
  smallHeight: string;
}

export interface UserPhotosForProfile_userPhotos_photos {
  __typename: "Photo";
  id: string;
  sizes: UserPhotosForProfile_userPhotos_photos_sizes;
}

export interface UserPhotosForProfile_userPhotos {
  __typename: "UserPhotos";
  photos: UserPhotosForProfile_userPhotos_photos[];
}

export interface UserPhotosForProfile {
  userPhotos: UserPhotosForProfile_userPhotos | null;
}

export interface UserPhotosForProfileVariables {
  userId: string;
  offset?: number | null;
  limit?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserProfile
// ====================================================

export interface UserProfile_user {
  __typename: "User";
  num: string;
  slogan: string | null;
  name: string | null;
  login: string | null;
  photo: string;
  status: string;
  birth: string | null;
  language: string | null;
  maritalStatus: string | null;
  location: string | null;
  education: string | null;
  job: string | null;
  gender: string;
  isFollowedByMe: boolean;
  emails: string[];
  isPasswordSet: boolean;
  defaultId: string;
  defaultIdType: string;
}

export interface UserProfile_userPhotos_photos_sizes {
  __typename: "PhotoSizes";
  smallHeight: string;
}

export interface UserProfile_userPhotos_photos {
  __typename: "Photo";
  id: string;
  sizes: UserProfile_userPhotos_photos_sizes;
}

export interface UserProfile_userPhotos {
  __typename: "UserPhotos";
  photos: UserProfile_userPhotos_photos[];
  total: number;
}

export interface UserProfile_userLastPhoto_sizes {
  __typename: "PhotoSizes";
  mediumHeight: string;
}

export interface UserProfile_userLastPhoto {
  __typename: "Photo";
  id: string;
  sizes: UserProfile_userLastPhoto_sizes;
}

export interface UserProfile {
  user: UserProfile_user | null;
  maritalStatuses: string[];
  languages: string[];
  userPhotos: UserProfile_userPhotos | null;
  userLastPhoto: UserProfile_userLastPhoto | null;
}

export interface UserProfileVariables {
  userId: string;
  userPhotosLimit?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * Contact item, that used as input while doing mutations.
 */
export interface ContactInput {
  num: string;
}

/**
 * Contact item, that used as input into rename mutation.
 */
export interface ContactRenameInput {
  alias: string;
  num: string;
}

/**
 * Conversation item, that used as input while doing mutations.
 */
export interface ConversationInput {
  id: string;
}

/**
 * Attachment, that used while doing mutations.
 */
export interface MessageAttachmentInput {
  src: string;
  name?: string | null;
  type: string;
}

/**
 * Message input, that used while doing conversation message mutation.
 */
export interface MessageInput {
  attachments?: MessageAttachmentInput[] | null;
  conversationId?: string | null;
  text?: string | null;
  translate?: boolean | null;
}

/**
 * User item, that used as input while doing mutations.
 */
export interface UserInput {
  birth?: string | null;
  education?: string | null;
  name?: string | null;
  num: string;
  gender: string;
  job?: string | null;
  language?: string | null;
  location?: string | null;
  maritalStatus?: string | null;
  login?: string | null;
  photo: string;
  slogan?: string | null;
  status: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
