<script lang="ts">
  import type { MessagePreview } from '$lib/types/partialTypes';
  import { useShortFormat } from '$lib/useDateFormat';
  import { date } from 'svelte-i18n';
  export let message: MessagePreview;
</script>

<div>
  <figure>
    <div>{message.from.userName ? message.from.userName[0] : ''}</div>
  </figure>
  <div>
    <p>{message.text.slice(0, 140)}</p>
    <p>{$date(message.sentAt)}</p>
  </div>
</div>
