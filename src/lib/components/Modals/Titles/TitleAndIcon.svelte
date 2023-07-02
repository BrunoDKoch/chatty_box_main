<script lang="ts">
  import type { UiType } from '$lib/types/daisyUiTypes';

  export let icon: string;
  export let title: string;
  export let textColor: UiType = 'neutral';
</script>

<div class="flex text-{textColor} items-center gap-2">
  <iconify-icon class="row-span-2 self-center justify-self-center" {icon} height="5rem" />
  <h1 class="font-bold uppercase text-2xl">
    {title}
  </h1>
</div>
