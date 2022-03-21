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
  cancelAction?: () => void,
  cancelText?: string,
  confirmationAction?: () => void,
  confirmationDisabled?: boolean,
  confirmationText?: string,
  confirmationTheme?: 'danger',
  onClose: () => void,
  secondaryAction?: () => void,
  secondaryText?: string,
  title: string | React.ReactNode,
}

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
  title,
}) => {
  const intl = useIntl();
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (buttonRef?.current) {
      buttonRef.current.focus();
    }
  }, [buttonRef]);

  return (
    <div className='block w-full max-w-xl p-6 mx-auto overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl pointer-events-auto'>
      <div className='sm:flex sm:items-start w-full justify-between'>
        <div className='w-full'>
          <div className='w-full flex flex-row justify-between items-center'>
            <h3 className='text-lg leading-6 font-medium text-gray-900'>
              {title}
            </h3>

            {onClose && (
              <IconButton
                src={require('@tabler/icons/icons/x.svg')}
                title={intl.formatMessage(messages.close)}
                onClick={onClose}
                className='text-gray-500 hover:text-gray-700'
              />
            )}
          </div>

          <div className={classNames('mt-2 w-full')}>
            {children}
          </div>
        </div>
      </div>

      {confirmationAction && (
        <div className='mt-5 flex flex-row justify-between'>
          <div className='flex-grow'>
            {cancelAction && (
              <Button
                theme='ghost'
                onClick={cancelAction}
              >
                {cancelText}
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
