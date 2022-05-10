import classNames from 'classnames';
import React from 'react';

type Themes = 'default' | 'danger' | 'primary' | 'muted' | 'subtle' | 'success' | 'inherit' | 'white'
type Weights = 'normal' | 'medium' | 'semibold' | 'bold'
type Sizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
type Alignments = 'left' | 'center' | 'right'
type TrackingSizes = 'normal' | 'wide'
type TransformProperties = 'uppercase' | 'normal'
type Families = 'sans' | 'mono'
type Tags = 'abbr' | 'p' | 'span' | 'pre' | 'time' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label'

const themes = {
  default: 'text-gray-900 dark:text-gray-100',
  danger: 'text-danger-600',
  primary: 'text-primary-600 dark:text-primary-400',
  muted: 'text-gray-500 dark:text-gray-400',
  subtle: 'text-gray-400 dark:text-gray-500',
  success: 'text-success-600',
  inherit: 'text-inherit',
  white: 'text-white',
};

const weights = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const sizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

const alignments = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const trackingSizes = {
  normal: 'tracking-normal',
  wide: 'tracking-wide',
};

const transformProperties = {
  normal: 'normal-case',
  uppercase: 'uppercase',
};

const families = {
  sans: 'font-sans',
  mono: 'font-mono',
};

interface IText extends Pick<React.HTMLAttributes<HTMLParagraphElement>, 'dangerouslySetInnerHTML'> {
  /** How to align the text. */
  align?: Alignments,
  /** Extra class names for the outer element. */
  className?: string,
  /** Typeface of the text. */
  family?: Families,
  /** The "for" attribute specifies which form element a label is bound to. */
  htmlFor?: string,
  /** Font size of the text. */
  size?: Sizes,
  /** HTML element name of the outer element. */
  tag?: Tags,
  /** Theme for the text. */
  theme?: Themes,
  /** Letter-spacing of the text. */
  tracking?: TrackingSizes,
  /** Transform (eg uppercase) for the text. */
  transform?: TransformProperties,
  /** Whether to truncate the text if its container is too small. */
  truncate?: boolean,
  /** Font weight of the text. */
  weight?: Weights
}

/** UI-friendly text container with dark mode support. */
const Text: React.FC<IText> = React.forwardRef(
  (props: IText, ref: React.LegacyRef<any>) => {
    const {
      align,
      className,
      family = 'sans',
      size = 'md',
      tag = 'p',
      theme = 'default',
      tracking = 'normal',
      transform = 'normal',
      truncate = false,
      weight = 'normal',
      ...filteredProps
    } = props;

    const Comp: React.ElementType = tag;

    const alignmentClass = typeof align === 'string' ? alignments[align] : '';

    return (
      <Comp
        {...filteredProps}
        ref={ref}
        style={tag === 'abbr' ? { textDecoration: 'underline dotted' } : undefined}
        className={classNames({
          'cursor-default': tag === 'abbr',
          truncate: truncate,
          [sizes[size]]: true,
          [themes[theme]]: true,
          [weights[weight]]: true,
          [trackingSizes[tracking]]: true,
          [families[family]]: true,
          [alignmentClass]: typeof align !== 'undefined',
          [transformProperties[transform]]: typeof transform !== 'undefined',
        }, className)}
      />
    );
  },
);

export default Text;
