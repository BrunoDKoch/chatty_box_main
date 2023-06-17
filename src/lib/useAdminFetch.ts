import { ofetch } from 'ofetch';
import { PUBLIC_AUTH_URL_DEV as baseURL } from '$env/static/public';
import type { LockoutInfo } from './types/partialTypes';

async function lockUserOut(userId: string, lockoutInfo: LockoutInfo) {
  return await ofetch(`/admin/user/${userId}`, {
    baseURL,
    method: 'PUT',
    mode: 'cors',
    credentials: 'include',
    body: lockoutInfo,
  });
}

export { lockUserOut };
