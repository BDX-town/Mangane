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

  componentDidMount() {
    const { dispatch, limit } = this.props;
    dispatch(fetchUsers(['local', 'active'], 1, null, limit));
  }

  render() {
    const { intl, accountIds, limit, ...props } = this.props;

    if (!accountIds || accountIds.isEmpty()) {
      return null;
    }

    return (
      <AccountListPanel
        icon='users'
        title={intl.formatMessage(messages.title)}
        accountIds={accountIds}
        limit={limit}
        {...props}
      />
    );
  };

};
