<script lang="ts">
  let open = false;
  const options = ['notifications', 'add member', 'remove member', 'leave chat']
</script>

<div class="dropdown z-50 {open ? 'dropdown-open' : ''}">
  <button class="btn btn-ghost">
    <iconify-icon icon="mdi:dots-vertical" />
  </button>
  <ul class="dropdown-content menu bg-base-300 z-50">
    {#each options as option}
      <li class="z-50">
        <a href="/">
          <span class="first-letter:uppercase">
            {option}
          </span>
        </a>
      </li>
    {/each}
  </ul>
</div>
