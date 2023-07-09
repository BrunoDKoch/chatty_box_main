<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let link: string;

  const dispatch = createEventDispatcher();
</script>

<a
  on:click|preventDefault={() => dispatch('showExternalLink', link)}
  class="link"
  rel="external"
  href={link}
>
  {link}
</a>
