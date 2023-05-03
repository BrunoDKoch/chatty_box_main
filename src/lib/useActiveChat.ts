import type { Message, User } from '@prisma/client';
import { writable, type Writable } from 'svelte/store';
import type { CompleteChat, MessageResponse } from './types/combinationTypes';
import { connection } from './useSignalR';
import type { UserPartialResponse } from './types/partialTypes';

export const chatId = writable('');

export const chat = writable({
  messages: [] as MessageResponse[],
  users: [] as UserPartialResponse[],
  chatName: '',
  id: '',
  isGroupChat: false,
  createdAt: new Date(),
  messageCount: 0,
}) as Writable<CompleteChat>;
