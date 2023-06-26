<script lang="ts">
  import { goto } from '$app/navigation';
  import { toKebabCase } from '$lib/useCaseConversion';

  export let icon: string;
  export let text: string;
  export let extraText: string | undefined = undefined;
  export let condition: boolean;
  export let action: (() => any) | undefined = undefined;
  export let link = '';
</script>

<a
  href={link}
  id="aside-nav-{toKebabCase(text)}"
  on:click|preventDefault={() => (link ? goto(link) : action ? action() : null)}
  class="flex w-full py-2 gap-3 items-center cursor-pointer custom-hover {condition
    ? 'indicator'
    : ''} "
>
  <iconify-icon class="text-2xl ml-2" {icon} />
  <p class="capitalize">{text}</p>
  {#if condition && extraText}
    <div class="indicator-item indicator-middle right-5 badge badge-info">
      {extraText}
    </div>
  {/if}
</a>
