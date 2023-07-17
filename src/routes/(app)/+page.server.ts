import { redirect, type Actions } from '@sveltejs/kit';
import { PUBLIC_AUTH_URL_DEV as baseURL } from '$env/static/public';

export const actions = {
  async logout({ locals, fetch }) {
    const res = await fetch(`${baseURL}/user/logout`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    });
    if (res.ok) {
      locals.user = undefined;
      throw redirect(303, '/auth/login');
    }
  },
} satisfies Actions;
