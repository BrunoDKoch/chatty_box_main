<script lang="ts">
  export let name: string;
  export let active: boolean = false;
</script>

<button class="tab tab-lifted capitalize {active ? 'tab-active' : ''}">
  {name}
</button>
