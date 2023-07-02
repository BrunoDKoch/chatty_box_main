<script lang="ts">
  import { getLinkType } from '$lib/useLinkCheck';
  import { t } from 'svelte-i18n';

  export let link: string;
  $: linkType = getLinkType(link);
  $: link, (linkType = getLinkType(link));
  let { text, icon } = getTextAndIcon();
  $: link, ({ text, icon } = getTextAndIcon());
  function getTextAndIcon() {
    switch (linkType) {
      case 'YouTube':
        return {
          icon: 'mdi:youtube',
          text: $t('common.youtubeLink'),
        };
      case 'image':
        return {
          icon: 'mdi:image',
          text: $t('common.image'),
        };
      case 'video':
        return {
          icon: 'mdi:video',
          text: $t('common.video'),
        };
      case 'audio':
        return {
          icon: 'mdi:music',
          text: $t('common.audio'),
        };
      case 'file':
        return {
          icon: 'mdi:file',
          text: $t('common.file')
        }
      default:
        return {
          icon: 'mdi:link',
          text: 'Link',
        };
    }
  }
</script>

<div class="flex items-center gap-2">
  <iconify-icon {icon} />
  <span class="italic first-letter:uppercase">{text}</span>
</div>
