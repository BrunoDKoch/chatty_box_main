import { HubConnectionBuilder } from '@microsoft/signalr';
import { PUBLIC_AUTH_URL_DEV as baseURL } from '$env/static/public';
import { currentUser } from '$lib/useAuth';
import type { Message } from '@prisma/client';
import { get, writable, type Writable } from 'svelte/store';
import type { MessagePreview } from '$lib/types/partialTypes';

export const messagesCount = writable(0);
export const previews = writable([]) as Writable<MessagePreview[]>;

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
connection.onclose(() => console.log('Hub closed'));
