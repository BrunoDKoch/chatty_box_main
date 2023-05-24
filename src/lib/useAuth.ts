import { PUBLIC_AUTH_URL_DEV as baseURL } from '$env/static/public';
import type { LogInInfo, SignUpInfo } from '$lib/types/authTypes';
import { ofetch } from 'ofetch';
import { writable, get, type Writable } from 'svelte/store';
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
      console.log(response)
      if (response.ok) {
        accessToken.save(response._data!.token);
        await checkIfLoggedIn();
      }
    },
    onResponseError({ response }) {
      throw {
        status: response.status,
        message: response._data,
        cause: response.status,
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

async function checkIfLoggedIn(): Promise<boolean> {
  return await ofetch<boolean>('/User/LoggedIn', {
    mode: 'cors',
    baseURL,
    credentials: 'include',
    headers: { authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    async onResponseError() {
      await goto('/auth/login');
    },
    onResponse(ctx) {
      console.log(ctx);
      accessToken.save(ctx.response._data!.token);
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
      accessToken.discard();
      await goto('/auth/login', {
        invalidateAll: true,
        replaceState: true,
      });
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
  });
}

async function validateEmail(body: { email: string; code: string }) {
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

async function getRecoveryToken(body: { email: string }) {
  return await ofetch('/user/recovery', {
    baseURL,
    body,
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  });
}

async function recoverPassword(body: { password: string; email: string; token: string }) {
  return await ofetch('/user/recovery', {
    baseURL,
    body,
    method: 'PUT',
    mode: 'cors',
    credentials: 'include',
    onResponse({ response }) {
      console.log(response);
    },
  });
}

function createAccessToken() {
  const { subscribe, set, update } = writable(null) as Writable<string | null>;
  return {
    subscribe,
    set,
    update,
    read() {
      set(localStorage ? localStorage.getItem('accessToken') : null);
    },
    save(newToken: string) {
      set(newToken);
      localStorage.setItem('accessToken', newToken);
    },
    discard() {
      set(null);
      localStorage.removeItem('accessToken');
    },
  };
}

const currentUser = writable({
  id: '',
  email: '',
  userName: '',
  roles: [] as string[],
});

const accessToken = createAccessToken();

export {
  logIn,
  logOut,
  signUp,
  checkIfLoggedIn,
  suspendUser,
  validateEmail,
  getRecoveryToken,
  recoverPassword,
  currentUser,
  accessToken,
};
