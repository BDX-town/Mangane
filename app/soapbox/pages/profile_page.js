import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

import SidebarNavigation from 'soapbox/components/sidebar-navigation';
import LinkFooter from 'soapbox/features/ui/components/link_footer';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import {
  WhoToFollowPanel,
  TrendsPanel,
  ProfileInfoPanel,
  SignUpPanel,
} from 'soapbox/features/ui/util/async-components';
import { findAccountByUsername } from 'soapbox/selectors';
import { getAcct } from 'soapbox/utils/accounts';
import { getFeatures } from 'soapbox/utils/features';
import { displayFqn } from 'soapbox/utils/state';

import { Column, Layout, Tabs } from '../components/ui';
import HeaderContainer from '../features/account_timeline/containers/header_container';
import { makeGetAccount } from '../selectors';

const mapStateToProps = (state, { params, withReplies = false }) => {
  const username = params.username || '';
  const accounts = state.getIn(['accounts']);
  const accountFetchError = ((state.getIn(['accounts', -1, 'username']) || '').toLowerCase() === username.toLowerCase());
  const getAccount = makeGetAccount();
  const me = state.get('me');

  let accountId = -1;
  let account = null;
  let accountUsername = username;
  if (accountFetchError) {
    accountId = null;
  } else {
    account = findAccountByUsername(state, username);
    accountId = account ? account.getIn(['id'], null) : -1;
    accountUsername = account ? account.getIn(['acct'], '') : '';
  }

  //Children components fetch information

  let realAccount;
  if (!account) {
    const maybeAccount = accounts.get(username);
    if (maybeAccount) {
      realAccount = maybeAccount;
    }
  }

  return {
    me,
    account: accountId ? getAccount(state, accountId) : account,
    accountId,
    accountUsername,
    features: getFeatures(state.get('instance')),
    realAccount,
    displayFqn: displayFqn(state),
  };
};

export default @connect(mapStateToProps)
@withRouter
class ProfilePage extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.record,
    accountUsername: PropTypes.string.isRequired,
    displayFqn: PropTypes.bool,
    features: PropTypes.object,
  };

  render() {
    const { children, accountId, account, displayFqn, accountUsername, me, features, realAccount } = this.props;

    if (realAccount) {
      return <Redirect to={`/@${realAccount.get('acct')}`} />;
    }

    const tabItems = [
      {
        text: <FormattedMessage id='account.posts' defaultMessage='Posts' />,
        to: `/@${accountUsername}`,
        name: 'profile',
      },
      {
        text: <FormattedMessage id='account.posts_with_replies' defaultMessage='Posts and replies' />,
        to: `/@${accountUsername}/with_replies`,
        name: 'replies',
      },
      {
        text: <FormattedMessage id='account.media' defaultMessage='Media' />,
        to: `/@${accountUsername}/media`,
        name: 'media',
      },
    ];

    if (account) {
      const ownAccount = account.get('id') === me;
      if (ownAccount || !account.getIn(['pleroma', 'hide_favorites'], true)) {
        tabItems.push({
          text: <FormattedMessage id='navigation_bar.favourites' defaultMessage='Likes' />,
          to: `/@${account.get('acct')}/favorites`,
          name: 'likes',
        });
      }
    }

    const showTrendsPanel = features.trends;
    const showWhoToFollowPanel = features.suggestions;

    let activeItem;
    const pathname = this.props.history.location.pathname.replace(`@${accountUsername}/`);
    if (pathname.includes('with_replies')) {
      activeItem = 'replies';
    } else if (pathname.includes('media')) {
      activeItem = 'media';
    } else if (pathname.includes('favorites')) {
      activeItem = 'likes';
    } else if (pathname === `/@${accountUsername}`) {
      activeItem = 'profile';
    }

    return (
      <Layout>
        <Layout.Sidebar>
          <SidebarNavigation />
        </Layout.Sidebar>

        <Layout.Main>
          <Column label={account ? `@${getAcct(account, displayFqn)}` : null} withHeader={false}>
            <div className='space-y-4'>
              <HeaderContainer accountId={accountId} username={accountUsername} />

              <BundleContainer fetchComponent={ProfileInfoPanel}>
                {Component => <Component username={accountUsername} account={account} />}
              </BundleContainer>

              {account && (
                <Tabs items={tabItems} activeItem={activeItem} />
              )}

              {children}
            </div>
          </Column>
        </Layout.Main>

        <Layout.Aside>
          {!me && (
            <BundleContainer fetchComponent={SignUpPanel}>
              {Component => <Component key='sign-up-panel' />}
            </BundleContainer>
          )}
          {showTrendsPanel && (
            <BundleContainer fetchComponent={TrendsPanel}>
              {Component => <Component limit={3} key='trends-panel' />}
            </BundleContainer>
          )}
          {showWhoToFollowPanel && (
            <BundleContainer fetchComponent={WhoToFollowPanel}>
              {Component => <Component limit={5} key='wtf-panel' />}
            </BundleContainer>
          )}
          <LinkFooter key='link-footer' />
        </Layout.Aside>
      </Layout>
    );
  }

}
