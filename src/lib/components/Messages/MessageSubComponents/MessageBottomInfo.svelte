<script lang="ts">
  import type { MessageResponse } from '$lib/types/combinationTypes';
  import { createEventDispatcher } from 'svelte';
  import { date } from 'svelte-i18n';

  const dispatch = createEventDispatcher();
  export let message: MessageResponse;
</script>

<div class="chat-footer flex gap-1 opacity-50">
  <div class="flex-col flex">
    <p class={message.editedAt ? 'line-through' : ''}>
      {$date(new Date(`${message.sentAt}Z`), {
        dateStyle: 'medium',
        timeStyle: 'short',
      })}
    </p>
    {#if message.editedAt}
      <time>
        {$date(
          new Date(
            String(message.editedAt).endsWith('Z') ? message.editedAt : `${message.editedAt}Z`,
          ),
          {
            dateStyle: 'medium',
            timeStyle: 'short',
          },
        )}
      </time>
    {/if}
  </div>
  {#if message.isFromCaller && message.readBy.length}
    <button class="self-end" on:click={() => dispatch('showReadByModal', message)}>
      <iconify-icon
        icon="mdi:check-all"
        class:text-success={message.readBy.filter((r) => r.id !== message.user.id).length}
      />
    </button>
  {/if}
</div>
