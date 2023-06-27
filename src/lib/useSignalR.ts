import { PUBLIC_AUTH_URL_DEV as baseURL } from '$env/static/public';
import type {
  AdminActionPartial,
  ChatPreview,
  FriendResponse,
  UserConnectionCallInfo,
  UserPartialResponse,
} from '$lib/types/partialTypes';
import { logOut } from '$lib/useAuth';
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import type { Message, UserNotificationSettings } from '@prisma/client';
import { get, writable, type Writable } from 'svelte/store';
import type { CompleteChat, MessageResponse, SystemMessagePartial } from './types/combinationTypes';
import { chat, chatId, chatNotificationSettings } from './useActiveChat';
import useActiveScreen from './useActiveScreen';
import { reports } from './useAdminFetch';
import useUserNotificationSettings from './useUserNotificationSettings';

export const messagesCount = writable(0);
export const previews = writable([]) as Writable<ChatPreview[]>;
export const friendRequests = writable([]) as Writable<{ userAdding: UserPartialResponse }[]>;
export const friends = writable([]) as Writable<FriendResponse[]>;
export const blockedUsers = writable([]) as Writable<UserPartialResponse[]>;

// Store that establishes if we're still fetching the initial call info
export const fetchingInitialCallInfo = writable(true);

export const connection = new HubConnectionBuilder()
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
connection.on('newChat', (data: ChatPreview) => {
  const { playSound, showOSNotification } = get(useUserNotificationSettings)!;
  const { id, createdAt, chatName, users } = data;
  chatNotificationSettings.update((cn) => {
    cn.push({
      chatId: id,
      playSound,
      showOSNotification,
    });
    return cn;
  });
  previews.update((p) => {
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
    // If chat isn't loaded, fetch full data. Else, grab messages
    if (!ch.messages || !ch.messages.length) {
      ch = { ...data, hasFetched: false, hasMore: false };
    } else if (ch.id !== data.id) {
      chatId.set(data.id);
      ch = { ...data, hasFetched: false, hasMore: false };
    } else {
      // This loop is not super efficient (O(n)?), but it prevents duplicates
      data.messages.forEach((message) => {
        if (!ch.messages.find((m) => m.id === message.id)) ch.messages.push(message);
      });
      ch.hasFetched = true;
    }
    ch.hasMore = ch.messageCount > ch.messages.length;
    // Sort messages properly
    ch.messages.sort((a, b) => Number(new Date(a.sentAt)) - Number(new Date(b.sentAt)));
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

// Delete message
connection.on('messageDeleted', (data: string) => {
  chat.update((c) => {
    const message = c.messages.find((m) => m.id === data);
    if (!message) return c;
    c.messages = c.messages.filter((m) => m !== message);
    return c;
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

// Force log out
connection.on('forceLogOut', async () => await logOut());

// Handle reports
connection.on('updateReport', (data: { id: string; violationFound: boolean }) => {
  reports.update((r) => {
    const relevantReport = r.find((report) => report.id === data.id);
    if (!relevantReport) return r;
    relevantReport.violationFound = data.violationFound;
    return r;
  });
});

connection.on('action', (data: { reportId: string; actionPartial: AdminActionPartial }) => {
  reports.update((r) => {
    r.find((report) => report.id === data.reportId)?.adminActions.push(data.actionPartial);
    return r;
  });
});

// Handle user changes
connection.on('newAvatar', (data: { userId: string; avatar: string }) => {
  const { userId, avatar } = data;
  previews.update((p) => {
    p.map((preview) => {
      if (!preview.lastMessage) return preview;
      if (preview.lastMessage.from.id !== userId) return preview;
      preview.lastMessage.from.avatar = avatar;
      return preview;
    });
    return p;
  });
  chat.update((c) => {
    if (!c.users.find((u) => u.id === userId)) return c;
    c.messages.map((m) => {
      if (m.user.id !== userId) return m;
      m.user.avatar = avatar;
      return m;
    });
    return c;
  });
  friends.update((f) => {
    const friendToUpdate = f.find((friend) => friend.id === userId);
    if (!friendToUpdate) return f;
    friendToUpdate.avatar = avatar;
    return f;
  });
  blockedUsers.update((b) => {
    const userToUpdate = b.find((u) => u.id === userId);
    if (!userToUpdate) return b;
    userToUpdate.avatar = avatar;
    return b;
  });
});

connection.on('newUserName', (data: { userId: string; userName: string }) => {
  const { userId, userName } = data;
  previews.update((p) => {
    p.map((preview) => {
      if (!preview.lastMessage) return preview;
      if (preview.lastMessage.from.id !== userId) return preview;
      preview.lastMessage.from.userName = userName;
      return preview;
    });
    return p;
  });
  chat.update((c) => {
    if (!c.users.find((u) => u.id === userId)) return c;
    c.messages.map((m) => {
      if (m.user.id !== userId) return m;
      m.user.userName = userName;
      return m;
    });
    return c;
  });
  friends.update((f) => {
    const friendToUpdate = f.find((friend) => friend.id === userId);
    if (!friendToUpdate) return f;
    friendToUpdate.userName = userName;
    return f;
  });
  blockedUsers.update((b) => {
    const userToUpdate = b.find((u) => u.id === userId);
    if (!userToUpdate) return b;
    userToUpdate.userName = userName;
    return b;
  });
});

export const online = writable(connection.state === HubConnectionState.Connected);
connection.onreconnected(() => online.set(true));
connection.onreconnecting(() => online.set(false));

connection.onclose(() => online.set(false));
