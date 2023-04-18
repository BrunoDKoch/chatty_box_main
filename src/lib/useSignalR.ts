import { HubConnectionBuilder } from '@microsoft/signalr';
import { PUBLIC_AUTH_URL_DEV as baseURL } from '$env/static/public';
import { currentUser } from '$lib/useAuth';
import type { FriendRequest, Message, User } from '@prisma/client';
import { get, writable, type Writable } from 'svelte/store';
import type { MessagePreview } from '$lib/types/partialTypes';

export const messagesCount = writable(0);
export const previews = writable([]) as Writable<MessagePreview[]>;
export const friendRequests = writable([]) as Writable<(FriendRequest & { userAdding: User })[]>;
export const friends = writable([]) as Writable<{ userName: string; isOnline: boolean }[]>;

export let connection = new HubConnectionBuilder()
  .withUrl(`${baseURL}/hub/messages`)
  .withAutomaticReconnect()
  .build();
connection.on('unread', (data) => {
  data.forEach((n: Message) => messagesCount.set(get(messagesCount) + 1));
});
connection.on('newMessage', () => get(messagesCount) + 1);
connection.on('read', () => get(messagesCount) - 1);
connection.on('chatMessages', (data: Message[]) => data);
connection.on('previews', (data: MessagePreview[]) => previews.set(data));
connection.on('pendingRequests', (data: (FriendRequest & { userAdding: User })[]) =>
  friendRequests.set(data),
);
connection.on('friends', (data: { userName: string; isOnline: boolean }[]) => {
  console.log({ data });
  friends.update((f) => {
    data.forEach((user) => {
      if (!f.find((u) => u.userName === user.userName)) f.push(user);
      else f.find((u) => u.userName === user.userName)!.isOnline = user.isOnline;
    });
    return f;
  });
});
connection.onclose(() => console.log('Hub closed'));
