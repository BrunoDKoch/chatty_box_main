import { HubConnectionBuilder } from '@microsoft/signalr';
import { PUBLIC_AUTH_URL_DEV as baseURL } from '$env/static/public';
import { currentUser } from '$lib/useAuth';
import type { FriendRequest, Message, User } from '@prisma/client';
import { get, writable, type Writable } from 'svelte/store';
import type { MessagePreview, FriendResponse, ChatPreview } from '$lib/types/partialTypes';
import { chat } from './useActiveChat';
import type { CompleteChat, MessageResponse } from './types/combinationTypes';

export const messagesCount = writable(0);
export const previews = writable([]) as Writable<ChatPreview[]>;
export const friendRequests = writable([]) as Writable<(FriendRequest & { userAdding: User })[]>;
export const friends = writable([]) as Writable<FriendResponse[]>;

export let connection = new HubConnectionBuilder()
  .withUrl(`${baseURL}/hub/messages`)
  .withAutomaticReconnect()
  .build();
connection.on('unread', (data) => {
  data.forEach((n: Message) => messagesCount.set(get(messagesCount) + 1));
});
connection.on('newMessage', () => get(messagesCount) + 1);
connection.on('read', () => get(messagesCount) - 1);
connection.on('previews', (data: ChatPreview[]) => previews.set(data));
connection.on('pendingRequests', (data: (FriendRequest & { userAdding: User })[]) =>
  friendRequests.set(data),
);
connection.on('friends', (data: FriendResponse[]) => {
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
    f.map((u) => {
      if (u.userId === data) u.isOnline = !u.isOnline;
    });
    return f;
  });
});
connection.on('newChat', (data: CompleteChat) => chat.set(data));

connection.onclose(() => console.log('Hub closed'));
