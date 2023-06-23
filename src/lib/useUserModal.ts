import { type Writable, writable } from 'svelte/store';
import type { UserDetailedResponse, UserPartialResponse } from './types/partialTypes';
import { connection } from './useSignalR';

export default writable(null) as Writable<UserDetailedResponse | null>;

export async function updateUser(user: UserPartialResponse) {
  return await connection.invoke<UserDetailedResponse>('GetUserDetails', user.id);
}
