import React from 'react';

import LinkFooter from 'soapbox/features/ui/components/link_footer';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import {
  PromoPanel,
  InstanceInfoPanel,
  InstanceModerationPanel,
} from 'soapbox/features/ui/util/async-components';
import { useAppSelector, useOwnAccount } from 'soapbox/hooks';
import { federationRestrictionsDisclosed } from 'soapbox/utils/state';

import { Layout } from '../components/ui';

interface IRemoteInstancePage {
  params?: {
    instance?: string,
  },
}

/** Page for viewing a remote instance timeline. */
const RemoteInstancePage: React.FC<IRemoteInstancePage> = ({ children, params }) => {
  const host = params?.instance;

  const account = useOwnAccount();
  const disclosed = useAppSelector(federationRestrictionsDisclosed);

  return (
    <>
      <Layout.Main>
        {children}
      </Layout.Main>

      <Layout.Aside>
        <BundleContainer fetchComponent={PromoPanel}>
          {Component => <Component key='promo-panel' />}
        </BundleContainer>
        <BundleContainer fetchComponent={InstanceInfoPanel}>
          {Component => <Component host={host} />}
        </BundleContainer>
        {(disclosed || account?.admin) && (
          <BundleContainer fetchComponent={InstanceModerationPanel}>
            {Component => <Component host={host} />}
          </BundleContainer>
        )}
        <LinkFooter key='link-footer' />
      </Layout.Aside>
    </>
  );
};

export default RemoteInstancePage;
