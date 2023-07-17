import type { UserPersonalInfo } from '$lib/types/partialTypes';
import type { PageLoad } from './$types';
import { PUBLIC_AUTH_URL_DEV as baseURL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import useUserInfo from '$lib/useUserInfo';

export const ssr = false;
export const csr = true;

export const load = (async ({ data }) => {
  if (!data || !(data as { user: UserPersonalInfo }).user) {
    const userRequest = await fetch(`${baseURL}/user`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    });
    if (!userRequest.ok) {
      throw redirect(303, `/auth/login`);
    }
    const user = await userRequest.json();
    useUserInfo(user);
    return { user };
  }
}) satisfies PageLoad;
