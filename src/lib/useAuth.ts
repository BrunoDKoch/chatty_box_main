import { PUBLIC_AUTH_URL_DEV as baseURL } from '$env/static/public';
import type { LogInInfo, SignUpInfo } from '$lib/types/authTypes';
import { ofetch } from 'ofetch';
import { writable, get } from 'svelte/store';
import { goto } from '$app/navigation';

async function logIn(body: LogInInfo) {
  return await ofetch(`/User/login`, {
    body,
    mode: 'cors',
    method: 'POST',
    baseURL,
    credentials: 'include',
    async onResponse({ response }) {
      console.log(response)
      if (response.status > 200) {
        throw {
          code: response.status,
          error: { message: response.status, cause: 'Credenciais inválidas' },
        };
      }
      await getCurrentUser();
      response._data = { code: response.status };
    },
    onResponseError({ response }) {
      throw {
        code: response.status,
        error: { message: response.status, cause: 'Credenciais inválidas' },
      };
    },
  });
}

async function signUp(body: SignUpInfo) {
  return await ofetch(`/User/register`, {
    body,
    method: 'POST',
    mode: 'cors',
    baseURL,
    credentials: 'include',
    onResponseError({ response }) {
      throw {
        code: response.status,
        error: {
          message: response.status,
          cause: 'Este e-mail já está cadastrado!',
        },
      };
    },
  });
}

async function getCurrentUser(): Promise<{
  email: string;
}> {
  return await ofetch<{
    email: string;
    userName: string;
    id: string;
    roles: string[];
  }>('/User/current', {
    mode: 'cors',
    baseURL,
    credentials: 'include',
    onResponse({ response }) {
      if (!response.ok) return;
      const user = response._data;
      currentUser.set({
        ...user,
      });
    },
  });
}
async function logOut() {
  const { data, error } = await ofetch('/User/logout', {
    baseURL,
    method: 'HEAD',
    mode: 'cors',
    credentials: 'include',
    async onResponse() {
      currentUser.set({
        id: '',
        email: '',
        userName: '',
        roles: [],
      });
      await goto('/');
    },
  });
  return { data, error };
}

async function getNewToken() {
  await ofetch(`/User/new`, {
    baseURL,
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    retry: 3,
    onResponse({ response }) {
      if (!response.ok) return;
      setTimeout(async () => await getCurrentUser(), 500);
    },
  });
}

async function suspendUser(body: { reason: string; until?: Date; id: string }) {
  await ofetch('/User/suspend', {
    baseURL,
    method: 'PUT',
    mode: 'cors',
    credentials: 'include',
    body,
    onResponse(ctx) {
      console.log(ctx);
    },
  });
}

async function validateEmail(body: { code: string }) {
  await ofetch('/User/Validate/Email', {
    baseURL,
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    body,
    onResponseError({ response }) {
      console.log(response);
    },
  });
}

const currentUser = writable({
  id: '',
  email: '',
  userName: '',
  roles: [] as string[],
});

export {
  logIn,
  logOut,
  signUp,
  getCurrentUser,
  getNewToken,
  suspendUser,
  validateEmail,
  currentUser,
};
