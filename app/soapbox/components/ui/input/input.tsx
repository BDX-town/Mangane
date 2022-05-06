import classNames from 'classnames';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import Icon from '../icon/icon';
import SvgIcon from '../icon/svg-icon';
import Tooltip from '../tooltip/tooltip';

const messages = defineMessages({
  showPassword: { id: 'input.password.show_password', defaultMessage: 'Show password' },
  hidePassword: { id: 'input.password.hide_password', defaultMessage: 'Hide password' },
});

interface IInput extends Pick<React.InputHTMLAttributes<HTMLInputElement>, 'maxLength' | 'onChange' | 'onBlur' | 'type' | 'autoComplete' | 'autoCorrect' | 'autoCapitalize' | 'required' | 'disabled' | 'onClick' | 'readOnly' | 'min' | 'pattern'> {
  /** Put the cursor into the input on mount. */
  autoFocus?: boolean,
  /** The initial text in the input. */
  defaultValue?: string,
  /** Extra class names for the <input> element. */
  className?: string,
  /** Extra class names for the outer <div> element. */
  outerClassName?: string,
  /** URL to the svg icon. */
  icon?: string,
  /** Internal input name. */
  name?: string,
  /** Text to display before a value is entered. */
  placeholder?: string,
  /** Text in the input. */
  value?: string | number,
  /** Change event handler for the input. */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
  /** HTML input type. */
  type: 'text' | 'number' | 'email' | 'tel' | 'password',
  /** Whether to display the input in red. */
  hasError?: boolean,
}

/** Form input element. */
const Input = React.forwardRef<HTMLInputElement, IInput>(
  (props, ref) => {
    const intl = useIntl();

    const { type = 'text', icon, className, outerClassName, ...filteredProps } = props;

    const [revealed, setRevealed] = React.useState(false);

    const isPassword = type === 'password';

    const togglePassword = React.useCallback(() => {
      setRevealed((prev) => !prev);
    }, []);

    return (
      <div className={classNames('mt-1 relative rounded-md shadow-sm', outerClassName)}>
        {icon ? (
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Icon src={icon} className='h-4 w-4 text-gray-400' aria-hidden='true' />
          </div>
        ) : null}

        <input
          {...filteredProps}
          type={revealed ? 'text' : type}
          ref={ref}
          className={classNames({
            'dark:bg-slate-800 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500':
                true,
            'pr-7': isPassword,
            'pl-8': typeof icon !== 'undefined',
          }, className)}
        />

        {isPassword ? (
          <Tooltip
            text={
              revealed ?
                intl.formatMessage(messages.hidePassword) :
                intl.formatMessage(messages.showPassword)
            }
          >
            <div className='absolute inset-y-0 right-0 flex items-center'>
              <button
                type='button'
                onClick={togglePassword}
                tabIndex={-1}
                className='text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 h-full px-2 focus:ring-primary-500 focus:ring-2'
              >
                <SvgIcon
                  src={revealed ? require('@tabler/icons/icons/eye-off.svg') : require('@tabler/icons/icons/eye.svg')}
                  className='h-4 w-4'
                />
              </button>
            </div>
          </Tooltip>
        ) : null}
      </div>
    );
  },
);

export default Input;
