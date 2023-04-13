import { getCurrentUser } from '$lib/useAuth';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async () => {
  try {
    const email = await getCurrentUser();
    return { email };
  } catch {
    throw redirect(303, '/auth/login')
  }
}) satisfies PageLoad;
