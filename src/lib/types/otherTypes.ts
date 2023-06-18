import type { UiSize, UiType } from './daisyUiTypes';

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

type ReportOption = (typeof reportOptions)[number];

interface MockActionButton {
  uiType: UiType;
  tooltip?: string;
  icon?: string;
  text?: string;
  size?: UiSize;
  joinItem?: boolean;
  disabled?: boolean;
}

interface ActionButton extends MockActionButton {
  action(): void | Promise<void>;
}

export { settingOptions, statusOptions, reportOptions };

export type { SettingOptions, ReportOption, ActionButton };
