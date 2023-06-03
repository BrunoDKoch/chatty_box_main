import type { Cookies } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { locales, waitLocale } from 'svelte-i18n';
import { get } from 'svelte/store';

function getTheme(cookies: Cookies) {
  let theme = cookies.get('theme') as 'light' | 'dark';
  if (!theme) {
    theme = 'dark';
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
  const existingLocale = get(locales).find((l) => lang.startsWith(l));
  console.log({existingLocale})
  cookies.set('lang', existingLocale ?? 'en', {
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
