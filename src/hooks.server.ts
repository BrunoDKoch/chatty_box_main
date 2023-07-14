import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { PUBLIC_AUTH_URL_DEV as baseURL, PUBLIC_SENTRY_URL_DEV } from '$env/static/public';
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
  dsn: PUBLIC_SENTRY_URL_DEV,
  tracesSampleRate: 1.0,
});

export const handleError = (async ({ error, event }) => {
  const errorId = crypto.randomUUID();
  Sentry.captureException(error, { extra: { ...event, errorId } });
  return error as App.Error;
}) satisfies HandleServerError;

export const handle = (async ({ event, resolve }) => {
  const { locals, fetch, url } = event;
  if (!url.pathname.includes('auth') && !locals.user) {
    const userRequest = await fetch(`${baseURL}/user`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    });
    if (!userRequest.ok) {
      const fromUrl = event.url.pathname + event.url.search;
      throw redirect(303, `/auth/login?redirectTo=${fromUrl}`);
    }
    locals.user = await userRequest.json();
  }
  return await resolve(event);
}) satisfies Handle;
