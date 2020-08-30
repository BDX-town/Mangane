import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { fetchAccount, fetchAccountByUsername } from '../../actions/accounts';
import { expandAccountFeaturedTimeline, expandAccountTimeline } from '../../actions/timelines';
import StatusList from '../../components/status_list';
import LoadingIndicator from '../../components/loading_indicator';
import Column from '../ui/components/column';
import { List as ImmutableList } from 'immutable';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import { fetchAccountIdentityProofs } from '../../actions/identity_proofs';
import MissingIndicator from 'soapbox/components/missing_indicator';
import { NavLink } from 'react-router-dom';
import { fetchPatronAccount } from '../../actions/patron';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';

const emptyList = ImmutableList();

const mapStateToProps = (state, { params: { username }, withReplies = false }) => {
  const me = state.get('me');
  const accounts = state.getIn(['accounts']);
  const accountFetchError = (state.getIn(['accounts', -1, 'username'], '').toLowerCase() === username.toLowerCase());
  const soapboxConfig = getSoapboxConfig(state);

  let accountId = -1;
  let accountUsername = username;
  let accountApId = null;
  if (accountFetchError) {
    accountId = null;
  } else {
    let account = accounts.find(acct => username.toLowerCase() === acct.getIn(['acct'], '').toLowerCase());
    accountId = account ? account.getIn(['id'], null) : -1;
    accountUsername = account ? account.getIn(['acct'], '') : '';
    accountApId = account ? account.get('url') : '';
  }

  const path = withReplies ? `${accountId}:with_replies` : accountId;

  const isBlocked = state.getIn(['relationships', accountId, 'blocked_by'], false);
  const unavailable = (me === accountId) ? false : isBlocked;

  return {
    accountId,
    unavailable,
    accountUsername,
    accountApId,
    isAccount: !!state.getIn(['accounts', accountId]),
    statusIds: state.getIn(['timelines', `account:${path}`, 'items'], emptyList),
    featuredStatusIds: withReplies ? ImmutableList() : state.getIn(['timelines', `account:${accountId}:pinned`, 'items'], emptyList),
    isLoading: state.getIn(['timelines', `account:${path}`, 'isLoading']),
    hasMore: state.getIn(['timelines', `account:${path}`, 'hasMore']),
    me,
    patronEnabled: soapboxConfig.getIn(['extensions', 'patron', 'enabled']),
  };
};

export default @connect(mapStateToProps)
class AccountTimeline extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    statusIds: ImmutablePropTypes.list,
    featuredStatusIds: ImmutablePropTypes.list,
    isLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    withReplies: PropTypes.bool,
    isAccount: PropTypes.bool,
    unavailable: PropTypes.bool,
  };

  componentDidMount() {
    const { params: { username }, accountId, accountApId, withReplies, me, patronEnabled } = this.props;

    if (accountId && accountId !== -1) {
      this.props.dispatch(fetchAccount(accountId));
      if (me) this.props.dispatch(fetchAccountIdentityProofs(accountId));

      if (!withReplies) {
        this.props.dispatch(expandAccountFeaturedTimeline(accountId));
      }

      if (patronEnabled && accountApId) {
        this.props.dispatch(fetchPatronAccount(accountApId));
      }

      this.props.dispatch(expandAccountTimeline(accountId, { withReplies }));
    } else {
      this.props.dispatch(fetchAccountByUsername(username));
    }
  }

  componentDidUpdate(prevProps) {
    const { me, accountId, withReplies, accountApId, patronEnabled } = this.props;
    if (accountId && accountId !== -1 && (accountId !== prevProps.accountId && accountId) || withReplies !== prevProps.withReplies) {
      this.props.dispatch(fetchAccount(accountId));
      if (me) this.props.dispatch(fetchAccountIdentityProofs(accountId));

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
    const { statusIds, featuredStatusIds, isLoading, hasMore, isAccount, accountId, unavailable, accountUsername } = this.props;

    if (!isAccount && accountId !== -1) {
      return (
        <Column>
          <MissingIndicator />
        </Column>
      );
    }

    if (accountId === -1 || (!statusIds && isLoading)) {
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
        <div className='account__section-headline'>
          <div style={{ width: '100%', display: 'flex' }}>
            <NavLink exact to={`/@${accountUsername}`}>
              <FormattedMessage id='account.posts' defaultMessage='Posts' />
            </NavLink>
            <NavLink exact to={`/@${accountUsername}/with_replies`}>
              <FormattedMessage id='account.posts_with_replies' defaultMessage='Posts and replies' />
            </NavLink>
            <NavLink exact to={`/@${accountUsername}/media`}>
              <FormattedMessage id='account.media' defaultMessage='Media' />
            </NavLink>
          </div>
        </div>
        <StatusList
          scrollKey='account_timeline'
          statusIds={statusIds}
          featuredStatusIds={featuredStatusIds}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={this.handleLoadMore}
          emptyMessage={<FormattedMessage id='empty_column.account_timeline' defaultMessage='No posts here!' />}
        />
      </Column>
    );
  }

}
