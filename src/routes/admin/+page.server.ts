import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  if (!locals.user || !locals.user.isAdmin)
    throw error(403, {
      status: 403,
      cause: 'error.cause.403',
      message: 'admin.title',
    });
}) satisfies PageServerLoad;
