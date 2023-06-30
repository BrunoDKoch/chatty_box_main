import type { ButtonFormat, UiSize, UiType } from './daisyUiTypes';

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
  id: string;
  uiType: UiType;
  format?: ButtonFormat;
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

type InputType =
  | 'text'
  | 'password'
  | 'date'
  | 'datetime'
  | 'datetime-local'
  | 'email'
  | 'search'
  | 'time'
  | 'url'
  | 'area'
  | 'week'
  | 'number'
  | 'phone';

interface InputInterface {
  value: string | Date | number;
  labelText: string;
  type: InputType;
  required: boolean;
  disabled: boolean;
  name: string;
}

interface InputRule<K extends string> {
  K: {
    condition: boolean;
    text: string;
  }[];
}

export { settingOptions, statusOptions, reportOptions };

export type {
  SettingOptions,
  ReportOption,
  MockActionButton,
  ActionButton,
  InputType,
  InputInterface,
  InputRule,
};
