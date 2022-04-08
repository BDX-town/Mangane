import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

import { SimpleForm, FieldsGroup, Checkbox } from 'soapbox/features/forms';

import { Modal } from '../../../components/ui';

export default @injectIntl
class ConfirmationModal extends React.PureComponent {

  static propTypes = {
    heading: PropTypes.node,
    icon: PropTypes.node,
    message: PropTypes.node.isRequired,
    confirm: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    secondary: PropTypes.string,
    onSecondary: PropTypes.func,
    intl: PropTypes.object.isRequired,
    onCancel: PropTypes.func,
    checkbox: PropTypes.node,
  };

  state = {
    checked: false,
  }

  handleClick = () => {
    this.props.onClose('CONFIRM');
    this.props.onConfirm();
  }

  handleSecondary = () => {
    this.props.onClose('CONFIRM');
    this.props.onSecondary();
  }

  handleCancel = () => {
    const { onClose, onCancel } = this.props;
    onClose('CONFIRM');
    if (onCancel) onCancel();
  }

  handleCheckboxChange = e => {
    this.setState({ checked: e.target.checked });
  }

  render() {
    const { heading, message, confirm, secondary, checkbox } = this.props;
    const { checked } = this.state;

    return (
      <Modal
        title={heading}
        confirmationAction={this.handleClick}
        confirmationText={confirm}
        confirmationDisabled={checkbox && !checked}
        confirmationTheme='danger'
        cancelText={<FormattedMessage id='confirmation_modal.cancel' defaultMessage='Cancel' />}
        cancelAction={this.handleCancel}
        secondaryText={secondary}
        secondaryAction={this.props.onSecondary && this.handleSecondary}
      >
        <p className='text-gray-600 dark:text-gray-300'>{message}</p>

        <div className='mt-2'>
          {checkbox && <div className='confirmation-modal__checkbox'>
            <SimpleForm>
              <FieldsGroup>
                <Checkbox
                  onChange={this.handleCheckboxChange}
                  label={checkbox}
                  checked={checked}
                />
              </FieldsGroup>
            </SimpleForm>
          </div>}
        </div>
      </Modal>
    );
  }

}
