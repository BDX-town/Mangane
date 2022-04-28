import React from 'react';

import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import {
  AdminNav,
  LatestAccountsPanel,
} from 'soapbox/features/ui/util/async-components';

import LinkFooter from '../features/ui/components/link_footer';

const AdminPage: React.FC = ({ children }) => {
  return (
    <div className='page page--admin'>
      <div className='page__columns'>
        <div className='columns-area__panels'>

          <div className='columns-area__panels__pane columns-area__panels__pane--left'>
            <div className='columns-area__panels__pane__inner'>
              <BundleContainer fetchComponent={AdminNav}>
                {Component => <Component />}
              </BundleContainer>
            </div>
          </div>

          <div className='columns-area__panels__main'>
            <div className='columns-area'>
              {children}
            </div>
          </div>

          <div className='columns-area__panels__pane columns-area__panels__pane--right'>
            <div className='columns-area__panels__pane__inner'>
              <BundleContainer fetchComponent={LatestAccountsPanel}>
                {Component => <Component limit={5} />}
              </BundleContainer>
              <LinkFooter />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
