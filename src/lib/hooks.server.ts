import { locale } from '$lib/locales/translations';
import type { Handle, Cookies } from '@sveltejs/kit';

function getLanguage(data: { cookies: Cookies; request: Request }) {
  const { cookies, request } = data;
  if (cookies.get('lang')) return cookies.get('lang')!;
  const lang = request.headers.get('accept-language')!.split(',')[0].slice(0, 2);
  cookies.set('lang', lang);
  return lang;
}

export const handle = (async ({ event, resolve }) => {
  const { cookies, request } = event;
  const lang = getLanguage({ cookies, request });
  locale.set(lang);
  event.locals.language = lang;
  return await resolve(event);
}) satisfies Handle;
