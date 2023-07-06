<script lang="ts">
  import type { MessageResponse } from '$lib/types/combinationTypes';
  import { date, t } from 'svelte-i18n';
  import MessageComponent from '../Messages/MessageComponent.svelte';
  import UserAvatarAndName from '../UserAvatarAndName.svelte';
  import Modal from './Modal.svelte';
  export let message: MessageResponse;
</script>

<Modal on:close>
  <MessageComponent displayOnly {message} />
  <div class="modal-middle">
    <h2 class="divider uppercase">{$t('message.readBy')}</h2>
    <div class="grid gap-4">
      {#each message.readBy.filter((m) => m.id !== message.user.id) as readBy}
        <div class="grid grid-cols-2 max-lg:text-sm items-center">
          <UserAvatarAndName disableModal user={readBy} size="half" />
          <time class="justify-self-end">
            {$date(new Date(`${readBy.readAt}Z`), { dateStyle: 'medium', timeStyle: 'short' })}
          </time>
        </div>
      {/each}
    </div>
  </div>
</Modal>
