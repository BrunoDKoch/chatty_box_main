import type { Chat, ChatNotificationSettings, Message, ReadMessage, User } from '@prisma/client';
import type { UserPartialResponse } from './partialTypes';

type MessageResponse = {
  id: string;
  chatId: string;
  sentAt: Date;
  editedAt: Date;
  text: string;
  replyToId?: string;
  readBy: { userName: string; avatar?: string; id: string; readAt: Date }[];
  user: UserPartialResponse;
  isFromCaller: boolean;
};

type SystemMessagePartial = {
  id: string;
  chatId: string;
  eventType: string;
  firedAt: Date;
  instigatingUser: UserPartialResponse;
  affectedUser?: UserPartialResponse;
};

interface CompleteChat extends Chat {
  admins: UserPartialResponse[];
  users: UserPartialResponse[];
  messages: MessageResponse[];
  messageCount: number;
  userIsAdmin: boolean;
  systemMessages: SystemMessagePartial[];
}

export type { CompleteChat, SystemMessagePartial, MessageResponse };
