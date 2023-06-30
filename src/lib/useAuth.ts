import { PUBLIC_AUTH_URL_DEV as baseURL } from '$env/static/public';
import type { LogInInfo, SignUpInfo } from '$lib/types/authTypes';
import { ofetch } from 'ofetch';
import { goto } from '$app/navigation';
import { connection, online } from './useSignalR';

async function logIn(body: LogInInfo) {
  return await ofetch(`/User/login`, {
    body,
    mode: 'cors',
    method: 'POST',
    baseURL,
    credentials: 'include',
    async onResponse({ response }) {
      if (response.ok) {
        await connection.start();
        online.set(true);
        await goto('/');
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
        status: response.status,
        message: response._data,
        cause: response._data,
      };
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
      await connection.stop();
      return await goto('/auth/login');
    },
  });
  return { data, error };
}

async function getUser() {
  return await ofetch('/user', {
    baseURL,
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  });
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
      if (response.ok) return goto('/');
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
  });
}

async function startMFADisabling() {
  return await ofetch('/user/mfa/disable', {
    baseURL,
    method: 'PUT',
    mode: 'cors',
    credentials: 'include',
  });
}

async function finishMFADisabling(body: { password: string }) {
  return await ofetch('/user/mfa/disable', {
    baseURL,
    method: 'POST',
    body,
    mode: 'cors',
    credentials: 'include',
  });
}

async function changeEmail(body: { currentEmail: string; newEmail: string; password: string }) {
  return await ofetch('/user/change/email', {
    baseURL,
    method: 'POST',
    body,
    mode: 'cors',
    credentials: 'include',
  });
}

async function changePassword(body: { currentPassword: string; newPassword: string }) {
  return await ofetch('/user/change/password', {
    baseURL,
    method: 'POST',
    body,
    mode: 'cors',
    credentials: 'include',
  });
}

export {
  logIn,
  logOut,
  signUp,
  getUser,
  suspendUser,
  validateEmail,
  getRecoveryToken,
  recoverPassword,
  startMFADisabling,
  finishMFADisabling,
  changeEmail,
  changePassword,
};
