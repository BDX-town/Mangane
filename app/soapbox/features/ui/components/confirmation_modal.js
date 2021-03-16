import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import Button from '../../../components/button';
import { SimpleForm, FieldsGroup, Checkbox } from 'soapbox/features/forms';

export default @injectIntl
class ConfirmationModal extends React.PureComponent {

  static propTypes = {
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

  componentDidMount() {
    this.button.focus();
  }

  handleClick = () => {
    this.props.onClose();
    this.props.onConfirm();
  }

  handleSecondary = () => {
    this.props.onClose();
    this.props.onSecondary();
  }

  handleCancel = () => {
    const { onClose, onCancel } = this.props;
    onClose();
    if (onCancel) onCancel();
  }

  handleCheckboxChange = e => {
    this.setState({ checked: e.target.checked });
  }

  setRef = (c) => {
    this.button = c;
  }

  render() {
    const { message, confirm, secondary, checkbox } = this.props;
    const { checked } = this.state;

    return (
      <div className='modal-root__modal confirmation-modal'>
        <div className='confirmation-modal__container'>
          {message}
        </div>

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

        <div className='confirmation-modal__action-bar'>
          <Button onClick={this.handleCancel} className='confirmation-modal__cancel-button'>
            <FormattedMessage id='confirmation_modal.cancel' defaultMessage='Cancel' />
          </Button>
          {secondary !== undefined && (
            <Button text={secondary} onClick={this.handleSecondary} className='confirmation-modal__secondary-button' />
          )}
          <Button
            text={confirm}
            onClick={this.handleClick}
            ref={this.setRef}
            disabled={checkbox && !checked}
          />
        </div>
      </div>
    );
  }

}
