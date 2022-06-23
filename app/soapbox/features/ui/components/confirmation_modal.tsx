import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Modal } from 'soapbox/components/ui';
import { SimpleForm, FieldsGroup, Checkbox } from 'soapbox/features/forms';

interface IConfirmationModal {
  heading: React.ReactNode,
  message: React.ReactNode,
  confirm: React.ReactNode,
  onClose: (type: string) => void,
  onConfirm: () => void,
  secondary: React.ReactNode,
  onSecondary?: () => void,
  onCancel: () => void,
  checkbox?: JSX.Element,
}

const ConfirmationModal: React.FC<IConfirmationModal> = ({
  heading,
  message,
  confirm,
  onClose,
  onConfirm,
  secondary,
  onSecondary,
  onCancel,
  checkbox,
}) => {
  const [checked, setChecked] = useState(false);

  const handleClick = () => {
    onClose('CONFIRM');
    onConfirm();
  };

  const handleSecondary = () => {
    onClose('CONFIRM');
    onSecondary!();
  };

  const handleCancel = () => {
    onClose('CONFIRM');
    if (onCancel) onCancel();
  };

  const handleCheckboxChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    setChecked(e.target.checked);
  };

  return (
    <Modal
      title={heading}
      confirmationAction={handleClick}
      confirmationText={confirm}
      confirmationDisabled={checkbox && !checked}
      confirmationTheme='danger'
      cancelText={<FormattedMessage id='confirmation_modal.cancel' defaultMessage='Cancel' />}
      cancelAction={handleCancel}
      secondaryText={secondary}
      secondaryAction={onSecondary && handleSecondary}
    >
      <p className='text-gray-600 dark:text-gray-300'>{message}</p>

      <div className='mt-2'>
        {checkbox && <div className='confirmation-modal__checkbox'>
          <SimpleForm>
            <FieldsGroup>
              <Checkbox
                onChange={handleCheckboxChange}
                label={checkbox}
                checked={checked}
              />
            </FieldsGroup>
          </SimpleForm>
        </div>}
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
