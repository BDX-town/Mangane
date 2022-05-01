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
} from 'soapbox/features/ui/util/async-components';
import { useAppSelector, useFeatures, useSoapboxConfig } from 'soapbox/hooks';
import { findAccountByUsername } from 'soapbox/selectors';
import { getAcct } from 'soapbox/utils/accounts';

import { Column, Layout, Tabs } from '../components/ui';
import HeaderContainer from '../features/account_timeline/containers/header_container';
import { makeGetAccount } from '../selectors';

const getAccount = makeGetAccount();

interface IProfilePage {
  params?: {
    username?: string,
  },
}

const ProfilePage: React.FC<IProfilePage> = ({ params, children }) => {
  const history = useHistory();

  const { accountId, account, accountUsername, realAccount } = useAppSelector(state => {
    const username = params?.username || '';
    const { accounts } = state;
    const accountFetchError = (((state.accounts.getIn([-1, 'username']) || '') as string).toLowerCase() === username.toLowerCase());

    let accountId: string | -1 | null = -1;
    let account = null;
    let accountUsername = username;
    if (accountFetchError) {
      accountId = null;
    } else {
      account = findAccountByUsername(state, username);
      accountId = account ? account.id : -1;
      accountUsername = account ? account.acct : '';
    }

    let realAccount;
    if (!account) {
      const maybeAccount = accounts.get(username);
      if (maybeAccount) {
        realAccount = maybeAccount;
      }
    }

    return {
      account: typeof accountId === 'string' ? getAccount(state, accountId) : account,
      accountId,
      accountUsername,
      realAccount,
    };
  });

  const me = useAppSelector(state => state.me);
  const features = useFeatures();
  const { displayFqn } = useSoapboxConfig();

  if (realAccount) {
    return <Redirect to={`/@${realAccount.acct}`} />;
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
  const pathname = history.location.pathname.replace(`@${accountUsername}/`, '');
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
    <>
      <Layout.Main>
        <Column label={account ? `@${getAcct(account, displayFqn)}` : ''} withHeader={false}>
          <div className='space-y-4'>
            {/* @ts-ignore */}
            <HeaderContainer accountId={accountId} username={accountUsername} />

            <BundleContainer fetchComponent={ProfileInfoPanel}>
              {Component => <Component username={accountUsername} account={account} />}
            </BundleContainer>

            {account && activeItem && (
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
        <BundleContainer fetchComponent={ProfileMediaPanel}>
          {Component => <Component account={account} />}
        </BundleContainer>
        {account && !account.fields.isEmpty() && (
          <BundleContainer fetchComponent={ProfileFieldsPanel}>
            {Component => <Component account={account} />}
          </BundleContainer>
        )}
        {features.suggestions && (
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
