import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Redirect, useHistory } from 'react-router-dom';

import LinkFooter from 'soapbox/features/ui/components/link_footer';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import {
  WhoToFollowPanel,
  ProfileInfoPanel,
  ProfileMediaPanel,
  ProfileFieldsPanel,
  SignUpPanel,
  CtaBanner,
  PinnedAccountsPanel,
} from 'soapbox/features/ui/util/async-components';
import { useAppSelector, useFeatures, useSoapboxConfig } from 'soapbox/hooks';
import { findAccountByUsername } from 'soapbox/selectors';
import { getAcct, isLocal } from 'soapbox/utils/accounts';

import { Column, Layout, Tabs } from '../components/ui';
import HeaderContainer from '../features/account_timeline/containers/header_container';

interface IProfilePage {
  params?: {
    username?: string,
  },
}

/** Page to display a user's profile. */
const ProfilePage: React.FC<IProfilePage> = ({ params, children }) => {
  const history = useHistory();
  const username = params?.username || '';

  const account = useAppSelector(state => username ? findAccountByUsername(state, username) : undefined);

  const me = useAppSelector(state => state.me);
  const features = useFeatures();
  const { displayFqn } = useSoapboxConfig();

  // Fix case of username
  if (account && account.acct !== username) {
    return <Redirect to={`/@${account.acct}`} />;
  }

  const tabItems = [
    {
      text: <FormattedMessage id='account.posts' defaultMessage='Posts' />,
      to: `/@${username}`,
      name: 'profile',
    },
    {
      text: <FormattedMessage id='account.posts_with_replies' defaultMessage='Posts and replies' />,
      to: `/@${username}/with_replies`,
      name: 'replies',
    },
    {
      text: <FormattedMessage id='account.media' defaultMessage='Media' />,
      to: `/@${username}/media`,
      name: 'media',
    },
  ];

  if (account) {
    const ownAccount = account.id === me;
    if (ownAccount || !account.pleroma.get('hide_favorites', true)) {
      tabItems.push({
        text: <FormattedMessage id='navigation_bar.favourites' defaultMessage='Likes' />,
        to: `/@${account.acct}/favorites`,
        name: 'likes',
      });
    }
  }

  let activeItem;
  const pathname = history.location.pathname.replace(`@${username}/`, '');
  if (pathname.includes('with_replies')) {
    activeItem = 'replies';
  } else if (pathname.includes('media')) {
    activeItem = 'media';
  } else if (pathname.includes('favorites')) {
    activeItem = 'likes';
  } else {
    activeItem = 'profile';
  }

  const showTabs = !['following', 'followers', 'pins'].some(path => pathname.includes(path));

  return (
    <>
      <Layout.Main>
        <Column label={account ? `@${getAcct(account, displayFqn)}` : ''} withHeader={false}>
          <div className='space-y-4'>
            {/* @ts-ignore */}
            <HeaderContainer accountId={account?.id} username={username} />

            <BundleContainer fetchComponent={ProfileInfoPanel}>
              {Component => <Component username={username} account={account} />}
            </BundleContainer>

            {account && showTabs && (
              <Tabs items={tabItems} activeItem={activeItem} />
            )}

            {children}
          </div>
        </Column>

        {!me && (
          <BundleContainer fetchComponent={CtaBanner}>
            {Component => <Component key='cta-banner' />}
          </BundleContainer>
        )}
      </Layout.Main>

      <Layout.Aside>
        {!me && (
          <BundleContainer fetchComponent={SignUpPanel}>
            {Component => <Component key='sign-up-panel' />}
          </BundleContainer>
        )}
        <BundleContainer fetchComponent={ProfileMediaPanel}>
          {Component => <Component account={account} />}
        </BundleContainer>
        {account && !account.fields.isEmpty() && (
          <BundleContainer fetchComponent={ProfileFieldsPanel}>
            {Component => <Component account={account} />}
          </BundleContainer>
        )}
        {(features.accountEndorsements && account && isLocal(account)) ? (
          <BundleContainer fetchComponent={PinnedAccountsPanel}>
            {Component => <Component account={account} limit={5} key='pinned-accounts-panel' />}
          </BundleContainer>
        ) : features.suggestions && (
          <BundleContainer fetchComponent={WhoToFollowPanel}>
            {Component => <Component limit={5} key='wtf-panel' />}
          </BundleContainer>
        )}
        <LinkFooter key='link-footer' />
      </Layout.Aside>
    </>
  );
};

export default ProfilePage;
