import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import Button from '../../../components/button';

export default @injectIntl
class MissingDescriptionModal extends React.PureComponent {

  static propTypes = {
    onClose: PropTypes.func,
    onContinue: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.button.focus();
  }

  handleContinue = () => {
    this.props.onClose();
    this.props.onContinue();
  }

  handleCancel = () => {
    this.props.onClose();
  }

  setRef = (c) => {
    this.button = c;
  }

  render() {
    return (
      <div className='modal-root__modal confirmation-modal'>
        <div className='confirmation-modal__container'>
          <FormattedMessage id='missing_description_modal.text' defaultMessage='You have not entered a description for all attachments. Continue anyway?' />
        </div>

        <div className='confirmation-modal__action-bar'>
          <Button onClick={this.handleCancel} className='confirmation-modal__cancel-button' ref={this.setRef}>
            <FormattedMessage id='missing_description_modal.cancel' defaultMessage='Cancel' />
          </Button>
          <Button onClick={this.handleContinue}>
            <FormattedMessage id='missing_description_modal.continue' defaultMessage='Post' />
          </Button>
        </div>
      </div>
    );
  }

}
