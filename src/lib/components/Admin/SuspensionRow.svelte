<script lang="ts">
  import type { ReportUserResponse } from '$lib/types/combinationTypes';
  import { t } from 'svelte-i18n';
  import UserAvatarAndName from '../UserAvatarAndName.svelte';
  import Button from '../Custom/Button.svelte';
  import { createEventDispatcher } from 'svelte';

  export let user: ReportUserResponse;
  const dispatch = createEventDispatcher();
  const violations = user.pastViolations.map((p) => p.reportReason).join(', ');
</script>

<td>
  <UserAvatarAndName {user} size="half" disableModal />
</td>
<td>
  {user.lockoutEnd}
</td>
<td>
  {$t(violations)}
</td>
<td>
  <Button
    id="remove-suspension-{user.id}"
    buttonType="button"
    on:click={() => dispatch('removeSuspension', user)}
  >
    {$t('common.remove', { values: { item: $t('common.suspension') } })}
  </Button>
</td>
