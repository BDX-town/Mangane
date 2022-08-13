import classNames from 'classnames';

type ButtonThemes = 'primary' | 'secondary' | 'tertiary' | 'accent' | 'danger' | 'transparent'
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
      'bg-primary-500 hover:bg-primary-400 dark:hover:bg-primary-600 border-transparent focus:bg-primary-500 text-gray-100 focus:ring-primary-300',
    secondary:
      'border-transparent bg-primary-100 dark:bg-primary-800 hover:bg-primary-50 dark:hover:bg-primary-700 focus:bg-primary-100 dark:focus:bg-primary-800 text-primary-500 dark:text-primary-200',
    tertiary:
      'bg-transparent border-gray-400 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 focus:border-primary-500 text-gray-900 dark:text-gray-100 focus:ring-primary-500',
    accent: 'border-transparent bg-secondary-500 hover:bg-secondary-300 focus:bg-secondary-500 text-gray-100 focus:ring-secondary-300',
    danger: 'border-transparent bg-danger-600 text-gray-100 hover:bg-danger-500 dark:hover:bg-danger-700 focus:bg-danger-600 dark:focus:bg-danger-600',
    transparent: 'border-transparent text-gray-800 backdrop-blur-sm bg-white/75 hover:bg-white/80',
  };

  const sizes = {
    xs: 'px-3 py-1 text-xs',
    sm: 'px-3 py-1.5 text-xs leading-4',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const buttonStyle = classNames({
    'inline-flex items-center border font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 appearance-none transition-all': true,
    'select-none disabled:opacity-75 disabled:cursor-default': disabled,
    [`${themes[theme]}`]: true,
    [`${sizes[size]}`]: true,
    'flex w-full justify-center': block,
  });

  return buttonStyle;
};

export { useButtonStyles, ButtonSizes, ButtonThemes };
