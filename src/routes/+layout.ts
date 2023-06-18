import { browser } from '$app/environment';
import '$lib/i18n';
import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';

export const ssr = false;
export const csr = true;

export const load = (async (event) => {
  if (event.data.lang) locale.set(event.data.lang.slice(0, 2));
  else if (browser) {
    locale.set(window.navigator.language.slice(0, 2));
  }
  await waitLocale();
}) satisfies LayoutLoad;
