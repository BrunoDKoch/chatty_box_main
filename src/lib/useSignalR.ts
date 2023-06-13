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
  UserConnectionCallInfo,
} from '$lib/types/partialTypes';
import { chat, chatId, chatNotificationSettings } from './useActiveChat';
import type { CompleteChat, MessageResponse, SystemMessagePartial } from './types/combinationTypes';
import { t } from 'svelte-i18n';
import useUserNotificationSettings from './useUserNotificationSettings';
import { goto } from '$app/navigation';
import useActiveScreen from './useActiveScreen';

export const messagesCount = writable(0);
export const previews = writable([]) as Writable<ChatPreview[]>;
export const friendRequests = writable([]) as Writable<{ userAdding: UserPartialResponse }[]>;
export const friends = writable([]) as Writable<FriendResponse[]>;
export const blockedUsers = writable([]) as Writable<UserPartialResponse[]>;

// Store that establishes if we're still fetching the initial call info
export const fetchingInitialCallInfo = writable(true);

export let connection = new HubConnectionBuilder()
  .withUrl(`${baseURL}/hub/messages`, {
    withCredentials: true,
  })
  .withAutomaticReconnect()
  .build();

chatId.subscribe(async (cId) => {
  if (!connection || connection.state !== HubConnectionState.Connected) return;
  await connection.invoke('GetChat', cId, 0);
});

// Initial call to user
connection.on('connectionInfo', (data: UserConnectionCallInfo) => {
  friends.set(data.friends);
  friendRequests.set(data.friendRequests);
  blockedUsers.set(data.blocks);
  previews.set(data.previews);
  fetchingInitialCallInfo.set(false);
});

connection.on('unread', (data) => {
  data.forEach((n: Message) => messagesCount.set(get(messagesCount) + 1));
});

connection.on('read', (data: { id: string; readBy: UserPartialResponse & { readAt: Date } }) => {
  messagesCount.update((m) => {
    if (!m) return m;
    return m - 1;
  });
  chat.update((c) => {
    if (!c.messages.find((m) => m.id === data.id)) return c;
    if (!data.readBy.userName) return c;
    c.messages.find((m) => m.id === data.id)!.readBy.push({ ...data.readBy });
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

// Handling friends
connection.on('pendingRequests', (data: { userAdding: UserPartialResponse }[]) =>
  friendRequests.set(data),
);

connection.on('friends', (data: FriendResponse[]) => {
  online.set(true);
  console.log(data);
  friends.update((f) => {
    data.forEach((user) => {
      if (!f.find((u) => u.userName === user.userName)) f.push(user);
      else f.find((u) => u.userName === user.userName)!.isOnline = user.isOnline;
    });
    return f;
  });
});

connection.on('newFriend', (data: FriendResponse | null) => {
  if (!data) return;
  friends.update((f) => {
    f.push(data);
    f.sort((a, b) => {
      if (a.userName < b.userName) return -1;
      if (a.userName > b.userName) return 1;
      return 0;
    });
    return f;
  });
});

connection.on('removeFriend', (data: { userId: string; friendId: string }) => {
  const { userId, friendId } = data;
  friends.update((f) => (f = f.filter((friend) => friend.id !== userId && friend.id !== friendId)));
});

// Blocked users
connection.on('blockedUsers', (data: UserPartialResponse[]) => {
  blockedUsers.update((b) => {
    const newItems = data.filter((item) => !b.includes(item));
    b = b.concat(newItems);
    return b;
  });
});

// Get new user status (friends on others in chat)
connection.on('updateStatus', (data: { id: string; online: boolean; status?: string }) => {
  friends.update((f) => {
    console.log(data);
    const { id, online, status } = data;
    f = f.map((u) => {
      if (u.id === id) {
        u.isOnline = online;
        u.status = status;
      }
      return u;
    });
    return f;
  });
});

// New chat created (by user or another member)
connection.on('newChat', (data: CompleteChat) => {
  chat.set({ ...data, hasFetched: false, hasMore: false });
  chatId.set(data.id);
  const { playSound, showOSNotification } = get(useUserNotificationSettings)!;
  const { id, createdAt, chatName, users } = data;
  previews.update((p) => {
    if (p.find((preview) => preview.id === id)) return p;
    p.push({
      id,
      chatName: chatName ?? undefined,
      playSound,
      showOSNotification,
      createdAt,
      users,
    });
    return p;
  });
});

// Get chat info
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
    console.log(ch);
    return ch;
  });
});

// Add system message to chat
connection.on('systemMessage', (data: SystemMessagePartial) => {
  chat.update((ch) => {
    if (ch.id !== data.chatId) return ch;
    ch.systemMessages.push(data);
    return ch;
  });
});

// Edit message
connection.on('editedMessage', (data: MessageResponse) => {
  chat.update((ch) => {
    if (ch.id !== data.chatId || !ch.messages.map((m) => m.id).includes(data.id)) return ch;
    const message = ch.messages.find((m) => m.id === data.id)!;
    message.text = data.text;
    message.editedAt = data.editedAt;
    return ch;
  });
});

// Handling chat members
connection.on('addedAsAdmin', (data: string) => {
  if (get(chatId) === data) {
    chat.update((c) => {
      c.admins.push(c.users.find((u) => u.id === c.systemMessages.at(-1)!.affectedUser!.id)!);
      c.userIsAdmin = true;
      return c;
    });
  }
});

connection.on('addedToChat', (data: ChatPreview) => {
  previews.update((p) => {
    p.push(data);
    return p;
  });
});

connection.on('removedFromChat', (data: string) => {
  if (get(useActiveScreen) === 'chat' && get(chatId) === data) {
    useActiveScreen.update((screen) => (screen = 'friends'));
  }
  previews.update((p) => (p = p.filter((c) => c.id !== data)));
});

// Notifications
connection.on('notificationSettings', (data: UserNotificationSettings) => {
  useUserNotificationSettings.update((un) => {
    un = data;
    return un;
  });
});

// Blocking
connection.on('blockToggle', (data: { id: string; blocked: boolean }) => {
  const { id, blocked } = data;
  blockedUsers.update((b) => {
    if (!blocked) {
      b = b.filter((u) => u.id !== id);
      return b;
    }
    const user =
      get(friends).find((u) => u.id === id) ??
      get(previews).find((p) => p.users.find((u) => u.id === id))?.users[0];
    if (!user) return b;
    b.push(user);
    return b;
  });
});
export const online = writable(connection.state === HubConnectionState.Connected);
connection.onreconnected(() => online.set(true));
connection.onreconnecting(() => online.set(false));

connection.onclose(() => online.set(false));
