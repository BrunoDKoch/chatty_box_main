import type { Chat, User } from '@prisma/client';

type MessagePreview = {
  from: User;
  sentAt: Date;
  text: string;
  read: boolean;
};

type FriendResponse = { userName: string; isOnline: boolean; avatar?: string; userId: string };

type ChatPreview = {
  id: string;
  chatName?: string;
  lastMessage?: MessagePreview;
  users: User[];
  createdAt: Date;
};

export type { MessagePreview, FriendResponse, ChatPreview };
