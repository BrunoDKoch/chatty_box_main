export const ssr = false;
import type { Cookies } from '@sveltejs/kit';
import { locale, locales, waitLocale } from 'svelte-i18n';
import { get } from 'svelte/store';
import type { LayoutServerLoad } from './$types';

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

function getLanguage(data: { cookies: Cookies; request: Request }): string {
  const { cookies, request } = data;
  if (cookies.get('lang')) return cookies.get('lang') as string;
  const lang = request.headers.get('accept-language')!.split(',')[0];
  const existingLocale = get(locales).find((l) => lang.startsWith(l));
  cookies.set('lang', existingLocale ?? 'en', {
    path: '/',
    expires: new Date(new Date().setFullYear(9999)),
  });
  locale.set(existingLocale ?? 'en');
  return lang ?? 'en';
}

export const load = (async ({ cookies, request, url, locals, fetch }) => {
  const theme = getTheme(cookies);
  const lang = getLanguage({ cookies, request });
  await waitLocale(lang);
  locals.language = getLanguage({ cookies, request });
  return { theme, lang };
}) satisfies LayoutServerLoad;
