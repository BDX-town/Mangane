import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { fetchAccountByUsername } from 'soapbox/actions/accounts';
import { fetchPatronAccount } from 'soapbox/actions/patron';
import { getSettings } from 'soapbox/actions/settings';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { expandAccountFeaturedTimeline, expandAccountTimeline } from 'soapbox/actions/timelines';
import MissingIndicator from 'soapbox/components/missing_indicator';
import StatusList from 'soapbox/components/status_list';
import { Card, CardBody, Spinner, Text } from 'soapbox/components/ui';
import { makeGetStatusIds, findAccountByUsername } from 'soapbox/selectors';
import { getFeatures } from 'soapbox/utils/features';

const makeMapStateToProps = () => {
  const getStatusIds = makeGetStatusIds();

  const mapStateToProps = (state, { params, withReplies = false }) => {
    const username = params.username || '';
    const me = state.get('me');
    const accountFetchError = ((state.getIn(['accounts', -1, 'username']) || '').toLowerCase() === username.toLowerCase());
    const soapboxConfig = getSoapboxConfig(state);
    const features = getFeatures(state.get('instance'));

    let accountId = -1;
    let account = null;
    let accountUsername = username;
    let accountApId = null;
    if (accountFetchError) {
      accountId = null;
    } else {
      account = findAccountByUsername(state, username);
      accountId = account ? account.getIn(['id'], null) : -1;
      accountUsername = account ? account.getIn(['acct'], '') : '';
      accountApId = account ? account.get('url') : '';
    }

    const path = withReplies ? `${accountId}:with_replies` : accountId;

    const isBlocked = state.getIn(['relationships', accountId, 'blocked_by'], false);
    const unavailable = (me === accountId) ? false : (isBlocked && !features.blockersVisible);
    const showPins = getSettings(state).getIn(['account_timeline', 'shows', 'pinned']) && !withReplies;

    return {
      accountId,
      unavailable,
      accountUsername,
      accountApId,
      isBlocked,
      account,
      isAccount: !!state.getIn(['accounts', accountId]),
      statusIds: getStatusIds(state, { type: `account:${path}`, prefix: 'account_timeline' }),
      featuredStatusIds: showPins ? getStatusIds(state, { type: `account:${accountId}:pinned`, prefix: 'account_timeline' }) : ImmutableOrderedSet(),
      isLoading: state.getIn(['timelines', `account:${path}`, 'isLoading']),
      hasMore: state.getIn(['timelines', `account:${path}`, 'hasMore']),
      me,
      patronEnabled: soapboxConfig.getIn(['extensions', 'patron', 'enabled']),
    };
  };

  return mapStateToProps;
};

export default @connect(makeMapStateToProps)
@withRouter
class AccountTimeline extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    statusIds: ImmutablePropTypes.orderedSet,
    featuredStatusIds: ImmutablePropTypes.orderedSet,
    isLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    withReplies: PropTypes.bool,
    isAccount: PropTypes.bool,
    unavailable: PropTypes.bool,
  };

  componentDidMount() {
    const { params: { username }, accountId, accountApId, withReplies, patronEnabled, history } = this.props;

    this.props.dispatch(fetchAccountByUsername(username, history));

    if (accountId && accountId !== -1) {
      if (!withReplies) {
        this.props.dispatch(expandAccountFeaturedTimeline(accountId));
      }

      if (patronEnabled && accountApId) {
        this.props.dispatch(fetchPatronAccount(accountApId));
      }

      this.props.dispatch(expandAccountTimeline(accountId, { withReplies }));
    }
  }

  componentDidUpdate(prevProps) {
    const { params: { username }, accountId, withReplies, accountApId, patronEnabled, history } = this.props;

    if (username && (username !== prevProps.params.username)) {
      this.props.dispatch(fetchAccountByUsername(username, history));
    }

    if (accountId && (accountId !== -1) && (accountId !== prevProps.accountId) || withReplies !== prevProps.withReplies) {
      if (!withReplies) {
        this.props.dispatch(expandAccountFeaturedTimeline(accountId));
      }

      if (patronEnabled && accountApId) {
        this.props.dispatch(fetchPatronAccount(accountApId));
      }

      this.props.dispatch(expandAccountTimeline(accountId, { withReplies }));
    }
  }

  handleLoadMore = maxId => {
    if (this.props.accountId && this.props.accountId !== -1) {
      this.props.dispatch(expandAccountTimeline(this.props.accountId, { maxId, withReplies: this.props.withReplies }));
    }
  }

  render() {
    const { statusIds, featuredStatusIds, isLoading, hasMore, isBlocked, isAccount, accountId, unavailable, accountUsername } = this.props;

    if (!isAccount && accountId !== -1) {
      return (
        <MissingIndicator nested />
      );
    }

    if (accountId === -1 || (!statusIds && isLoading)) {
      return (
        <Spinner />
      );
    }

    if (unavailable) {
      return (
        <Card>
          <CardBody>
            <Text align='center'>
              {isBlocked ? (
                <FormattedMessage id='empty_column.account_blocked' defaultMessage='You are blocked by @{accountUsername}.' values={{ accountUsername: accountUsername }} />
              ) : (
                <FormattedMessage id='empty_column.account_unavailable' defaultMessage='Profile unavailable' />
              )}
            </Text>
          </CardBody>
        </Card>
      );
    }

    return (
      <StatusList
        scrollKey='account_timeline'
        statusIds={statusIds}
        featuredStatusIds={featuredStatusIds}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={this.handleLoadMore}
        emptyMessage={<FormattedMessage id='empty_column.account_timeline' defaultMessage='No posts here!' />}
      />
    );
  }

}
