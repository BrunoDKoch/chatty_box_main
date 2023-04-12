import type { LayoutServerLoad } from './$types';

export const load = (({ cookies }) => {
  let theme = cookies.get('theme') as 'light' | 'dark';
  console.log(theme);
  if (!theme) {
    theme = 'light';
    cookies.set('theme', 'light');
  }
  return { theme };
}) satisfies LayoutServerLoad;
