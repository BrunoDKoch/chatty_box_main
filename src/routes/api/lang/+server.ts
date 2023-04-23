import type { RequestHandler } from './$types';

export const PUT = (async ({ request, cookies }) => {
  const body = await request.json();
  cookies.set('lang', body.lang, {
    expires: new Date(new Date().setFullYear(9999)),
    path: '/',
  });
  return new Response();
}) satisfies RequestHandler;
