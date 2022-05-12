import classNames from 'classnames';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import Button from '../button/button';
import IconButton from '../icon-button/icon-button';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  confirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
});

interface IModal {
  /** Callback when the modal is cancelled. */
  cancelAction?: () => void,
  /** Cancel button text. */
  cancelText?: string,
  /** Callback when the modal is confirmed. */
  confirmationAction?: () => void,
  /** Whether the confirmation button is disabled. */
  confirmationDisabled?: boolean,
  /** Confirmation button text. */
  confirmationText?: React.ReactNode,
  /** Confirmation button theme. */
  confirmationTheme?: 'danger',
  /** Callback when the modal is closed. */
  onClose?: () => void,
  /** Callback when the secondary action is chosen. */
  secondaryAction?: () => void,
  /** Secondary button text. */
  secondaryText?: React.ReactNode,
  /** Don't focus the "confirm" button on mount. */
  skipFocus?: boolean,
  /** Title text for the modal. */
  title: string | React.ReactNode,
}

/** Displays a modal dialog box. */
const Modal: React.FC<IModal> = ({
  cancelAction,
  cancelText,
  children,
  confirmationAction,
  confirmationDisabled,
  confirmationText,
  confirmationTheme,
  onClose,
  secondaryAction,
  secondaryText,
  skipFocus = false,
  title,
}) => {
  const intl = useIntl();
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (buttonRef?.current && !skipFocus) {
      buttonRef.current.focus();
    }
  }, [skipFocus, buttonRef]);

  return (
    <div data-testid='modal' className='block w-full max-w-xl p-6 mx-auto overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-800 text-black dark:text-white shadow-xl rounded-2xl pointer-events-auto'>
      <div className='sm:flex sm:items-start w-full justify-between'>
        <div className='w-full'>
          <div className='w-full flex flex-row justify-between items-center'>
            <h3 className='text-lg leading-6 font-medium text-gray-900 dark:text-white'>
              {title}
            </h3>

            {onClose && (
              <IconButton
                src={require('@tabler/icons/icons/x.svg')}
                title={intl.formatMessage(messages.close)}
                onClick={onClose}
                className='text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200'
              />
            )}
          </div>

          <div className={classNames('mt-2 w-full')}>
            {children}
          </div>
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
