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
      if (response.ok) {
        await checkIfLoggedIn();
      }
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

async function checkIfLoggedIn(): Promise<boolean> {
  return await ofetch<boolean>('/User/LoggedIn', {
    mode: 'cors',
    baseURL,
    credentials: 'include',
  });
}
async function logOut() {
  const { data, error } = await ofetch('/User/logout', {
    baseURL,
    method: 'HEAD',
    mode: 'cors',
    credentials: 'include',
    async onResponse() {
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

async function validateEmail(body: { email: string, code: string }) {
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
  checkIfLoggedIn,
  suspendUser,
  validateEmail,
  getRecoveryToken,
  recoverPassword,
  currentUser,
};
