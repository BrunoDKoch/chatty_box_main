<script lang="ts">
  import type { ReportUserResponse } from '$lib/types/combinationTypes';
    import { t } from 'svelte-i18n';
  import UserAvatarAndName from '../UserAvatarAndName.svelte';

  export let user: ReportUserResponse;
  const violations = user.pastViolations.map((p) => p.reportReason).join(', ')
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
