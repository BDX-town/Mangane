import React, { ReactNode } from 'react';

import LinkFooter from 'soapbox/features/ui/components/link_footer';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import {
  WhoToFollowPanel,
  TrendsPanel,
  SignUpPanel,
  PromoPanel,
} from 'soapbox/features/ui/util/async-components';
import { useAppSelector, useFeatures } from 'soapbox/hooks';

import { Layout } from '../components/ui';

const DefaultPage: React.FC = ({ children }: { children: ReactNode }) => {
  const me = useAppSelector(state => state.me);
  const features = useFeatures();

  return (
    <>
      <Layout.Main className='animate-fadein pb-[110px] sm:pt-4 lg:pb-0'>
        {children}
      </Layout.Main>

      <Layout.Aside className='animate-fadein py-4 lg:flex flex-col'>
        {!me && (
          <BundleContainer fetchComponent={SignUpPanel}>
            {Component => <Component key='sign-up-panel' />}
          </BundleContainer>
        )}
        {features.trends && (
          <BundleContainer fetchComponent={TrendsPanel}>
            {Component => <Component limit={3} key='trends-panel' />}
          </BundleContainer>
        )}
        <BundleContainer fetchComponent={PromoPanel}>
          {Component => <Component />}
        </BundleContainer>
        {features.suggestions && (
          <BundleContainer fetchComponent={WhoToFollowPanel}>
            {Component => <Component limit={5} key='wtf-panel' />}
          </BundleContainer>
        )}
        <div className='grow' />
        <LinkFooter key='link-footer' />
      </Layout.Aside>
    </>
  );
};

export default DefaultPage;
