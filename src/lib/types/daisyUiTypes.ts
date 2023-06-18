type UiType = 'neutral' | 'warning' | 'error' | 'info' | 'success';

type ButtonFormat =
  | 'block'
  | 'square'
  | 'ghost'
  | 'wide'
  | 'link'
  | 'circle'
  | 'outline'
  | undefined;

type UiSize = 'xs' | 'sm' | 'md' | 'lg' | undefined;

type ButtonType = 'button' | 'reset' | 'submit' | null | undefined;

export type { UiType, ButtonFormat, UiSize, ButtonType };
