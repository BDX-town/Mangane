import React from 'react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import {
  followAccount,
  unfollowAccount,
  blockAccount,
  unblockAccount,
  muteAccount,
  unmuteAccount,
} from '../actions/accounts';
import { openModal } from '../actions/modals';
import { initMuteModal } from '../actions/mutes';
import { getSettings } from '../actions/settings';
import Account from '../components/account';
import { makeGetAccount } from '../selectors';

const messages = defineMessages({
  unfollowConfirm: { id: 'confirmations.unfollow.confirm', defaultMessage: 'Unfollow' },
});

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, props) => ({
    account: getAccount(state, props.id),
  });

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch, { intl }) => ({

  onFollow(account) {
    dispatch((_, getState) => {
      const unfollowModal = getSettings(getState()).get('unfollowModal');
      if (account.getIn(['relationship', 'following']) || account.getIn(['relationship', 'requested'])) {
        if (unfollowModal) {
          dispatch(openModal('CONFIRM', {
            icon: require('@tabler/icons/icons/minus.svg'),
            heading: <FormattedMessage id='confirmations.unfollow.heading' defaultMessage='Unfollow {name}' values={{ name: <strong>@{account.get('acct')}</strong> }} />,
            message: <FormattedMessage id='confirmations.unfollow.message' defaultMessage='Are you sure you want to unfollow {name}?' values={{ name: <strong>@{account.get('acct')}</strong> }} />,
            confirm: intl.formatMessage(messages.unfollowConfirm),
            onConfirm: () => dispatch(unfollowAccount(account.get('id'))),
          }));
        } else {
          dispatch(unfollowAccount(account.get('id')));
        }
      } else {
        dispatch(followAccount(account.get('id')));
      }
    });
  },

  onBlock(account) {
    if (account.getIn(['relationship', 'blocking'])) {
      dispatch(unblockAccount(account.get('id')));
    } else {
      dispatch(blockAccount(account.get('id')));
    }
  },

  onMute(account) {
    if (account.getIn(['relationship', 'muting'])) {
      dispatch(unmuteAccount(account.get('id')));
    } else {
      dispatch(initMuteModal(account));
    }
  },

  onMuteNotifications(account, notifications) {
    dispatch(muteAccount(account.get('id'), notifications));
  },
});

export default injectIntl(connect(makeMapStateToProps, mapDispatchToProps)(Account));
