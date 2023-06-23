import type { RequestHandler } from './$types';

export const GET = (async ({ url, cookies }) => {
  const theme = url.searchParams.get('theme')!;
  const now = new Date(Date.now());
  cookies.set('theme', theme, {
    path: '/',
    sameSite: true,
    expires: new Date(now.setUTCDate(now.getUTCDate() + 99999)),
  });
  return new Response();
}) satisfies RequestHandler;
