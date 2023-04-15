import type { Chat, User } from '@prisma/client';

type MessagePreview = {
  from: User;
  sentAt: Date;
  text: string;
  chat: Chat;
};

export type { MessagePreview };
