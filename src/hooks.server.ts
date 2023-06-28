import type { Handle, HandleServerError } from '@sveltejs/kit';
import { PUBLIC_AUTH_URL_DEV as baseURL } from '$env/static/public';
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
  dsn: 'http://a51c3be9ce9f4a44802466bb29be3fcf@localhost:9000/1',
  tracesSampleRate: 1.0,
});

export const handleError = (async ({ error, event }) => {
  const errorId = crypto.randomUUID();
  Sentry.captureException(error, { extra: { event, errorId } });
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
    if (userRequest.ok) locals.user = await userRequest.json();
  }
  return await resolve(event);
}) satisfies Handle;
