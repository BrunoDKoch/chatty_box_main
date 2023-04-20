import type { Chat, Message, User } from '@prisma/client';

type MessageResponse = {
  message: Message;
  user: User;
  isFromCaller: boolean;
};

interface CompleteChat extends Chat {
  users: User[];
  messages: MessageResponse[];
}

export type { CompleteChat, MessageResponse };
