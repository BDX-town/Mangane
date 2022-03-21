import classNames from 'classnames';
import React from 'react';

type Themes = 'default' | 'danger' | 'primary' | 'muted' | 'subtle' | 'success' | 'inherit' | 'white'
type Weights = 'normal' | 'medium' | 'semibold' | 'bold'
type Sizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
type Alignments = 'left' | 'center' | 'right'
type TrackingSizes = 'normal' | 'wide'
type Families = 'sans' | 'mono'
type Tags = 'abbr' | 'p' | 'span' | 'pre' | 'time' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

const themes = {
  default: 'text-gray-900',
  danger: 'text-danger-600',
  primary: 'text-primary-600',
  muted: 'text-gray-500',
  subtle: 'text-gray-400',
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
  md: 'text-md',
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

const families = {
  sans: 'font-sans',
  mono: 'font-mono',
};

interface IText extends Pick<React.HTMLAttributes<HTMLParagraphElement>, 'dangerouslySetInnerHTML'> {
  align?: Alignments,
  className?: string,
  dateTime?: string,
  family?: Families,
  size?: Sizes,
  tag?: Tags,
  theme?: Themes,
  tracking?: TrackingSizes,
  truncate?: boolean,
  weight?: Weights
}

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
      truncate = false,
      weight = 'normal',
      ...filteredProps
    } = props;

    const Comp: React.ElementType = tag;

    return (
      <Comp
        {...filteredProps}
        ref={ref}
        style={tag === 'abbr' ? { textDecoration: 'underline dotted' } : null}
        className={classNames({
          'cursor-default': tag === 'abbr',
          truncate: truncate,
          [sizes[size]]: true,
          [themes[theme]]: true,
          [weights[weight]]: true,
          [trackingSizes[tracking]]: true,
          [families[family]]: true,
          [alignments[align]]: typeof align !== 'undefined',
          [className]: typeof className !== 'undefined',
        })}
      />
    );
  },
);

export default Text;
