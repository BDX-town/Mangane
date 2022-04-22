import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';
import Sticky from 'react-stickynode';

import PrimaryNavigation from 'soapbox/components/primary_navigation';
import LinkFooter from 'soapbox/features/ui/components/link_footer';
import {
  WhoToFollowPanel,
  TrendsPanel,
  PromoPanel,
  FeaturesPanel,
  SignUpPanel,
} from 'soapbox/features/ui/util/async-components';
// import GroupSidebarPanel from '../features/groups/sidebar_panel';
import { getFeatures } from 'soapbox/utils/features';

import BundleContainer from '../features/ui/containers/bundle_container';

const mapStateToProps = state => {
  const me = state.get('me');
  const features = getFeatures(state.get('instance'));

  return {
    me,
    showTrendsPanel: features.trends,
    showWhoToFollowPanel: features.suggestions,
  };
};

export default @connect(mapStateToProps)
class StatusPage extends ImmutablePureComponent {

  render() {
    const { me, children, showTrendsPanel, showWhoToFollowPanel } = this.props;

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
                  {me ? (
                    <BundleContainer fetchComponent={FeaturesPanel}>
                      {Component => <Component key='features-panel' />}
                    </BundleContainer>
                  ) : (
                    <BundleContainer fetchComponent={SignUpPanel}>
                      {Component => <Component key='sign-up-panel' />}
                    </BundleContainer>
                  )}
                  <BundleContainer fetchComponent={PromoPanel}>
                    {Component => <Component key='promo-panel' />}
                  </BundleContainer>
                  {showTrendsPanel && (
                    <BundleContainer fetchComponent={TrendsPanel}>
                      {Component => <Component limit={3} key='trends-panel' />}
                    </BundleContainer>
                  )}
                  {showWhoToFollowPanel && (
                    <BundleContainer fetchComponent={WhoToFollowPanel}>
                      {Component => <Component limit={5} key='wtf-panel' />}
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
