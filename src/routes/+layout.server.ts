import type { Cookies } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { waitLocale } from 'svelte-i18n';

function getTheme(cookies: Cookies) {
  let theme = cookies.get('theme') as 'light' | 'dark';
  if (!theme) {
    theme = 'light';
    cookies.set('theme', 'light', {
      path: '/',
    });
  }
  return theme;
}

function getLanguage(data: { cookies: Cookies; request: Request }) {
  const { cookies, request } = data;
  if (cookies.get('lang')) return cookies.get('lang');
  const lang = request.headers.get('accept-language')!.split(',')[0];
  cookies.set('lang', lang.slice(0, 2), {
    path: '/',
    expires: new Date((new Date()).setFullYear(9999))
  });
  return lang;
}

export const load = (async ({ cookies, request }) => {
  const theme = getTheme(cookies);
  const lang = getLanguage({ cookies, request });
  await waitLocale();
  return { theme, lang };
}) satisfies LayoutServerLoad;
