import type { Chat, Message, ReadMessage, User } from '@prisma/client';
import type { UserPartialResponse } from './partialTypes';

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
  users: UserPartialResponse[];
  messages: MessageResponse[];
  messageCount: number;
}

export type { CompleteChat, MessageResponse };
