<script lang="ts">
  import type { SystemMessagePartial } from '$lib/types/combinationTypes';

  export let message: SystemMessagePartial;
</script>

<p class="opacity-70 text-center first-letter:uppercase">
  {message.instigatingUser.userName}
  {message.eventType.replace('user', '')}
  {message.affectedUser?.userName}
</p>
