import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Column from '../ui/components/column';
import IconButton from 'soapbox/components/icon_button';
import ScrollableList from 'soapbox/components/scrollable_list';
import { fetchUsers, deleteUsers, approveUsers } from 'soapbox/actions/admin';
import snackbar from 'soapbox/actions/snackbar';

const messages = defineMessages({
  heading: { id: 'column.admin.awaiting_approval', defaultMessage: 'Awaiting Approval' },
  emptyMessage: { id: 'admin.awaiting_approval.empty_message', defaultMessage: 'There is nobody waiting for approval. When a new user signs up, you can review them here.' },
  approved: { id: 'admin.awaiting_approval.approved_message', defaultMessage: '{acct} was approved!' },
  rejected: { id: 'admin.awaiting_approval.rejected_message', defaultMessage: '{acct} was rejected.' },
});

const mapStateToProps = state => {
  const nicknames = state.getIn(['admin', 'awaitingApproval']);
  return {
    users: nicknames.toList().map(nickname => state.getIn(['admin', 'users', nickname])),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class AwaitingApproval extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    users: ImmutablePropTypes.list.isRequired,
  };

  state = {
    isLoading: true,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const params = { page: 1, filters: 'local,need_approval' };
    dispatch(fetchUsers(params))
      .then(() => this.setState({ isLoading: false }))
      .catch(() => {});
  }

  handleApprove = nickname => {
    const { dispatch, intl } = this.props;
    return e => {
      dispatch(approveUsers([nickname])).then(() => {
        const message = intl.formatMessage(messages.approved, { acct: `@${nickname}` });
        dispatch(snackbar.success(message));
      }).catch(() => {});
    };
  }

  handleReject = nickname => {
    const { dispatch, intl } = this.props;
    return e => {
      dispatch(deleteUsers([nickname])).then(() => {
        const message = intl.formatMessage(messages.rejected, { acct: `@${nickname}` });
        dispatch(snackbar.info(message));
      }).catch(() => {});
    };
  }

  render() {
    const { intl, users } = this.props;
    const { isLoading } = this.state;

    return (
      <Column icon='user' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <ScrollableList isLoading={isLoading} showLoading={isLoading} scrollKey='awaiting-approval' emptyMessage={intl.formatMessage(messages.emptyMessage)}>
          {users.map((user, i) => (
            <div className='unapproved-account' key={user.get('id')}>
              <div className='unapproved-account__bio'>
                <div className='unapproved-account__nickname'>@{user.get('nickname')}</div>
                <blockquote className='unapproved-account__reason'>{user.get('registration_reason')}</blockquote>
              </div>
              <div className='unapproved-account__actions'>
                <IconButton icon='check' size={22} onClick={this.handleApprove(user.get('nickname'))} />
                <IconButton icon='close' size={22} onClick={this.handleReject(user.get('nickname'))} />
              </div>
            </div>
          ))}
        </ScrollableList>
      </Column>
    );
  }

}
