import type { Chat, User } from '@prisma/client';

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
}

export type {
  MessagePreview,
  UserPartialResponse,
  FriendResponse,
  ChatBasicInfo,
  UserDetailedResponse,
  ChatPreview,
  ClientConnectionPartialInfo
};
