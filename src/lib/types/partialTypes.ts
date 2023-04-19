import type { Chat, User } from '@prisma/client';

type MessagePreview = {
  from: User;
  sentAt: Date;
  text: string;
  chat: Chat;
};

type FriendResponse = { userName: string; isOnline: boolean; avatar?: string; userId: string };

export type { MessagePreview, FriendResponse };
