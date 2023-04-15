<script lang="ts">
  import type { MessagePreview } from '$lib/types/partialTypes';
  import { useShortFormat } from '$lib/useDateFormat';

  export let message: MessagePreview;
</script>

<div>
  <figure>
    <div>{message.from.userName ? message.from.userName[0] : ''}</div>
  </figure>
  <div>
    <p>{message.text.slice(0, 140)}</p>
    <p>{useShortFormat(message.sentAt)}</p>
  </div>
</div>
