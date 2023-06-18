import { PUBLIC_AUTH_URL_DEV as baseURL } from '$env/static/public';
import type { PageServerLoad } from './$types';
import type { ReportUserResponse, UserReportResponse } from '$lib/types/combinationTypes';

export const load = (async ({ fetch, url }) => {

  const skip = Number(url.searchParams.get('p')) * 15 ?? 15;
  const take = 15;
  const reportsRequest = await fetch(`${baseURL}/admin/suspensions?skip=${skip}&take=${take}`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  });
  const suspensions = (await reportsRequest.json()) as ReportUserResponse[];
  return { suspensions };
}) satisfies PageServerLoad;
