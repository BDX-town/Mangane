import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import MissingIndicator from 'soapbox/components/missing_indicator';
import { Spinner } from 'soapbox/components/ui';
import { findAccountByUsername } from 'soapbox/selectors';
import { getFollowDifference } from 'soapbox/utils/accounts';
import { getFeatures } from 'soapbox/utils/features';

import {
  fetchAccount,
  fetchFollowing,
  expandFollowing,
  fetchAccountByUsername,
} from '../../actions/accounts';
import ScrollableList from '../../components/scrollable_list';
import AccountContainer from '../../containers/account_container';
import Column from '../ui/components/column';

const messages = defineMessages({
  heading: { id: 'column.following', defaultMessage: 'Following' },
});

const mapStateToProps = (state, { params, withReplies = false }) => {
  const username = params.username || '';
  const me = state.get('me');
  const accountFetchError = ((state.getIn(['accounts', -1, 'username']) || '').toLowerCase() === username.toLowerCase());
  const features = getFeatures(state.get('instance'));

  let accountId = -1;
  if (accountFetchError) {
    accountId = null;
  } else {
    const account = findAccountByUsername(state, username);
    accountId = account ? account.getIn(['id'], null) : -1;
  }

  const diffCount = getFollowDifference(state, accountId, 'following');
  const isBlocked = state.getIn(['relationships', accountId, 'blocked_by'], false);
  const unavailable = (me === accountId) ? false : (isBlocked && !features.blockersVisible);

  return {
    accountId,
    unavailable,
    isAccount: !!state.getIn(['accounts', accountId]),
    accountIds: state.getIn(['user_lists', 'following', accountId, 'items']),
    hasMore: !!state.getIn(['user_lists', 'following', accountId, 'next']),
    diffCount,
  };
};

export default @connect(mapStateToProps)
@injectIntl
class Following extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.orderedSet,
    hasMore: PropTypes.bool,
    isAccount: PropTypes.bool,
    unavailable: PropTypes.bool,
    diffCount: PropTypes.number,
  };

  componentDidMount() {
    const { params: { username }, accountId } = this.props;

    if (accountId && accountId !== -1) {
      this.props.dispatch(fetchAccount(accountId));
      this.props.dispatch(fetchFollowing(accountId));
    } else {
      this.props.dispatch(fetchAccountByUsername(username));
    }
  }

  componentDidUpdate(prevProps) {
    const { accountId, dispatch } = this.props;
    if (accountId && accountId !== -1 && (accountId !== prevProps.accountId && accountId)) {
      dispatch(fetchAccount(accountId));
      dispatch(fetchFollowing(accountId));
    }
  }

  handleLoadMore = debounce(() => {
    if (this.props.accountId && this.props.accountId !== -1) {
      this.props.dispatch(expandFollowing(this.props.accountId));
    }
  }, 300, { leading: true });

  render() {
    const { intl, accountIds, hasMore, isAccount, diffCount, accountId, unavailable } = this.props;

    if (!isAccount && accountId !== -1) {
      return (
        <MissingIndicator />
      );
    }

    if (accountId === -1 || (!accountIds)) {
      return (
        <Spinner />
      );
    }

    if (unavailable) {
      return (
        <div className='empty-column-indicator'>
          <FormattedMessage id='empty_column.account_unavailable' defaultMessage='Profile unavailable' />
        </div>
      );
    }

    return (
      <Column label={intl.formatMessage(messages.heading)} withHeader={false} transparent>
        <ScrollableList
          scrollKey='following'
          hasMore={hasMore}
          diffCount={diffCount}
          onLoadMore={this.handleLoadMore}
          emptyMessage={<FormattedMessage id='account.follows.empty' defaultMessage="This user doesn't follow anyone yet." />}
          itemClassName='pb-4'
        >
          {accountIds.map(id =>
            <AccountContainer key={id} id={id} withNote={false} />,
          )}
        </ScrollableList>
      </Column>
    );
  }

}
