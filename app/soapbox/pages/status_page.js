import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Sticky from 'react-stickynode';
import BundleContainer from '../features/ui/containers/bundle_container';
import PrimaryNavigation from 'soapbox/components/primary_navigation';
import {
  WhoToFollowPanel,
  TrendsPanel,
  PromoPanel,
  FeaturesPanel,
  SignUpPanel,
} from 'soapbox/features/ui/util/async-components';
// import GroupSidebarPanel from '../features/groups/sidebar_panel';
import LinkFooter from 'soapbox/features/ui/components/link_footer';
import { getFeatures } from 'soapbox/utils/features';

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
                <Sticky top={106}>
                  <PrimaryNavigation />
                </Sticky>
              </div>
            </div>

            <div className='columns-area__panels__main columns-area__panels__main--transparent'>
              <div className='columns-area columns-area--mobile columns-area--transparent'>
                {children}
              </div>
            </div>

            <div className='columns-area__panels__pane columns-area__panels__pane--right'>
              <div className='columns-area__panels__pane__inner'>
                <Sticky top={106}>
                  {me ? (
                    <BundleContainer fetchComponent={FeaturesPanel}>
                      {Component => <Component key='features-panel' />}
                    </BundleContainer>
                  ) : (
                    <BundleContainer fetchComponent={SignUpPanel}>
                      {Component => <Component key='sign-up-panel' />}
                    </BundleContainer>
                  )}
                  {showTrendsPanel && (
                    <BundleContainer fetchComponent={TrendsPanel}>
                      {Component => <Component key='trends-panel' />}
                    </BundleContainer>
                  )}
                  {showWhoToFollowPanel && (
                    <BundleContainer fetchComponent={WhoToFollowPanel}>
                      {Component => <Component limit={5} key='wtf-panel' />}
                    </BundleContainer>
                  )}
                  <BundleContainer fetchComponent={PromoPanel}>
                    {Component => <Component key='promo-panel' />}
                  </BundleContainer>
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
