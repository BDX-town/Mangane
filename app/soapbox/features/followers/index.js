import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { debounce } from 'lodash';
import LoadingIndicator from '../../components/loading_indicator';
import {
  fetchAccount,
  fetchFollowers,
  expandFollowers,
  fetchAccountByUsername,
} from '../../actions/accounts';
import { FormattedMessage } from 'react-intl';
import AccountContainer from '../../containers/account_container';
import Column from '../ui/components/column';
import ScrollableList from '../../components/scrollable_list';
import MissingIndicator from 'soapbox/components/missing_indicator';
import { getFollowDifference } from 'soapbox/utils/accounts';

const mapStateToProps = (state, { params, withReplies = false }) => {
  const username = params.username || '';
  const me = state.get('me');
  const accounts = state.getIn(['accounts']);
  const accountFetchError = (state.getIn(['accounts', -1, 'username'], '').toLowerCase() === username.toLowerCase());

  let accountId = -1;
  if (accountFetchError) {
    accountId = null;
  } else {
    const account = accounts.find(acct => username.toLowerCase() === acct.getIn(['acct'], '').toLowerCase());
    accountId = account ? account.getIn(['id'], null) : -1;
  }

  const diffCount = getFollowDifference(state, accountId, 'followers');
  const isBlocked = state.getIn(['relationships', accountId, 'blocked_by'], false);
  const unavailable = (me === accountId) ? false : isBlocked;

  return {
    accountId,
    unavailable,
    isAccount: !!state.getIn(['accounts', accountId]),
    accountIds: state.getIn(['user_lists', 'followers', accountId, 'items']),
    hasMore: !!state.getIn(['user_lists', 'followers', accountId, 'next']),
    diffCount,
  };
};

export default @connect(mapStateToProps)
class Followers extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.orderedSet,
    hasMore: PropTypes.bool,
    diffCount: PropTypes.number,
    isAccount: PropTypes.bool,
    unavailable: PropTypes.bool,
  };

  componentDidMount() {
    const { params: { username }, accountId } = this.props;

    if (accountId && accountId !== -1) {
      this.props.dispatch(fetchAccount(accountId));
      this.props.dispatch(fetchFollowers(accountId));
    } else {
      this.props.dispatch(fetchAccountByUsername(username));
    }
  }

  componentDidUpdate(prevProps) {
    const { accountId, dispatch } = this.props;
    if (accountId && accountId !== -1 && (accountId !== prevProps.accountId && accountId)) {
      dispatch(fetchAccount(accountId));
      dispatch(fetchFollowers(accountId));
    }
  }

  handleLoadMore = debounce(() => {
    if (this.props.accountId && this.props.accountId !== -1) {
      this.props.dispatch(expandFollowers(this.props.accountId));
    }
  }, 300, { leading: true });

  render() {
    const { accountIds, hasMore, diffCount, isAccount, accountId, unavailable } = this.props;

    if (!isAccount && accountId !== -1) {
      return (
        <Column>
          <MissingIndicator />
        </Column>
      );
    }

    if (accountId === -1 || (!accountIds)) {
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

    return (
      <Column>
        <ScrollableList
          scrollKey='followers'
          hasMore={hasMore}
          diffCount={diffCount}
          onLoadMore={this.handleLoadMore}
          emptyMessage={<FormattedMessage id='account.followers.empty' defaultMessage='No one follows this user yet.' />}
        >
          {accountIds.map(id =>
            <AccountContainer key={id} id={id} withNote={false} />,
          )}
        </ScrollableList>
      </Column>
    );
  }

}
