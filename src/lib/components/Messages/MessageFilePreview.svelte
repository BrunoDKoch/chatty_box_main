<script lang="ts">
    import { PUBLIC_IMAGES_URL } from "$env/static/public";

  export let link: string;
  // cSpell: disable
  const fileIcons = {
    text: 'uiw:file-text',
    wordLike: 'simple-icons:libreoffice',
    powerPointLike: 'file-icons:microsoft-powerpoint',
    compressed: 'material-symbols:folder-zip-outline',
    pdf: 'uiw:file-pdf',
    executable: 'carbon:executable-program',
    unknown: 'mdi:file-question',
  };
  const programmingFileIcons = {
    c: 'simple-icons:c',
    cpp: 'simple-icons:cplusplus',
    cs: 'simple-icons:csharp',
    java: 'simple-icons:java',
    js: 'simple-icons:javascript',
    ts: 'simple-icons:typescript',
    py: 'simple-icons:python',
    rs: 'simple-icons:rust',
    go: 'simple-icons:go',
    json: 'mdi:code-json',
    sh: 'codicon:terminal-bash',
    ps: 'codicon:terminal-powershell',
    bat: 'codicon:terminal-cmd',
  };
  const extension = link.split('.').pop();
  const fileName = link.split('/').pop();
  // cSpell: enable
  function getFileIcon() {
    if (!extension) return fileIcons.executable;
    if (Object.keys(programmingFileIcons).includes(extension))
      return programmingFileIcons[extension as keyof typeof programmingFileIcons];
    switch (extension) {
      case 'pdf':
        return fileIcons.pdf;
      case link:
      case 'exe':
      case 'msi':
      case 'deb':
        return fileIcons.executable;
      case 'txt':
      case 'md':
        return fileIcons.text;
      case 'doc':
      case 'docx':
      case 'rtf':
      case 'odt':
        return fileIcons.wordLike;
      case 'ppt':
      case 'pptx':
        return fileIcons.powerPointLike;
      case 'zip':
      case 'gz':
      case 'tar':
      case 'rar':
      case '7z':
        return fileIcons.compressed;
      default:
        return fileIcons.unknown;
    }
  }
</script>

<a href="{PUBLIC_IMAGES_URL}/{link}">
  <div class="items-center p-4 grid grid-cols-5">
    <iconify-icon class="text-4xl" icon={getFileIcon()} />
    <div class="flex col-span-4 flex-col">
      <p class="italic">{fileName}</p>
      <p>Click to download</p>
    </div>
  </div>
</a>
