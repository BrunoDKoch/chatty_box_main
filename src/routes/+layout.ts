import { browser } from '$app/environment';
import '$lib/i18n';
import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';

export const load = (async (event) => {
  if (event.data.lang) locale.set(event.data.lang);
  else if (browser) {
    locale.set(window.navigator.language);
  }
  await waitLocale();
}) satisfies LayoutLoad;
