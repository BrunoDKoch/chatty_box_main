import { PUBLIC_AUTH_URL_DEV as baseURL } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { UserReportResponse } from '$lib/types/combinationTypes';

export const load = (async ({ fetch, url }) => {
  // Check if user is admin
  const adminResponse = await fetch(`${baseURL}/admin/isAdmin`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  });
  const isAdmin = await adminResponse.json();
  console.log({ isAdmin });
  if (!isAdmin)
    throw error(403, {
      status: 403,
      cause: 'Forbidden',
      message: 'This area is restricted',
    });

  const skip = Number(url.searchParams.get('p')) * 15 ?? 15;
  const take = 15;
  const reportsRequest = await fetch(`${baseURL}/admin/reports?skip=${skip}&take=${take}`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  });
  const reports = (await reportsRequest.json()) as UserReportResponse[];
  return { reports };
}) satisfies PageServerLoad;
