import type { UserDetailedResponse } from './types/partialTypes';
import { connection } from './useSignalR';

export default async function (userId: string): Promise<UserDetailedResponse> {
  return await connection.invoke<UserDetailedResponse>('ToggleBlock', userId);
}
