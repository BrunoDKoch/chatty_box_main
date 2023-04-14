import { PUBLIC_AUTH_URL_DEV as baseURL } from '$env/static/public';
import type { LogInInfo, SignUpInfo } from '$lib/types/authTypes';
import { ofetch } from 'ofetch';
import { writable, get } from 'svelte/store';
import { goto } from '$app/navigation';
import { PUBLIC_IDENTITY_COOKIE } from '$env/static/public';

async function logIn(body: LogInInfo) {
  return await ofetch(`/User/login`, {
    body,
    mode: 'cors',
    method: 'POST',
    baseURL,
    credentials: 'include',
    async onResponse({ response }) {
      console.log(response);
      if (response.status > 200) {
        throw {
          code: response.status,
          error: { message: response.status, cause: 'Credenciais inválidas' },
        };
      }
      await getCurrentUser(response.headers.get('set-cookie')!);
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

async function getCurrentUser(idCookie: string): Promise<{
  email: string;
  userName: string;
}> {
  return await ofetch<{
    email: string;
    userName: string;
  }>('/User/current', {
    mode: 'cors',
    baseURL,
    credentials: 'include',
    headers: { cookie: `${PUBLIC_IDENTITY_COOKIE}=${idCookie}` },
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
  suspendUser,
  validateEmail,
  currentUser,
};
