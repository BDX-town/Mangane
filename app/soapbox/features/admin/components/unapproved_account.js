import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { approveUsers } from 'soapbox/actions/admin';
import snackbar from 'soapbox/actions/snackbar';
import IconButton from 'soapbox/components/icon_button';
import { makeGetAccount } from 'soapbox/selectors';

import { rejectUserModal } from '../../../actions/moderation';

const messages = defineMessages({
  approved: { id: 'admin.awaiting_approval.approved_message', defaultMessage: '{acct} was approved!' },
  rejected: { id: 'admin.awaiting_approval.rejected_message', defaultMessage: '{acct} was rejected.' },
});

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, { accountId }) => {
    return {
      account: getAccount(state, accountId),
    };
  };

  return mapStateToProps;
};

export default @connect(makeMapStateToProps)
@injectIntl
class UnapprovedAccount extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map.isRequired,
  };

  handleApprove = () => {
    const { dispatch, intl, account } = this.props;
    dispatch(approveUsers([account.get('id')]))
      .then(() => {
        const message = intl.formatMessage(messages.approved, { acct: `@${account.get('acct')}` });
        dispatch(snackbar.success(message));
      })
      .catch(() => {});
  }

  handleReject = () => {
    const { dispatch, intl, account } = this.props;

    dispatch(rejectUserModal(intl, account.get('id'), () => {
      const message = intl.formatMessage(messages.rejected, { acct: `@${account.get('acct')}` });
      dispatch(snackbar.info(message));
    }));
  }

  render() {
    const { account } = this.props;

    return (
      <div className='unapproved-account'>
        <div className='unapproved-account__bio'>
          <div className='unapproved-account__nickname'>@{account.get('acct')}</div>
          <blockquote className='md'>{account.getIn(['pleroma', 'admin', 'registration_reason'])}</blockquote>
        </div>
        <div className='unapproved-account__actions'>
          <IconButton src={require('@tabler/icons/icons/check.svg')} onClick={this.handleApprove} />
          <IconButton src={require('@tabler/icons/icons/x.svg')} onClick={this.handleReject} />
        </div>
      </div>
    );
  }

}
