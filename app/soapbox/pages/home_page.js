import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import SidebarNavigation from 'soapbox/components/sidebar-navigation';
import LinkFooter from 'soapbox/features/ui/components/link_footer';
import {
  WhoToFollowPanel,
  TrendsPanel,
  SignUpPanel,
} from 'soapbox/features/ui/util/async-components';
// import GroupSidebarPanel from '../features/groups/sidebar_panel';
import { getFeatures } from 'soapbox/utils/features';

import Avatar from '../components/avatar';
import { Card, CardBody, Layout } from '../components/ui';
import ComposeFormContainer from '../features/compose/containers/compose_form_container';
import BundleContainer from '../features/ui/containers/bundle_container';

const mapStateToProps = state => {
  const me = state.get('me');
  const soapbox = getSoapboxConfig(state);
  const hasPatron = soapbox.getIn(['extensions', 'patron', 'enabled']);
  const hasCrypto = typeof soapbox.getIn(['cryptoAddresses', 0, 'ticker']) === 'string';
  const cryptoLimit = soapbox.getIn(['cryptoDonatePanel', 'limit']);
  const features = getFeatures(state.get('instance'));

  return {
    me,
    account: state.getIn(['accounts', me]),
    showFundingPanel: hasPatron,
    showCryptoDonatePanel: hasCrypto && cryptoLimit > 0,
    cryptoLimit,
    showTrendsPanel: features.trends,
    showWhoToFollowPanel: features.suggestions,
  };
};

export default @connect(mapStateToProps)
class HomePage extends ImmutablePureComponent {

  constructor(props) {
    super(props);
    this.composeBlock = React.createRef();
  }

  render() {
    const { me, children, account, showTrendsPanel, showWhoToFollowPanel } = this.props;

    const acct = account ? account.get('acct') : '';

    return (
      <Layout>
        <Layout.Sidebar>
          <SidebarNavigation />
        </Layout.Sidebar>

        <Layout.Main className='divide-y divide-gray-200 divide-solid sm:divide-none'>
          {me && <Card variant='rounded' ref={this.composeBlock}>
            <CardBody>
              <div className='flex items-start space-x-4'>
                <Link to={`/@${acct}`}>
                  <Avatar account={account} size={46} />
                </Link>

                <ComposeFormContainer
                  shouldCondense
                  autoFocus={false}
                  clickableAreaRef={this.composeBlock}
                />
              </div>
            </CardBody>
          </Card>}

          {children}
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
      </Layout>
    );
  }

}
