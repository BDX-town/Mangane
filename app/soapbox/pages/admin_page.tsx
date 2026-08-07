import React, { ReactNode } from 'react';

import { Layout } from 'soapbox/components/ui';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import {
  LatestAccountsPanel,
} from 'soapbox/features/ui/util/async-components';

import LinkFooter from '../features/ui/components/link_footer';

const AdminPage: React.FC = ({ children }: { children: ReactNode}) => {
  return (
    <>
      <Layout.Main className=''>
        {children}
      </Layout.Main>

      <Layout.Aside className=''>
        <BundleContainer fetchComponent={LatestAccountsPanel}>
          {Component => <Component limit={5} />}
        </BundleContainer>
        <div className='grow' />
        <LinkFooter />
      </Layout.Aside>
    </>
  );
};

export default AdminPage;
