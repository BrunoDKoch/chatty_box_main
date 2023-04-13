import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

const fallbackLocale = 'en';

register('en', async () => await import('./locales/en.json'));
register('es', async () => await import('./locales/es.json'));
register('pt', async () => await import('./locales/pt.json'));
init({
  fallbackLocale,
  initialLocale: browser ? window.navigator.language : fallbackLocale,
});
