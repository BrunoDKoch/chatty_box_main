<script lang="ts">
  import { t, date, time, locale } from 'svelte-i18n';
  import type { UserLoginAttempt } from '@prisma/client';
  import { createEventDispatcher, onMount } from 'svelte';
  import { connection } from '$lib/useSignalR';
  import Pagination from '$lib/components/Pagination.svelte';
  import Modal from '$lib/components/Modal.svelte';

  $: attempts = [] as UserLoginAttempt[];
  $: activePage = 1;
  let total: number;
  const countryNames = new Intl.DisplayNames([$locale!], { type: 'region' });

  const dispatch = createEventDispatcher();

  connection.on('loginAttempts', (data: { attempts: UserLoginAttempt[]; count: number }) => {
    attempts = data.attempts;
    total = data.count;
  });

  $: activePage, connection.invoke('GetLoginAttempts', activePage).then((data) => data);

  onMount(async () => {
    await connection.invoke('GetLoginAttempts', activePage);
  });
</script>

<Modal>
  <div class="flex items-end justify-end">
    <button on:click={() => dispatch('close')} class="btn btn-circle btn-sm">
      <iconify-icon icon="mdi:close" />
    </button>
  </div>
  <div class="flex flex-col justify-center">
    {#if attempts && attempts.length && total}
      <table class="table table-compact">
        <thead>
          <tr>
            <th />
            <th>{$t('security.loginAttempt.attemptedAt')}</th>
            <th>{$t('security.loginAttempt.country')}</th>
            <th>{$t('security.loginAttempt.city')}</th>
            <th>{$t('security.loginAttempt.successful')}</th>
          </tr>
        </thead>
        <tbody>
          {#each attempts as attempt}
            <tr class="text-center">
              <th>{attempts.indexOf(attempt) + 1}</th>
              <td
                >{$date(new Date(`${attempt.attemptedAt}z`))} - {$time(
                  new Date(`${attempt.attemptedAt}z`),
                )}</td
              >
              <td>{countryNames.of(attempt.countryIsoCode)}</td>
              <td>{attempt.cityName}</td>
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
