import { ofetch } from 'ofetch';
import { PUBLIC_AUTH_URL_DEV as baseURL } from '$env/static/public';
import type { AdminActionRequest, LockoutInfo } from './types/partialTypes';
import { writable } from 'svelte/store';

async function checkIfAdmin() {
  return await ofetch<boolean>('/admin/isAdmin', {
    baseURL,
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  });
}

async function postAdminAction(body: AdminActionRequest) {
  return await ofetch('/admin/action', {
    baseURL,
    body,
    method: 'POST',
    mode: 'cors',
    credentials: 'include'
  })
}

const isAdmin = writable(await checkIfAdmin());

export { checkIfAdmin, postAdminAction, isAdmin };
