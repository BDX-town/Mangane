import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Toggle from 'react-toggle';

import { muteAccount } from 'soapbox/actions/accounts';
import { closeModal } from 'soapbox/actions/modal';
import { toggleHideNotifications } from 'soapbox/actions/mutes';
import Button from 'soapbox/components/button';
import Icon from 'soapbox/components/icon';


const mapStateToProps = state => {
  return {
    isSubmitting: state.getIn(['reports', 'new', 'isSubmitting']),
    account: state.getIn(['mutes', 'new', 'account']),
    notifications: state.getIn(['mutes', 'new', 'notifications']),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onConfirm(account, notifications) {
      dispatch(muteAccount(account.get('id'), notifications));
    },

    onClose() {
      dispatch(closeModal());
    },

    onToggleNotifications() {
      dispatch(toggleHideNotifications());
    },
  };
};

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class MuteModal extends React.PureComponent {

  static propTypes = {
    isSubmitting: PropTypes.bool.isRequired,
    account: PropTypes.object.isRequired,
    notifications: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onToggleNotifications: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.button.focus();
  }

  handleClick = () => {
    this.props.onClose();
    this.props.onConfirm(this.props.account, this.props.notifications);
  }

  handleCancel = () => {
    this.props.onClose();
  }

  setRef = (c) => {
    this.button = c;
  }

  toggleNotifications = () => {
    this.props.onToggleNotifications();
  }

  render() {
    const { account, notifications } = this.props;

    return (
      <div className='modal-root__modal mute-modal'>
        <div className='mute-modal__header'>
          <Icon src={require('@tabler/icons/icons/circle-x.svg')} />
          <FormattedMessage
            id='confirmations.mute.heading'
            defaultMessage='Mute @{name}'
            values={{ name: account.get('acct') }}
          />
        </div>
        <div className='mute-modal__container'>
          <p>
            <FormattedMessage
              id='confirmations.mute.message'
              defaultMessage='Are you sure you want to mute {name}?'
              values={{ name: <strong>@{account.get('acct')}</strong> }}
            />
          </p>
          <div>
            <label htmlFor='mute-modal__hide-notifications-checkbox'>
              <FormattedMessage id='mute_modal.hide_notifications' defaultMessage='Hide notifications from this user?' />
              {' '}
              <Toggle id='mute-modal__hide-notifications-checkbox' checked={notifications} onChange={this.toggleNotifications} />
            </label>
          </div>
        </div>

        <div className='mute-modal__action-bar'>
          <Button onClick={this.handleCancel} className='mute-modal__cancel-button'>
            <FormattedMessage id='confirmation_modal.cancel' defaultMessage='Cancel' />
          </Button>
          <Button onClick={this.handleClick} ref={this.setRef}>
            <FormattedMessage id='confirmations.mute.confirm' defaultMessage='Mute' />
          </Button>
        </div>
      </div>
    );
  }

}
