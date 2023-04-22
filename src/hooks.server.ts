import { redirect, type Cookies, type Handle, type RequestEvent } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';
import { PUBLIC_IDENTITY_COOKIE } from '$env/static/public';
import { getCurrentUser } from '$lib/useAuth';

function setLanguage(lang?: string) {
  if (lang) {
    locale.set(lang);
  }
}

async function getUser(event: RequestEvent) {
  const { cookies, url } = event;
  const idCookie = cookies.get(PUBLIC_IDENTITY_COOKIE);
  if (event.url.pathname.startsWith('/auth')) {
    if (idCookie) cookies.delete(PUBLIC_IDENTITY_COOKIE);
    return;
  }
  if (!idCookie) throw redirect(303, '/auth/login');
  try {
    const user = await getCurrentUser(idCookie);
    if (!user && !url.pathname.startsWith('/auth')) throw redirect(303, '/auth/login');
  } catch {
    if (idCookie) cookies.delete(PUBLIC_IDENTITY_COOKIE);
    else throw redirect(303, '/auth/login');
  }
}

export const handle: Handle = async ({ event, resolve }) => {
  const lang = event.request.headers.get('accept-language')?.split(',')[0];
  setLanguage(lang);
  try {
    await getUser(event);
    return resolve(event);
  } catch {
    throw redirect(303, '/auth/login');
  }
};
