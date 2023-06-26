type UiType = 'neutral'| 'warning'| 'error'| 'info'| 'success';

type ButtonFormat =
  | 'block'
  | 'square'
  | 'ghost'
  | 'wide'
  | 'link'
  | 'circle'
  | 'outline'
  | 'regular';

type UiSize = 'base'| 'small'| 'extra-small'| 'large';

type ButtonType = 'button'| 'reset'| 'submit'| null | undefined;

const sizeClasses = {
  base: 'btn-md',
  small: 'btn-sm',
  'extra-small': 'btn-xs',
  large: 'btn-lg',
} as const;

const btnFormat = {
  block: 'btn-block',
  square: 'btn-square',
  ghost: 'btn-ghost',
  wide: 'btn-wide',
  link: 'btn-link',
  circle: 'btn-circle',
  outline: 'btn-outline',
  regular: '',
} as const;

const btnBackground = {
  neutral: 'btn-neutral',
  warning: 'btn-warning',
  error: 'btn-error',
  info: 'btn-info',
  success: 'btn-success',
} as const;

export type { UiType, ButtonFormat, UiSize, ButtonType };
export { sizeClasses, btnFormat, btnBackground };
