import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ComposeFormContainer from '../features/compose/containers/compose_form_container';
import Avatar from '../components/avatar';
import UserPanel from 'soapbox/features/ui/components/user_panel';
import WhoToFollowPanel from 'soapbox/features/ui/components/who_to_follow_panel';
import TrendsPanel from 'soapbox/features/ui/components/trends_panel';
import PromoPanel from 'soapbox/features/ui/components/promo_panel';
import FundingPanel from 'soapbox/features/ui/components/funding_panel';
import CryptoDonatePanel from 'soapbox/features/crypto_donate/components/crypto_donate_panel';
// import GroupSidebarPanel from '../features/groups/sidebar_panel';
import FeaturesPanel from 'soapbox/features/ui/components/features_panel';
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

    return (
      <div className='page'>
        <div className='page__columns'>
          <div className='columns-area__panels'>

            <div className='columns-area__panels__pane columns-area__panels__pane--left'>
              <div className='columns-area__panels__pane__inner'>
                <UserPanel accountId={me} key='user-panel' />
                {showFundingPanel && <FundingPanel key='funding-panel' />}
                {showCryptoDonatePanel && <CryptoDonatePanel limit={cryptoLimit} key='crypto-panel' />}
              </div>
            </div>

            <div className='columns-area__panels__main'>
              <div className='columns-area columns-area--mobile'>
                {me && <div className='timeline-compose-block' ref={this.composeBlock}>
                  <div className='timeline-compose-block__avatar'>
                    <Avatar account={account} size={46} />
                  </div>
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
                {showTrendsPanel && <TrendsPanel limit={3} key='trends-panel' />}
                {showWhoToFollowPanel && <WhoToFollowPanel limit={5} key='wtf-panel' />}
                <FeaturesPanel key='features-panel' />
                <PromoPanel key='promo-panel' />
                <LinkFooter key='link-footer' />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
