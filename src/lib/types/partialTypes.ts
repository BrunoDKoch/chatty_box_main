type MessagePreview = {
  from: UserPartialResponse;
  sentAt: Date;
  text: string;
  read: boolean;
};

interface UserPartialResponse {
  userName: string;
  avatar?: string;
  id: string;
  isBlocked: boolean;
  isBlocking: boolean;
  status?: string;
}

interface FriendResponse extends UserPartialResponse {
  isOnline: boolean;
}

interface ChatBasicInfo {
  id: string;
  chatName?: string;
  createdAt: Date;
  showOSNotification: boolean | null;
  playSound: boolean | null;
}

interface UserDetailedResponse extends UserPartialResponse {
  friendsInCommon: UserPartialResponse[];
  chatsInCommon: ChatBasicInfo[];
  friendRequestPending: boolean;
  isFriend: boolean;
}

interface ChatPreview extends ChatBasicInfo {
  lastMessage?: MessagePreview;
  users: UserPartialResponse[];
}

interface ClientConnectionPartialInfo {
  id: string;
  browser: string;
  cityName: string;
  countryIsoCode: string;
  countryName: string;
  device: string;
  geoNameId: string;
  ipAddress: string;
  os: string;
  active: boolean;
  createdAt: Date;
  isCurrentSession: boolean;
}

interface UserConnectionCallInfo {
  id: string;
  avatar?: string;
  userName: string;
  email: string;
  friends: FriendResponse[];
  friendRequests: { userAdding: UserPartialResponse }[];
  blocks: UserPartialResponse[];
  previews: ChatPreview[];
}

interface LockoutInfo {
  lockout: boolean;
  lockoutReason: string;
  lockoutEnd?: Date;
  permanent?: boolean;
}

interface AdminActionRequest {
  reportId: string;
  permanentLockout?: boolean;
  lockoutEnd?: Date;
  violationFound?: boolean;
}

interface AdminActionPartial {
  admin: UserPartialResponse;
  action: string;
  enactedOn: Date;
  revoked: boolean;
}

export type {
  AdminActionPartial,
  AdminActionRequest,
  ChatBasicInfo,
  ChatPreview,
  ClientConnectionPartialInfo,
  FriendResponse,
  LockoutInfo,
  MessagePreview,
  UserConnectionCallInfo,
  UserDetailedResponse,
  UserPartialResponse,
};
