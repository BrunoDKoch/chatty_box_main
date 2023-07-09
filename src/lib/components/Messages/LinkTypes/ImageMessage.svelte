<script lang="ts">
  import { PUBLIC_IMAGES_URL_DEV } from '$env/static/public';
  import Button from '$lib/components/Custom/Button.svelte';
  import { createEventDispatcher } from 'svelte';

  export let link: string;

  const dispatch = createEventDispatcher();
</script>

<Button
  id={link}
  format="ghost"
  additionalClasses="h-52"
  on:click={() => dispatch('showImage', link)}
>
  <img
    class="max-w-52 max-h-52"
    src={link.startsWith('static/images') ? `${PUBLIC_IMAGES_URL_DEV}/${link}?width=200` : link}
    alt=""
  />
</Button>
