import {
  HubConnectionBuilder,
  HubConnectionState,
  type IHttpConnectionOptions,
} from '@microsoft/signalr';
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
import type {
  MessagePreview,
  FriendResponse,
  ChatPreview,
  UserPartialResponse,
} from '$lib/types/partialTypes';
import { chat, chatId, chatNotificationSettings } from './useActiveChat';
import type { CompleteChat, MessageResponse, SystemMessagePartial } from './types/combinationTypes';
import { t } from 'svelte-i18n';
import useUserNotificationSettings from './useUserNotificationSettings';
import { goto } from '$app/navigation';

export const messagesCount = writable(0);
export const previews = writable([]) as Writable<ChatPreview[]>;
export const friendRequests = writable([]) as Writable<{ userAdding: UserPartialResponse }[]>;
export const friends = writable([]) as Writable<FriendResponse[]>;
export const blockedUsers = writable([]) as Writable<UserPartialResponse[]>;

export let connection = new HubConnectionBuilder()
  .withUrl(`${baseURL}/hub/messages`, {
    accessTokenFactory() {
      if (!localStorage) return '';
      return localStorage.getItem('accessToken') ?? '';
    },
    withCredentials: true,
  })
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
connection.on('previews', (data: ChatPreview[]) => {
  previews.set(data);
  chatNotificationSettings.update((cn) => {
    cn = data.map((preview) => {
      const { showOSNotification, playSound, id: chatId } = preview;
      return {
        showOSNotification,
        playSound,
        chatId,
      };
    });
    return cn;
  });
});
connection.on('pendingRequests', (data: { userAdding: UserPartialResponse }[]) =>
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
connection.on('blockedUsers', (data: UserPartialResponse[]) => {
  blockedUsers.update((b) => {
    const newItems = data.filter((item) => !b.includes(item));
    b = b.concat(newItems);
    return b;
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

connection.on('systemMessage', (data: SystemMessagePartial) => {
  chat.update((ch) => {
    if (ch.id !== data.chatId) return ch;
    ch.systemMessages.push(data);
    return ch;
  });
});

connection.on('editedMessage', (data: MessageResponse) => {
  console.log(data)
  chat.update((ch) => {
    if (ch.id !== data.chatId || !ch.messages.map((m) => m.id).includes(data.id)) return ch;
    const message = ch.messages.find((m) => m.id === data.id)!;
    message.text = data.text;
    message.editedAt = data.editedAt;
    return ch;
  });
});

export const online = writable(connection.state === HubConnectionState.Connected);
connection.onreconnected(() => online.set(true));
connection.onreconnecting(() => online.set(false));

connection.onclose(() => online.set(false));
