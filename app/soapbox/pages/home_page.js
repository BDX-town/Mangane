import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ImmutablePureComponent from 'react-immutable-pure-component';
import BundleContainer from '../features/ui/containers/bundle_container';
import ComposeFormContainer from '../features/compose/containers/compose_form_container';
import Avatar from '../components/avatar';
import {
  WhoToFollowPanel,
  CryptoDonatePanel,
  UserPanel,
  TrendsPanel,
  PromoPanel,
  FundingPanel,
  FeaturesPanel,
  SignUpPanel,
} from 'soapbox/features/ui/util/async-components';
// import GroupSidebarPanel from '../features/groups/sidebar_panel';
import LinkFooter from 'soapbox/features/ui/components/link_footer';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { getFeatures } from 'soapbox/utils/features';

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
    const { me, children, account, showFundingPanel, showCryptoDonatePanel, cryptoLimit, showTrendsPanel, showWhoToFollowPanel } = this.props;

    const acct = account ? account.get('acct') : '';

    return (
      <div className='page'>
        <div className='page__columns'>
          <div className='columns-area__panels'>

            <div className='columns-area__panels__pane columns-area__panels__pane--left'>
              <div className='columns-area__panels__pane__inner'>
                <BundleContainer fetchComponent={UserPanel}>
                  {Component => <Component accountId={me} key='user-panel' />}
                </BundleContainer>
                {showFundingPanel && (
                  <BundleContainer fetchComponent={FundingPanel}>
                    {Component => <Component key='funding-panel' />}
                  </BundleContainer>
                )}
                {showCryptoDonatePanel && (
                  <BundleContainer fetchComponent={CryptoDonatePanel}>
                    {Component => <Component limit={cryptoLimit} key='crypto-panel' />}
                  </BundleContainer>
                )}
              </div>
            </div>

            <div className='columns-area__panels__main'>
              <div className='columns-area columns-area--mobile'>
                {me && <div className='timeline-compose-block' ref={this.composeBlock}>
                  <Link className='timeline-compose-block__avatar' to={`/@${acct}`}>
                    <Avatar account={account} size={46} />
                  </Link>
                  <ComposeFormContainer
                    shouldCondense
                    autoFocus={false}
                    clickableAreaRef={this.composeBlock}
                  />
                </div>}

                {children}
              </div>
            </div>

            <div className='columns-area__panels__pane columns-area__panels__pane--right'>
              <div className='columns-area__panels__pane__inner'>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
