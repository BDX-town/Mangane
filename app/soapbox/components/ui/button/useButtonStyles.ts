import classNames from 'classnames';

type ButtonThemes = 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger' | 'transparent' | 'link'
type ButtonSizes = 'sm' | 'md' | 'lg'

type IButtonStyles = {
  theme: ButtonThemes,
  block: boolean,
  disabled: boolean,
  size: ButtonSizes
}

/** Provides class names for the <Button> component. */
const useButtonStyles = ({
  theme,
  block,
  disabled,
  size,
}: IButtonStyles) => {
  const themes = {
    primary:
      'border-transparent text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 focus:ring-2 focus:ring-offset-2',
    secondary:
      'border-transparent text-primary-700 bg-primary-100 hover:bg-primary-200 focus:ring-primary-500 focus:ring-2 focus:ring-offset-2',
    ghost: 'shadow-none border-gray-200 text-gray-700 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:ring-primary-500 focus:ring-2 focus:ring-offset-2',
    accent: 'border-transparent text-white bg-accent-500 hover:bg-accent-300 focus:ring-pink-500 focus:ring-2 focus:ring-offset-2',
    danger: 'border-transparent text-danger-700 bg-danger-100 hover:bg-danger-200 focus:ring-danger-500 focus:ring-2 focus:ring-offset-2',
    transparent: 'border-transparent text-gray-800 backdrop-blur-sm bg-white/75 hover:bg-white/80',
    link: 'border-transparent text-primary-600 dark:text-primary-400 hover:bg-gray-100 hover:text-primary-700 dark:hover:bg-slate-900/50',
  };

  const sizes = {
    xs: 'px-3 py-1 text-xs',
    sm: 'px-3 py-1.5 text-xs leading-4',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const buttonStyle = classNames({
    'inline-flex items-center border font-medium rounded-full focus:outline-none appearance-none transition-all': true,
    'select-none disabled:opacity-50 disabled:cursor-default': disabled,
    [`${themes[theme]}`]: true,
    [`${sizes[size]}`]: true,
    'flex w-full justify-center': block,
  });

  return buttonStyle;
};

export { useButtonStyles, ButtonSizes, ButtonThemes };
