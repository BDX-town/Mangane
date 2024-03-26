import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import {
  fetchAccount,
  fetchFollowers,
  expandFollowers,
  fetchAccountByUsername,
} from 'soapbox/actions/accounts';
import MissingIndicator from 'soapbox/components/missing_indicator';
import ScrollableList from 'soapbox/components/scrollable_list';
import { Spinner } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import { findAccountByUsername } from 'soapbox/selectors';
import { getFollowDifference } from 'soapbox/utils/accounts';
import { getFeatures } from 'soapbox/utils/features';

import Column from '../ui/components/column';

const messages = defineMessages({
  heading: { id: 'column.followers', defaultMessage: 'Followers' },
});

const mapStateToProps = (state, { params, withReplies = false }) => {
  const username = params.username || '';
  const me = state.get('me');
  const accountFetchError = ((state.getIn(['accounts', -1, 'username']) || '').toLowerCase() === username.toLowerCase());
  const features = getFeatures(state.get('instance'));

  let accountId = -1;
  let account = null;
  if (accountFetchError) {
    accountId = null;
  } else {
    account = findAccountByUsername(state, username);
    accountId = account ? account.getIn(['id'], null) : -1;
  }

  const diffCount = getFollowDifference(state, accountId, 'followers');
  const isBlocked = state.getIn(['relationships', accountId, 'blocked_by'], false);
  const unavailable = (me === accountId) ? false : ((isBlocked && !features.blockersVisible) || account?.pleroma?.get('hide_followers'));

  return {
    accountId,
    unavailable,
    isAccount: !!state.getIn(['accounts', accountId]),
    accountIds: state.user_lists.followers.get(accountId)?.items,
    hasMore: !!state.user_lists.followers.get(accountId)?.next,
    diffCount,
  };
};

export default @connect(mapStateToProps)
@injectIntl
class Followers extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
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
    const { intl, accountIds, hasMore, diffCount, isAccount, accountId, unavailable } = this.props;

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
      <Column label={intl.formatMessage(messages.heading)} transparent>
        <ScrollableList
          scrollKey='followers'
          hasMore={hasMore}
          diffCount={diffCount}
          onLoadMore={this.handleLoadMore}
          emptyMessage={<FormattedMessage id='account.followers.empty' defaultMessage='No one follows this user yet.' />}
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
