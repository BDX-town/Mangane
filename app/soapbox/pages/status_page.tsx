import React from 'react';

import LinkFooter from 'soapbox/features/ui/components/link_footer';
import {
  WhoToFollowPanel,
  TrendsPanel,
  SignUpPanel,
} from 'soapbox/features/ui/util/async-components';
import { useAppSelector, useFeatures } from 'soapbox/hooks';

import { Layout } from '../components/ui';
import BundleContainer from '../features/ui/containers/bundle_container';

interface IStatusPage {
  children: React.ReactNode,
}

const StatusPage: React.FC<IStatusPage> = ({ children }) => {
  const me = useAppSelector(state => state.me);
  const features = useFeatures();

  return (
    <>
      <Layout.Main className='animate-fadeIn sm:pt-4'>
        {children}
      </Layout.Main>

      <Layout.Aside className='animate-fadeIn'>
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

export default StatusPage;
