import { ofetch } from 'ofetch';
import { PUBLIC_AUTH_URL_DEV as baseURL } from '$env/static/public';
import type { LockoutInfo } from './types/partialTypes';
import { writable } from 'svelte/store';

async function lockUserOut(userId: string, lockoutInfo: LockoutInfo) {
  return await ofetch(`/admin/user/${userId}`, {
    baseURL,
    method: 'PUT',
    mode: 'cors',
    credentials: 'include',
    body: lockoutInfo,
  });
}

async function checkIfAdmin() {
  return await ofetch<boolean>('/admin/isAdmin', {
    baseURL,
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  });
}

const isAdmin = writable(await checkIfAdmin());

export { lockUserOut, checkIfAdmin, isAdmin };
