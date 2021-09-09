import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import IconButton from 'soapbox/components/icon_button';
import { deleteUsers, approveUsers } from 'soapbox/actions/admin';
import { makeGetAccount } from 'soapbox/selectors';
import snackbar from 'soapbox/actions/snackbar';

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

    dispatch(deleteUsers([account.get('id')]))
      .then(() => {
        const message = intl.formatMessage(messages.rejected, { acct: `@${account.get('acct')}` });
        dispatch(snackbar.info(message));
      })
      .catch(() => {});
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
          <IconButton icon='check' size={22} onClick={this.handleApprove} />
          <IconButton icon='close' size={22} onClick={this.handleReject} />
        </div>
      </div>
    );
  }

}
