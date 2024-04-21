import React from 'react';

import FeedCarousel from 'soapbox/features/feed-filtering/feed-carousel';
import LinkFooter from 'soapbox/features/ui/components/link_footer';
import {
  WhoToFollowPanel,
  TrendsPanel,
  SignUpPanel,
  PromoPanel,
  FundingPanel,
  BirthdayPanel,
  AnnouncementsPanel,
} from 'soapbox/features/ui/util/async-components';
import { useAppSelector, useFeatures, useSoapboxConfig } from 'soapbox/hooks';

import { Layout } from '../components/ui';
import BundleContainer from '../features/ui/containers/bundle_container';
// import GroupSidebarPanel from '../features/groups/sidebar_panel';

const HomePage: React.FC = ({ children }) => {
  const me = useAppSelector(state => state.me);
  const features = useFeatures();
  const soapboxConfig = useSoapboxConfig();

  const hasPatron = soapboxConfig.extensions.getIn(['patron', 'enabled']) === true;

  return (
    <>
      <Layout.Main className='pt-3 sm:pt-0 dark:divide-slate-800 space-y-3'>
        {features.feedUserFiltering && <FeedCarousel />}
        {children}
      </Layout.Main>

      <Layout.Aside>
        {!me && (
          <BundleContainer fetchComponent={SignUpPanel}>
            {Component => <Component />}
          </BundleContainer>
        )}
        {me && features.announcements && (
          <BundleContainer fetchComponent={AnnouncementsPanel}>
            {Component => <Component key='announcements-panel' />}
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
