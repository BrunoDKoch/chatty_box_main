import type { Cookies } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

function getTheme(cookies: Cookies) {
  let theme = cookies.get('theme') as 'light' | 'dark';
  if (!theme) {
    theme = 'light';
    cookies.set('theme', 'light');
  }
  return theme;
}

function getLanguage(data: { cookies: Cookies; request: Request }) {
  const { cookies, request } = data;
  if (cookies.get('lang')) return cookies.get('lang');
  const lang = request.headers.get('accept-language')!.split(',')[0];
  cookies.set('lang', lang.slice(0, 2));
  return lang;
}

export const load = (({ cookies, request }) => {
  const theme = getTheme(cookies);
  const lang = getLanguage({ cookies, request });
  return { theme, lang };
}) satisfies LayoutServerLoad;
