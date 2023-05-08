import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { PUBLIC_AUTH_URL_DEV as baseURL } from '$env/static/public';
import { currentUser } from '$lib/useAuth';
import type {
  FriendRequest,
  Message,
  ReadMessage,
  User,
  UserNotificationSettings,
} from '@prisma/client';
import { get, writable, type Writable } from 'svelte/store';
import type { MessagePreview, FriendResponse, ChatPreview, UserPartialResponse } from '$lib/types/partialTypes';
import { chat, chatId } from './useActiveChat';
import type { CompleteChat, MessageResponse } from './types/combinationTypes';
import { t } from 'svelte-i18n';
import useUserNotificationSettings from './useUserNotificationSettings';

export const messagesCount = writable(0);
export const previews = writable([]) as Writable<ChatPreview[]>;
export const friendRequests = writable([]) as Writable<({ userAdding: UserPartialResponse })[]>;
export const friends = writable([]) as Writable<FriendResponse[]>;

export let connection = new HubConnectionBuilder()
  .withUrl(`${baseURL}/hub/messages`)
  .withAutomaticReconnect()
  .build();

chatId.subscribe(async (cId) => {
  if (!connection || connection.state !== HubConnectionState.Connected) return;
  await connection.invoke('GetChat', cId, 0);
});

connection.on('unread', (data) => {
  data.forEach((n: Message) => messagesCount.set(get(messagesCount) + 1));
});

connection.on('read', (data: ReadMessage & { user: User }) => {
  messagesCount.update((m) => {
    if (!m) return m;
    return m - 1;
  });
  chat.update((c) => {
    const { readAt, user, messageId: id } = data;
    c.messages = c.messages.map((m) => {
      m.readBy.push({ readAt, userName: user.userName!, id });
      return m;
    });
    return c;
  });
});
connection.on('previews', (data: ChatPreview[]) => previews.set(data));
connection.on('pendingRequests', (data: ({ userAdding: UserPartialResponse })[]) =>
  friendRequests.set(data),
);
connection.on('friends', (data: FriendResponse[]) => {
  online.set(true);
  friends.update((f) => {
    data.forEach((user) => {
      if (!f.find((u) => u.userName === user.userName)) f.push(user);
      else f.find((u) => u.userName === user.userName)!.isOnline = user.isOnline;
    });
    return f;
  });
});
connection.on('updateStatus', (data: string) => {
  friends.update((f) => {
    f = f.map((u) => {
      if (u.id === data) u.isOnline = !u.isOnline;
      return u;
    });
    return f;
  });
});
connection.on('newChat', (data: CompleteChat) =>
  chat.set({ ...data, hasFetched: false, hasMore: false }),
);

connection.on('notificationSettings', (data: UserNotificationSettings) => {
  useUserNotificationSettings.update((un) => {
    un = data;
    return un;
  });
});

connection.on('chat', (data: CompleteChat) => {
  chat.update((ch) => {
    const hasMore = data.messageCount > ch.messages.length;
    // If chat isn't loaded, fetch full data. Else, grab messages
    if (!ch.messages || !ch.messages.length) {
      ch = { ...data, hasFetched: false, hasMore };
    } else if (ch.id !== data.id) {
      chatId.set(data.id);
      ch = { ...data, hasFetched: false, hasMore };
    } else {
      // This loop is not super efficient (O(n)?), but it prevents duplicates
      data.messages.forEach((message) => {
        if (!ch.messages.find((m) => m.id === message.id)) ch.messages.push(message);
      });
      ch.hasFetched = true;
      ch.hasMore = hasMore;
    }
    // Sort messages properly
    ch.messages.sort((a, b) => Number(new Date(a.sentAt)) - Number(new Date(b.sentAt)));
    return ch;
  });
});

export const online = writable(connection.state === HubConnectionState.Connected);
connection.onreconnected(() => online.set(true));
connection.onreconnecting(() => online.set(false));

connection.onclose(() => online.set(false));
