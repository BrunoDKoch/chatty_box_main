import type { Chat } from '@prisma/client';
import type { AdminActionPartial, ReadMessagePartialResponse, UserPartialResponse } from './partialTypes';

type MessageResponse = {
  id: string;
  chatId: string;
  sentAt: Date;
  editedAt: Date;
  text: string;
  replyToId?: string;
  readBy: ReadMessagePartialResponse[];
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

interface UserReportPartial {
  id: string;
  reportReason: string;
  sentAt: Date;
  violationFound: boolean | null;
}

interface ReportUserResponse extends UserPartialResponse {
  pastViolations: UserReportPartial[];
  lockoutEnd: string;
}

interface UserReportResponse extends UserReportPartial {
  reportingUser: ReportUserResponse;
  reportedUser: ReportUserResponse;
  message: MessageResponse;
  chat: CompleteChat;
  adminActions: AdminActionPartial[];
}

export type {
  CompleteChat,
  MessageResponse,
  ReportUserResponse,
  SystemMessagePartial,
  UserReportResponse,
};
