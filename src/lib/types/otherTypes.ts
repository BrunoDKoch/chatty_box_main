const settingOptions = [
  'settings.status.status',
  'settings.privacy',
  'settings.security',
  'settings.notifications',
  'settings.language',
  'settings.darkTheme',
] as const;

type SettingOptions = typeof settingOptions;

const statusOptions = [
  {
    name: 'settings.status.online',
    value: '',
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

const reportOptions = [
  'report.harassmentBullying',
  'report.spamMessages',
  'report.inappropriateContent',
  'report.violentGraphicContent',
  'report.impersonationFakeProfile',
  'report.hateSpeechOffensiveLanguage',
  'report.suspiciousFraudulentActivity',
  'report.intellectualPropertyInfringement',
  'report.privacyViolation',
  'report.other',
] as const;

type ReportOption = typeof reportOptions[number];

export { settingOptions, type SettingOptions, statusOptions, reportOptions, type ReportOption };
