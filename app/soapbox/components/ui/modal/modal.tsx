import classNames from 'classnames';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import Button from '../button/button';
import IconButton from '../icon-button/icon-button';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  confirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
});

type Widths = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

const widths = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-base',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
};

interface IModal {
  /** Callback when the modal is cancelled. */
  cancelAction?: () => void,
  /** Cancel button text. */
  cancelText?: React.ReactNode,
  /** URL to an SVG icon for the close button. */
  closeIcon?: string,
  /** Position of the close button. */
  closePosition?: 'left' | 'right',
  /** Callback when the modal is confirmed. */
  confirmationAction?: (event?: React.MouseEvent<HTMLButtonElement>) => void,
  /** Whether the confirmation button is disabled. */
  confirmationDisabled?: boolean,
  /** Confirmation button text. */
  confirmationText?: React.ReactNode,
  /** Confirmation button theme. */
  confirmationTheme?: 'danger',
  /** Callback when the modal is closed. */
  onClose?: () => void,
  /** Callback when the secondary action is chosen. */
  secondaryAction?: (event?: React.MouseEvent<HTMLButtonElement>) => void,
  /** Secondary button text. */
  secondaryText?: React.ReactNode,
  secondaryDisabled?: boolean,
  /** Don't focus the "confirm" button on mount. */
  skipFocus?: boolean,
  /** Title text for the modal. */
  title?: React.ReactNode,
  width?: Widths,
}

/** Displays a modal dialog box. */
const Modal: React.FC<IModal> = ({
  cancelAction,
  cancelText,
  children,
  closeIcon = require('@tabler/icons/x.svg'),
  closePosition = 'right',
  confirmationAction,
  confirmationDisabled,
  confirmationText,
  confirmationTheme,
  onClose,
  secondaryAction,
  secondaryDisabled = false,
  secondaryText,
  skipFocus = false,
  title,
  width = 'xl',
}) => {
  const intl = useIntl();
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (buttonRef?.current && !skipFocus) {
      buttonRef.current.focus();
    }
  }, [skipFocus, buttonRef]);

  return (
    <div data-testid='modal' className={classNames('block w-full p-6 mx-auto text-left align-middle transition-all bg-white dark:bg-slate-800 text-black dark:text-white shadow-xl rounded-2xl pointer-events-auto', widths[width])}>
      <div className='sm:flex sm:items-start w-full justify-between'>
        <div className='w-full'>
          {title && (
            <div
              className={classNames('w-full flex items-center gap-2', {
                'flex-row-reverse': closePosition === 'left',
              })}
            >
              <h3 className='flex-grow text-lg leading-6 font-medium text-gray-900 dark:text-white'>
                {title}
              </h3>

              {onClose && (
                <IconButton
                  src={closeIcon}
                  title={intl.formatMessage(messages.close)}
                  onClick={onClose}
                  className='text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200'
                />
              )}
            </div>
          )}

          {title ? (
            <div className='w-full mt-2'>
              {children}
            </div>
          ) : children}
        </div>
      </div>

      {confirmationAction && (
        <div className='mt-5 flex flex-row justify-between' data-testid='modal-actions'>
          <div className='flex-grow'>
            {cancelAction && (
              <Button
                theme='ghost'
                onClick={cancelAction}
              >
                {cancelText || 'Cancel'}
              </Button>
            )}
          </div>

          <div className='flex flex-row space-x-2'>
            {secondaryAction && (
              <Button
                theme='secondary'
                onClick={secondaryAction}
                disabled={secondaryDisabled}
              >
                {secondaryText}
              </Button>
            )}

            <Button
              theme={confirmationTheme || 'primary'}
              onClick={confirmationAction}
              disabled={confirmationDisabled}
              ref={buttonRef}
            >
              {confirmationText}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
