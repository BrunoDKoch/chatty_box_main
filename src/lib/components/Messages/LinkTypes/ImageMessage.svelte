<script lang="ts">
  import { PUBLIC_IMAGES_URL_DEV } from '$env/static/public';
  import Button from '$lib/components/Custom/Button.svelte';
  import Image from '$lib/components/Custom/Image.svelte';
  import { createEventDispatcher } from 'svelte';

  export let link: string;

  const dispatch = createEventDispatcher();
</script>

<Button
  id={link}
  format="ghost"
  additionalClasses="h-auto w-[200px]"
  on:click={() => dispatch('showImage', link)}
>
  <Image
    width={200}
    src={link.startsWith('static/images') ? `${PUBLIC_IMAGES_URL_DEV}/${link}?width=200` : link}
    alt=""
  />
</Button>
