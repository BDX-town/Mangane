import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Toggle from 'react-toggle';

import { muteAccount } from 'soapbox/actions/accounts';
import { closeModal } from 'soapbox/actions/modals';
import { toggleHideNotifications } from 'soapbox/actions/mutes';
import { Modal, HStack, Stack } from 'soapbox/components/ui';

import { Text } from '../../../components/ui';

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

  handleClick = () => {
    this.props.onClose();
    this.props.onConfirm(this.props.account, this.props.notifications);
  }

  handleCancel = () => {
    this.props.onClose();
  }

  toggleNotifications = () => {
    this.props.onToggleNotifications();
  }

  render() {
    const { account, notifications } = this.props;

    return (
      <Modal
        title={
          <FormattedMessage
            id='confirmations.mute.heading'
            defaultMessage='Mute @{name}'
            values={{ name: account.get('acct') }}
          />
        }
        onClose={this.handleCancel}
        confirmationAction={this.handleClick}
        confirmationText={<FormattedMessage id='confirmations.mute.confirm' defaultMessage='Mute' />}
        cancelText={<FormattedMessage id='confirmation_modal.cancel' defaultMessage='Cancel' />}
        cancelAction={this.handleCancel}
      >
        <Stack space={4}>
          <Text>
            <FormattedMessage
              id='confirmations.mute.message'
              defaultMessage='Are you sure you want to mute {name}?'
              values={{ name: <strong>@{account.get('acct')}</strong> }}
            />
          </Text>

          <label>
            <HStack alignItems='center' space={2}>
              <Text tag='span'>
                <FormattedMessage id='mute_modal.hide_notifications' defaultMessage='Hide notifications from this user?' />
              </Text>

              <Toggle
                checked={notifications}
                onChange={this.toggleNotifications}
                icons={false}
              />
            </HStack>
          </label>
        </Stack>
      </Modal>
    );
  }

}
