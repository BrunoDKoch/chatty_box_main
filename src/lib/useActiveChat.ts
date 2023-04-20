import type { Message, User } from '@prisma/client';
import { writable, type Writable } from 'svelte/store';
import type { CompleteChat, MessageResponse } from './types/combinationTypes';

export const chatId = writable('');

export const chat = writable({
  messages: [] as MessageResponse[],
  users: [] as User[],
  chatName: '',
  id: '',
  isGroupChat: false,
  createdAt: new Date(),
}) as Writable<CompleteChat>;
