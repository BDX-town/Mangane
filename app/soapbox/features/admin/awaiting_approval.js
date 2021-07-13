import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Column from '../ui/components/column';
import ScrollableList from 'soapbox/components/scrollable_list';
import UnapprovedAccount from './components/unapproved_account';
import { fetchUsers } from 'soapbox/actions/admin';

const messages = defineMessages({
  heading: { id: 'column.admin.awaiting_approval', defaultMessage: 'Awaiting Approval' },
  emptyMessage: { id: 'admin.awaiting_approval.empty_message', defaultMessage: 'There is nobody waiting for approval. When a new user signs up, you can review them here.' },
});

const mapStateToProps = state => ({
  accountIds: state.getIn(['admin', 'awaitingApproval']),
});

export default @connect(mapStateToProps)
@injectIntl
class AwaitingApproval extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    accountIds: ImmutablePropTypes.orderedSet.isRequired,
  };

  state = {
    isLoading: true,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchUsers(['local', 'need_approval']))
      .then(() => this.setState({ isLoading: false }))
      .catch(() => {});
  }

  render() {
    const { intl, accountIds } = this.props;
    const { isLoading } = this.state;
    const showLoading = isLoading && accountIds.count() === 0;

    return (
      <Column icon='user' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <ScrollableList
          isLoading={isLoading}
          showLoading={showLoading}
          scrollKey='awaiting-approval'
          emptyMessage={intl.formatMessage(messages.emptyMessage)}
        >
          {accountIds.map(id => (
            <UnapprovedAccount accountId={id} key={id} />
          ))}
        </ScrollableList>
      </Column>
    );
  }

}
