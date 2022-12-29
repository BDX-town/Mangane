import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Redirect, useHistory } from 'react-router-dom';

import { Column, Layout, Tabs, Widget } from 'soapbox/components/ui';
import Header from 'soapbox/features/account/components/header';
import LinkFooter from 'soapbox/features/ui/components/link_footer';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import {
  WhoToFollowPanel,
  ProfileInfoPanel,
  ProfileMediaPanel,
  ProfileFieldsPanel,
  SignUpPanel,
  PinnedAccountsPanel,
} from 'soapbox/features/ui/util/async-components';
import { useAppSelector, useFeatures, useSoapboxConfig } from 'soapbox/hooks';
import { findAccountByUsername, makeGetAccount } from 'soapbox/selectors';
import { getAcct, isLocal } from 'soapbox/utils/accounts';

interface IProfilePage {
  params?: {
    username?: string,
  },
}

const getAccount = makeGetAccount();

/** Page to display a user's profile. */
const ProfilePage: React.FC<IProfilePage> = ({ params, children }) => {
  const history = useHistory();
  const username = params?.username || '';

  const account = useAppSelector(state => {
    if (username) {
      const account = findAccountByUsername(state, username);
      if (account) {
        return getAccount(state, account.id) || undefined;
      }
    }
  });

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
    {
      text: <FormattedMessage id='account.about' defaultMessage='About' />,
      to: `/@${username}/about`,
      name: 'about',
    },
  ];

  let activeItem;
  const pathname = history.location.pathname.replace(`@${username}/`, '');
  if (pathname.endsWith('/with_replies')) {
    activeItem = 'replies';
  } else if (pathname.endsWith('/media')) {
    activeItem = 'media';
  } else if (pathname.endsWith('/about')) {
    activeItem = 'about';
  } else {
    activeItem = 'profile';
  }

  const showTabs = !['/following', '/followers', '/pins'].some(path => pathname.endsWith(path));

  return (
    <>
      <Layout.Main>
        <Column label={account ? `@${getAcct(account, displayFqn)}` : ''} withHeader={false}>
          <div className='space-y-4'>
            <Header account={account} />

            <BundleContainer fetchComponent={ProfileInfoPanel}>
              {Component => <Component username={username} account={account} />}
            </BundleContainer>

            {account && showTabs && (
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
          <Widget title={<FormattedMessage id='profile_fields_panel.title' defaultMessage='Profile fields' />}>
            <BundleContainer fetchComponent={ProfileFieldsPanel}>
              {Component => <Component account={account} />}
            </BundleContainer>
          </Widget>
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
