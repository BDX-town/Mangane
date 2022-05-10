import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

import LinkFooter from 'soapbox/features/ui/components/link_footer';
import {
  WhoToFollowPanel,
  TrendsPanel,
  SignUpPanel,
  PromoPanel,
  FundingPanel,
  CryptoDonatePanel,
  BirthdayPanel,
  CtaBanner,
} from 'soapbox/features/ui/util/async-components';
import { useAppSelector, useOwnAccount, useFeatures, useSoapboxConfig } from 'soapbox/hooks';

import Avatar from '../components/avatar';
import { Card, CardBody, Layout } from '../components/ui';
import ComposeFormContainer from '../features/compose/containers/compose_form_container';
import BundleContainer from '../features/ui/containers/bundle_container';
// import GroupSidebarPanel from '../features/groups/sidebar_panel';

const HomePage: React.FC = ({ children }) => {
  const me = useAppSelector(state => state.me);
  const account = useOwnAccount();
  const features = useFeatures();
  const soapboxConfig = useSoapboxConfig();

  const composeBlock = useRef<HTMLDivElement>(null);

  const hasPatron = soapboxConfig.extensions.getIn(['patron', 'enabled']) === true;
  const hasCrypto = typeof soapboxConfig.cryptoAddresses.getIn([0, 'ticker']) === 'string';
  const cryptoLimit = soapboxConfig.cryptoDonatePanel.get('limit');

  const acct = account ? account.acct : '';

  return (
    <>
      <Layout.Main className='pt-4 sm:pt-0 divide-y divide-gray-200 dark:divide-slate-700 divide-solid space-y-4 divide-none'>
        {me && (
          <Card variant='rounded' ref={composeBlock}>
            <CardBody>
              <div className='flex items-start space-x-4'>
                <Link to={`/@${acct}`}>
                  <Avatar account={account} size={46} />
                </Link>

                <ComposeFormContainer
                  // @ts-ignore
                  shouldCondense
                  autoFocus={false}
                  clickableAreaRef={composeBlock}
                />
              </div>
            </CardBody>
          </Card>
        )}

        {children}

        {!me && (
          <BundleContainer fetchComponent={CtaBanner}>
            {Component => <Component key='cta-banner' />}
          </BundleContainer>
        )}
      </Layout.Main>

      <Layout.Aside>
        {!me && (
          <BundleContainer fetchComponent={SignUpPanel}>
            {Component => <Component />}
          </BundleContainer>
        )}
        {features.trends && (
          <BundleContainer fetchComponent={TrendsPanel}>
            {Component => <Component limit={3} />}
          </BundleContainer>
        )}
        {hasPatron && (
          <BundleContainer fetchComponent={FundingPanel}>
            {Component => <Component />}
          </BundleContainer>
        )}
        {hasCrypto && cryptoLimit && cryptoLimit > 0 && (
          <BundleContainer fetchComponent={CryptoDonatePanel}>
            {Component => <Component limit={cryptoLimit} />}
          </BundleContainer>
        )}
        <BundleContainer fetchComponent={PromoPanel}>
          {Component => <Component />}
        </BundleContainer>
        {features.birthdays && (
          <BundleContainer fetchComponent={BirthdayPanel}>
            {Component => <Component limit={10} />}
          </BundleContainer>
        )}
        {features.suggestions && (
          <BundleContainer fetchComponent={WhoToFollowPanel}>
            {Component => <Component limit={5} />}
          </BundleContainer>
        )}
        <LinkFooter key='link-footer' />
      </Layout.Aside>
    </>
  );
};

export default HomePage;
