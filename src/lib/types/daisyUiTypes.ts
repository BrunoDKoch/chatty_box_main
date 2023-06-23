type UiType = 'neutral' | 'warning' | 'error' | 'info' | 'success';

type ButtonFormat =
  | 'block'
  | 'square'
  | 'ghost'
  | 'wide'
  | 'link'
  | 'circle'
  | 'outline'
  | 'regular';

type UiSize = 'base' | 'small' | 'extra-small' | 'large';

type ButtonType = 'button' | 'reset' | 'submit' | null | undefined;

export type { UiType, ButtonFormat, UiSize, ButtonType };
