import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import AccountListPanel from 'soapbox/features/ui/components/account_list_panel';
import { fetchUsers } from 'soapbox/actions/admin';
import { is } from 'immutable';
import compareId from 'soapbox/compare_id';

const messages = defineMessages({
  title: { id: 'admin.latest_accounts_panel.title', defaultMessage: 'Latest Accounts' },
  expand: { id: 'admin.latest_accounts_panel.expand_message', defaultMessage: 'Click to see {count} more {count, plural, one {account} other {accounts}}' },
});

const mapStateToProps = state => {
  const accountIds = state.getIn(['admin', 'latestUsers']);

  // HACK: AdminAPI only recently started sorting new users at the top.
  // Try a dirty check to see if the users are sorted properly, or don't show the panel.
  // Probably works most of the time.
  const sortedIds = accountIds.sort(compareId).reverse();
  const hasDates  = accountIds.every(id => state.getIn(['accounts', id, 'created_at']));
  const isSorted  = hasDates && is(accountIds, sortedIds);

  return {
    isSorted,
    accountIds,
  };
};

export default @connect(mapStateToProps)
@injectIntl
class LatestAccountsPanel extends ImmutablePureComponent {

  static propTypes = {
    accountIds: ImmutablePropTypes.orderedSet.isRequired,
    limit: PropTypes.number,
  };

  static defaultProps = {
    limit: 5,
  }

  state = {
    total: 0,
  }

  componentDidMount() {
    const { dispatch, limit } = this.props;

    dispatch(fetchUsers(['local', 'active'], 1, null, limit))
      .then(({ count }) => {
        this.setState({ total: count });
      })
      .catch(() => {});
  }

  render() {
    const { intl, accountIds, limit, isSorted, ...props } = this.props;
    const { total } = this.state;

    if (!isSorted || !accountIds || accountIds.isEmpty()) {
      return null;
    }

    const expandCount = total - accountIds.size;

    return (
      <AccountListPanel
        icon='users'
        title={intl.formatMessage(messages.title)}
        accountIds={accountIds}
        limit={limit}
        total={total}
        expandMessage={intl.formatMessage(messages.expand, { count: expandCount })}
        expandRoute='/admin/users'
        withDate
        withRelationship={false}
        {...props}
      />
    );
  }

}
