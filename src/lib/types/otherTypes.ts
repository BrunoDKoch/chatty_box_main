export const settingOptions = [
  'settings.privacy',
  'settings.security',
  'settings.notifications',
  'settings.language',
  'settings.darkTheme',
] as const;

export type SettingOptions = typeof settingOptions;
