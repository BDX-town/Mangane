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
      <Layout.Main className='animate-fadein pb-[110px] sm:pt-4 lg:pb-0'>
        {children}
      </Layout.Main>

      <Layout.Aside className='animate-fadein py-4'>
        <BundleContainer fetchComponent={LatestAccountsPanel}>
          {Component => <Component limit={5} />}
        </BundleContainer>

        <LinkFooter />
      </Layout.Aside>
    </>
  );
};

export default AdminPage;
