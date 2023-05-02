import type { Chat, Message, ReadMessage, User } from '@prisma/client';

type MessageResponse = {
  id: string,
  chatId: string,
  sentAt: Date,
  editedAt: Date,
  text: string,
  replyToId?: string,
  readBy: { userName: string; avatar?: string; id: string; readAt: Date }[];
  user: User;
  isFromCaller: boolean;
};

interface CompleteChat extends Chat {
  users: User[];
  messages: MessageResponse[];
  messageCount: number;
}

export type { CompleteChat, MessageResponse };
