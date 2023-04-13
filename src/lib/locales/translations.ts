import i18n from 'sveltekit-i18n';

/** @type {import('sveltekit-i18n').Config} */
const config = {
  loaders: [
    // common
    {
      locale: 'en',
      key: 'common',
      loader: async () => await import('./en/common.json'),
    },
    {
      locale: 'es',
      key: 'common',
      loader: async () => await import('./es/common.json'),
    },
    {
      locale: 'pt',
      key: 'common',
      loader: async () => await import('./pt/common.json'),
    },
    // auth
    {
      locale: 'en',
      key: 'auth',
      routes: ['/auth/login', '/auth/signup'],
      loader: async () => await import('./en/auth.json'),
    },
    {
      locale: 'es',
      key: 'auth',
      routes: ['/auth/login', '/auth/signup'],
      loader: async () => await import('./es/auth.json'),
    },
    {
      locale: 'pt',
      key: 'auth',
      routes: ['/auth/login', '/auth/signup'],
      loader: async () => await import('./pt/auth.json'),
    },
  ],
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);