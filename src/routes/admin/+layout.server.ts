import type { LayoutServerLoad } from './$types';
import { PUBLIC_AUTH_URL_DEV as baseURL } from '$env/static/public';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { t } from 'svelte-i18n';

export const load = (async ({ fetch }) => {
  // Check if user is admin
  const adminResponse = await fetch(`${baseURL}/admin/isAdmin`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  });
  const isAdmin = await adminResponse.json();
  if (!isAdmin)
    throw error(403, {
      status: 403,
      cause: '',
      message: 'This area is restricted',
    });
}) satisfies LayoutServerLoad;
