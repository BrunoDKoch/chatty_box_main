<script lang="ts">
  import { t, date, locale } from 'svelte-i18n';
  import type { UserLoginAttempt } from '@prisma/client';
  import { onMount } from 'svelte';
  import { connection } from '$lib/useSignalR';
  import Pagination from '$lib/components/Pagination/Pagination.svelte';
  import Modal from '$lib/components/Modals/Modal.svelte';

  $: attempts = [] as UserLoginAttempt[];
  $: activePage = 1;
  let total: number;
  const countryNames = new Intl.DisplayNames([$locale!], { type: 'region' });

  const headers = [
    'security.loginAttempt.attemptedAt',
    'security.loginAttempt.country',
    'security.loginAttempt.city',
    'security.loginAttempt.device',
    'security.loginAttempt.os',
    'security.loginAttempt.browser',
    'security.loginAttempt.successful',
  ];

  connection.on('loginAttempts', (data: { attempts: UserLoginAttempt[]; count: number }) => {
    attempts = data.attempts;
    total = data.count;
  });

  $: activePage, connection.invoke('GetLoginAttempts', activePage).then((data) => data);

  onMount(async () => {
    await connection.invoke('GetLoginAttempts', activePage);
  });
</script>

<Modal on:close>
  <div class="flex flex-col justify-center">
    {#if attempts && attempts.length && total}
      <table class="table table-compact">
        <thead>
          <tr>
            <th />
            {#each headers as header}
              <th class="first-letter:uppercase">{$t(header)}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each attempts as attempt}
            <tr class="text-center">
              <th>{attempts.indexOf(attempt) + 1}</th>
              <td>
                {$date(new Date(`${attempt.attemptedAt}Z`), {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </td>
              <td>{countryNames.of(attempt.countryIsoCode)}</td>
              <td>{attempt.cityName}</td>
              <td>{attempt.device}</td>
              <td>{attempt.os}</td>
              <td>{attempt.browser}</td>
              <td>
                <iconify-icon
                  class="text-lg {attempt.success ? 'text-info' : 'text-error'}"
                  icon={attempt.success ? 'mdi:check' : 'mdi:close'}
                />
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      <div class="flex items-center justify-center">
        <Pagination {total} itemsPerPage={15} bind:activePage />
      </div>
    {/if}
  </div>
</Modal>
