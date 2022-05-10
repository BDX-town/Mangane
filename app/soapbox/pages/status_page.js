import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import LinkFooter from 'soapbox/features/ui/components/link_footer';
import {
  WhoToFollowPanel,
  TrendsPanel,
  SignUpPanel,
  CtaBanner,
} from 'soapbox/features/ui/util/async-components';
// import GroupSidebarPanel from '../features/groups/sidebar_panel';
import { getFeatures } from 'soapbox/utils/features';

import { Layout } from '../components/ui';
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
      <>
        <Layout.Main>
          {children}

          {!me && (
            <BundleContainer fetchComponent={CtaBanner}>
              {Component => <Component key='cta-banner' />}
            </BundleContainer>
          )}
        </Layout.Main>

        <Layout.Aside>
          {!me && (
            <BundleContainer fetchComponent={SignUpPanel}>
              {Component => <Component key='sign-up-panel' />}
            </BundleContainer>
          )}
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
        </Layout.Aside>
      </>
    );
  }

}
