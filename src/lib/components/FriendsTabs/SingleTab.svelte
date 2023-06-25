<script lang="ts">
  import friendsTab from '$lib/friendsTab';
  import type { tabs } from '$lib/friendsTab';
  import { t } from 'svelte-i18n';
  export let name: (typeof tabs)[number];
  $: active = $friendsTab === name;
</script>

<button
  id={name.replace('.', '-')}
  on:click={() => ($friendsTab = name)}
  class="tab max-md:tab-sm capitalize {active ? 'tab-active tab-bordered' : 'hover:tab-bordered '}"
>
  {$t(name)}
</button>
