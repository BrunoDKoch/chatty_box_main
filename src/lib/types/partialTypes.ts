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
}

interface FriendResponse extends UserPartialResponse {
  isOnline: boolean;
}

interface ChatBasicInfo {
  id: string;
  chatName?: string;
  createdAt: Date;
}

interface UserDetailedResponse extends UserPartialResponse {
  friendsInCommon: UserPartialResponse[];
  chatsInCommon: ChatBasicInfo[];
  friendRequestPending: boolean;
}

interface ChatPreview extends ChatBasicInfo {
  lastMessage?: MessagePreview;
  users: UserPartialResponse[];
}

export type {
  MessagePreview,
  UserPartialResponse,
  FriendResponse,
  ChatBasicInfo,
  UserDetailedResponse,
  ChatPreview,
};
