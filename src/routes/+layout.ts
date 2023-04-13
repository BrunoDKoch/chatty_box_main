import { locale, loadTranslations } from '$lib/translations';
import type { LayoutLoad } from './$types';

export const load = (async ({ url }) => {
  const { pathname } = url;
  const initLocale = locale.get() || 'en';
  await loadTranslations(initLocale, pathname);
  return {};
}) satisfies LayoutLoad;
