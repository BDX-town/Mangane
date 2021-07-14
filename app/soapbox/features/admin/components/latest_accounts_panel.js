import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import AccountListPanel from 'soapbox/features/ui/components/account_list_panel';
import { fetchUsers } from 'soapbox/actions/admin';

const messages = defineMessages({
  title: { id: 'admin.latest_accounts_panel.title', defaultMessage: 'Latest Accounts' },
  expand: { id: 'admin.latest_accounts_panel.expand_message', defaultMessage: 'Click to see {count} more {count, plural, one {account} other {accounts}}' },
});

const mapStateToProps = state => ({
  accountIds: state.getIn(['admin', 'latestUsers']),
});

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
    const { intl, accountIds, limit, ...props } = this.props;
    const { total } = this.state;

    if (!accountIds || accountIds.isEmpty()) {
      return null;
    }

    return (
      <AccountListPanel
        icon='users'
        title={intl.formatMessage(messages.title)}
        accountIds={accountIds}
        limit={limit}
        total={total}
        expandMessage={intl.formatMessage(messages.expand, { count: total })}
        expandRoute='/admin/users'
        withDate
        withRelationship={false}
        {...props}
      />
    );
  };

};
