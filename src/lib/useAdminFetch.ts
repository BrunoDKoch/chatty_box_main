import { ofetch } from 'ofetch';
import { PUBLIC_AUTH_URL_DEV as baseURL } from '$env/static/public';
import type { AdminActionRequest, LockoutInfo } from './types/partialTypes';
import { writable, type Writable } from 'svelte/store';
import type { ReportUserResponse, UserReportResponse } from './types/combinationTypes';
import type { Page } from '@sveltejs/kit';

const fetchedReports = writable({ reports: [], total: 0 }) as Writable<{
  reports: UserReportResponse[];
  total: number;
}>;

const fetchedSuspensions = writable({ users: [], total: 0 }) as Writable<{
  users: ReportUserResponse[];
  total: number;
}>;

async function postAdminAction(body: AdminActionRequest) {
  return await ofetch('/admin/action', {
    baseURL,
    body,
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  });
}

async function lockUserOut(userId: string, body: LockoutInfo) {
  return await ofetch(`/admin/lockout/${userId}`, {
    baseURL,
    body,
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  });
}

async function fetchReports(query: { skip: number; take: number; excludePending?: boolean }) {
  return await ofetch<{ reports: UserReportResponse[]; total: number }>('/admin/reports', {
    baseURL,
    query,
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  });
}

async function fetchSuspensions(query: { skip: number; take: number }) {
  return await ofetch<{ users: ReportUserResponse[]; total: number }>('/admin/suspensions', {
    baseURL,
    query,
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  });
}

async function getAdminData(
  toFetch: 'reports' | 'suspensions',
  data: { activePage: number; page: Page },
) {
  const { activePage, page } = data;
  const skip = 15 * activePage - 15;
  const take = 15;
  const excludePending = page.url.pathname.endsWith('/past');

  switch (toFetch) {
    case 'reports':
      const reports = await fetchReports({ skip, take, excludePending });
      fetchedReports.update((f) => {
        f = reports;
        return f;
      });
      break;
    default:
      const suspensions = await fetchSuspensions({ skip, take });
      fetchedSuspensions.update((f) => (f = suspensions));
  }

  if (toFetch === 'reports') return await fetchReports({ skip, take, excludePending });
  return await fetchSuspensions({ skip, take });
}

const reports = writable([]) as Writable<UserReportResponse[]>;

const totalReports = writable(0);

const activeAdminPage = writable(1);

export {

  postAdminAction,
  lockUserOut,
  fetchReports,
  getAdminData,
  reports,
  totalReports,
  activeAdminPage,
  fetchedReports,
  fetchedSuspensions,
};
