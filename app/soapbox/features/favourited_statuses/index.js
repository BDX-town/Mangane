import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { fetchFavouritedStatuses, expandFavouritedStatuses, fetchAccountFavouritedStatuses, expandAccountFavouritedStatuses } from '../../actions/favourites';
import Column from '../ui/components/column';
import StatusList from '../../components/status_list';
import { injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { debounce } from 'lodash';
import MissingIndicator from 'soapbox/components/missing_indicator';
import { fetchAccount, fetchAccountByUsername } from '../../actions/accounts';
import LoadingIndicator from '../../components/loading_indicator';

const mapStateToProps = (state, { params }) => {
  const username = params.username || '';
  const me = state.get('me');
  const meUsername = state.getIn(['accounts', me, 'username'], '');

  const isMyAccount = (username.toLowerCase() === meUsername.toLowerCase());

  if (isMyAccount) {
    return {
      isMyAccount,
      statusIds: state.getIn(['status_lists', 'favourites', 'items']),
      isLoading: state.getIn(['status_lists', 'favourites', 'isLoading'], true),
      hasMore: !!state.getIn(['status_lists', 'favourites', 'next']),
    };
  }

  const accounts = state.getIn(['accounts']);
  const accountFetchError = (state.getIn(['accounts', -1, 'username'], '').toLowerCase() === username.toLowerCase());

  let accountId = -1;
  if (accountFetchError) {
    accountId = null;
  } else {
    const account = accounts.find(acct => username.toLowerCase() === acct.getIn(['acct'], '').toLowerCase());
    accountId = account ? account.getIn(['id'], null) : -1;
  }

  const isBlocked = state.getIn(['relationships', accountId, 'blocked_by'], false);
  const unavailable = (me === accountId) ? false : isBlocked;

  return {
    isMyAccount,
    accountId,
    unavailable,
    username,
    isAccount: !!state.getIn(['accounts', accountId]),
    statusIds: state.getIn(['status_lists', `favourites:${accountId}`, 'items'], []),
    isLoading: state.getIn(['status_lists', `favourites:${accountId}`, 'isLoading'], true),
    hasMore: !!state.getIn(['status_lists', `favourites:${accountId}`, 'next']),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class Favourites extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    statusIds: ImmutablePropTypes.orderedSet.isRequired,
    intl: PropTypes.object.isRequired,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
    isMyAccount: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { accountId, isMyAccount, username } = this.props;

    if (isMyAccount)
      this.props.dispatch(fetchFavouritedStatuses());
    else {
      if (accountId && accountId !== -1) {
        this.props.dispatch(fetchAccount(accountId));
        this.props.dispatch(fetchAccountFavouritedStatuses(accountId));
      } else {
        this.props.dispatch(fetchAccountByUsername(username));
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { accountId, isMyAccount } = this.props;

    if (!isMyAccount && accountId && accountId !== -1 && (accountId !== prevProps.accountId && accountId)) {
      this.props.dispatch(fetchAccount(accountId));
      this.props.dispatch(fetchAccountFavouritedStatuses(accountId));
    }
  }

  handleLoadMore = debounce(() => {
    const { accountId, isMyAccount } = this.props;

    if (isMyAccount) {
      this.props.dispatch(expandFavouritedStatuses());
    } else {
      this.props.dispatch(expandAccountFavouritedStatuses(accountId));
    }
  }, 300, { leading: true })

  render() {
    const { statusIds, isLoading, hasMore, isMyAccount, isAccount, accountId, unavailable } = this.props;

    if (!isMyAccount && !isAccount && accountId !== -1) {
      return (
        <Column>
          <MissingIndicator />
        </Column>
      );
    }

    if (accountId === -1) {
      return (
        <Column>
          <LoadingIndicator />
        </Column>
      );
    }

    if (unavailable) {
      return (
        <Column>
          <div className='empty-column-indicator'>
            <FormattedMessage id='empty_column.account_unavailable' defaultMessage='Profile unavailable' />
          </div>
        </Column>
      );
    }

    const emptyMessage = isMyAccount
      ? <FormattedMessage id='empty_column.favourited_statuses' defaultMessage="You don't have any liked posts yet. When you like one, it will show up here." />
      : <FormattedMessage id='empty_column.account_favourited_statuses' defaultMessage="This user doesn't have any liked posts yet." />;

    return (
      <Column>
        <StatusList
          statusIds={statusIds}
          scrollKey='favourited_statuses'
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={this.handleLoadMore}
          emptyMessage={emptyMessage}
        />
      </Column>
    );
  }

}
