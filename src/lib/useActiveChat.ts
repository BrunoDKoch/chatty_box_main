import type { Message, User } from '@prisma/client';
import { writable, type Writable } from 'svelte/store';
import type { CompleteChat, MessageResponse } from './types/combinationTypes';
import { connection } from './useSignalR';
import type { UserPartialResponse } from './types/partialTypes';
import { HubConnectionState } from '@microsoft/signalr';

export const chatId = writable('');

export const chat = writable({
  messages: [] as MessageResponse[],
  users: [] as UserPartialResponse[],
  chatName: '',
  id: '',
  isGroupChat: false,
  createdAt: new Date(),
  messageCount: 0,
  hasMore: false,
  hasFetched: false,
}) as Writable<CompleteChat & { hasMore: boolean; hasFetched: boolean }>;
