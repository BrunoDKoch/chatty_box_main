import type { Chat, User } from '@prisma/client';

type MessagePreview = {
  from: FriendResponse;
  sentAt: Date;
  text: string;
  read: boolean;
};

interface UserPartialResponse {
  userName: string;
  avatar?: string;
  id: string;
}

interface FriendResponse extends UserPartialResponse {
  isOnline: boolean
};

type ChatPreview = {
  id: string;
  chatName?: string;
  lastMessage?: MessagePreview;
  users: FriendResponse[];
  createdAt: Date;
};

export type { MessagePreview, UserPartialResponse, FriendResponse, ChatPreview };
