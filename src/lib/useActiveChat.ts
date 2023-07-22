import { writable, type Writable } from 'svelte/store';
import type { CompleteChat, MessageResponse } from './types/combinationTypes';
import type { UserPartialResponse } from './types/partialTypes';

export const activeChatId = writable('');

export const chat = writable({
  messages: [] as MessageResponse[],
  users: [] as UserPartialResponse[],
  chatName: '',
  id: '',
  isGroupChat: false,
  createdAt: new Date(),
  userIsAdmin: false,
  messageCount: 0,
  hasMore: false,
  hasFetched: false,
}) as Writable<CompleteChat & { hasMore: boolean; hasFetched: boolean }>;

export const chatNotificationSettings = writable([]) as Writable<
  {
    activeChatId: string;
    showOSNotification: boolean | null;
    playSound: boolean | null;
  }[]
>;
