import React from 'react';

import SidebarNavigation from 'soapbox/components/sidebar-navigation';
import { Layout } from 'soapbox/components/ui';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import {
  LatestAccountsPanel,
} from 'soapbox/features/ui/util/async-components';

import LinkFooter from '../features/ui/components/link_footer';

const AdminPage: React.FC = ({ children }) => {
  return (
    <Layout>
      <Layout.Sidebar>
        <SidebarNavigation />
      </Layout.Sidebar>

      <Layout.Main>
        {children}
      </Layout.Main>

      <Layout.Aside>
        <BundleContainer fetchComponent={LatestAccountsPanel}>
          {Component => <Component limit={5} />}
        </BundleContainer>

        <LinkFooter />
      </Layout.Aside>
    </Layout>
  );
};

export default AdminPage;
