// cSpell: disable
const fileIcons = {
  text: 'vscode-icons:file-type-text',
  wordLike: 'bi:file-earmark-richtext',
  powerPointLike: 'file-icons:microsoft-powerpoint',
  compressed: 'vscode-icons:file-type-zip',
  pdf: 'vscode-icons:file-type-pdf2',
  executable: 'vscode-icons:file-type-binary',
  unknown: 'mdi:file-question-outline',
};

const fileTypes = [
  'executable',
  'text',
  'code',
  'pdf',
  'compressed',
  'powerPointLike',
  'wordLike',
  'unknown',
] as const;

export type FileType = (typeof fileTypes)[number];

const fileTypesAndExtensions: Record<FileType, string[]> = {
  executable: [
    'exe',
    'msi',
    'cmd',
    'scr',
    'msc',
    'com',
    'pif',
    'vb',
    'vbs',
    'jar',
    'app',
    'pkg',
    'command',
    'sh',
    'osx',
    'workflow',
    'scpt',
    'bin',
    'elf',
    'out',
    'deb',
    'rpm',
    'AppImage',
  ],
  text: ['txt', 'md', 'ini', 'conf'],
  code: [
    'c',
    'cpp',
    'xml',
    'yaml',
    'json',
    'html',
    'css',
    'js',
    'php',
    'py',
    'java',
    'h',
    'sql',
    'jsx',
    'ts',
    'tsx',
    'vue',
    'svelte',
    'sh',
    'ps',
    'bat',
    'rs',
    'go',
    'cs',
  ],
  pdf: ['pdf'],
  compressed: ['zip', 'rar', 'tar', 'gz', 'bz2', '7z', 'xz'],
  powerPointLike: ['ppt', 'pptx', 'pps', 'ppsx', 'pot', 'potx', 'odp', 'otp', 'fodp', 'uop'],
  wordLike: ['doc', 'docx', 'dot', 'dotx', 'docm', 'dotm', 'odt', 'ott', 'fodt', 'uot', 'rtf'],
  unknown: [],
};

const programmingFileIcons = {
  c: 'vscode-icons:file-type-c3',
  cpp: 'vscode-icons:file-type-cpp3',
  cs: 'vscode-icons:file-type-csharp2',
  java: 'vscode-icons:file-type-java',
  js: 'vscode-icons:file-type-js-official',
  ts: 'vscode-icons:file-type-typescript-official',
  py: 'vscode-icons:file-type-python',
  rs: 'vscode-icons:file-type-rust',
  go: 'vscode-icons:file-type-go',
  json: 'mdi:code-json',
  sh: 'vscode-icons:file-type-shell',
  ps: 'vscode-icons:file-type-powershell',
  bat: 'vscode-icons:file-type-bat',
  css: 'vscode-icons:file-type-css',
  html: 'vscode-icons:file-type-html',
  xml: 'vscode-icons:file-type-xml',
  h: 'vscode-icons:file-type-c',
  yaml: 'vscode-icons:file-type-yaml',
  php: 'vscode-icons:file-type-php',
  vue: 'vscode-icons:file-type-vue',
  svelte: 'vscode-icons:file-type-svelte',
  sql: 'vscode-icons:file-type-sql',
  jsx: 'vscode-icons:file-type-reactjs',
  tsx: 'vscode-icons:file-type-reactts',
} as const;
// cSpell: enable

function getFileIcon(fileType: FileType, extension?: string) {
  if (fileType !== 'code') return fileIcons[fileType];
  if (!extension) return fileIcons.executable;
  return programmingFileIcons[extension as keyof typeof programmingFileIcons];
}

function getFileType(extension?: string): FileType {
  if (!extension) return 'executable';
  for (const key of Object.keys(fileTypesAndExtensions)) {
    if (!fileTypesAndExtensions[key as FileType].includes(extension)) continue;
    return key as FileType;
  }
  return 'unknown';
}

export default function (link: string) {
  const finalPartOfLink = link.split('.').pop();
  const extension = finalPartOfLink === link ? undefined : finalPartOfLink;
  const fileName = link.split('/').pop();
  const fileType = getFileType(extension);
  const icon = getFileIcon(fileType, extension);
  return { extension, fileName, icon, fileType };
}
