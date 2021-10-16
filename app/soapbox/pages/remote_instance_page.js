import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Sticky from 'react-stickynode';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import PrimaryNavigation from 'soapbox/components/primary_navigation';
import {
  PromoPanel,
  FeaturesPanel,
  InstanceInfoPanel,
  InstanceModerationPanel,
} from 'soapbox/features/ui/util/async-components';
import LinkFooter from 'soapbox/features/ui/components/link_footer';
import { federationRestrictionsDisclosed } from 'soapbox/utils/state';
import { isAdmin } from 'soapbox/utils/accounts';

const mapStateToProps = state => {
  const me = state.get('me');
  const account = state.getIn(['accounts', me]);

  return {
    me,
    disclosed: federationRestrictionsDisclosed(state),
    isAdmin: isAdmin(account),
  };
};

export default @connect(mapStateToProps)
class RemoteInstancePage extends ImmutablePureComponent {

  render() {
    const { me, children, params: { instance: host }, disclosed, isAdmin } = this.props;

    return (
      <div className='page'>
        <div className='page__columns'>
          <div className='columns-area__panels'>

            <div className='columns-area__panels__pane columns-area__panels__pane--left'>
              <div className='columns-area__panels__pane__inner'>
                <Sticky top={65}>
                  <PrimaryNavigation />
                </Sticky>
              </div>
            </div>

            <div className='columns-area__panels__main'>
              <div className='columns-area'>
                {children}
              </div>
            </div>

            <div className='columns-area__panels__pane columns-area__panels__pane--right'>
              <div className='columns-area__panels__pane__inner'>
                <Sticky top={65}>
                  {me && (
                    <BundleContainer fetchComponent={FeaturesPanel}>
                      {Component => <Component key='features-panel' />}
                    </BundleContainer>
                  )}
                  <BundleContainer fetchComponent={PromoPanel}>
                    {Component => <Component key='promo-panel' />}
                  </BundleContainer>
                  <BundleContainer fetchComponent={InstanceInfoPanel}>
                    {Component => <Component host={host} />}
                  </BundleContainer>
                  {(disclosed || isAdmin) && (
                    <BundleContainer fetchComponent={InstanceModerationPanel}>
                      {Component => <Component host={host} />}
                    </BundleContainer>
                  )}
                  <LinkFooter key='link-footer' />
                </Sticky>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
