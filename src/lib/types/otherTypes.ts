export const settingOptions = [
  'settings.status.status',
  'settings.privacy',
  'settings.security',
  'settings.notifications',
  'settings.language',
  'settings.darkTheme',
] as const;

export type SettingOptions = typeof settingOptions;

export const statusOptions = [
  {
    name: 'settings.status.online',
    value: ''
  },
  {
    name: 'settings.status.busy',
    value: 'busy',
  },
  {
    name: 'settings.status.away',
    value: 'away',
  },
] as const;
