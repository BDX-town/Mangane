import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import WhoToFollowPanel from '../features/ui/components/who_to_follow_panel';
import TrendsPanel from '../features/ui/components/trends_panel';
import LinkFooter from '../features/ui/components/link_footer';
import FeaturesPanel from '../features/ui/components/features_panel';
import PromoPanel from '../features/ui/components/promo_panel';
import UserPanel from '../features/ui/components/user_panel';
import FundingPanel from '../features/ui/components/funding_panel';
import ComposeFormContainer from '../features/compose/containers/compose_form_container';
import Avatar from '../components/avatar';
import { getFeatures } from 'soapbox/utils/features';
// import GroupSidebarPanel from '../features/groups/sidebar_panel';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';

const mapStateToProps = state => {
  const me = state.get('me');
  return {
    me,
    account: state.getIn(['accounts', me]),
    hasPatron: getSoapboxConfig(state).getIn(['extensions', 'patron', 'enabled']),
    features: getFeatures(state.get('instance')),
  };
};

export default @connect(mapStateToProps)
class HomePage extends ImmutablePureComponent {

  constructor(props) {
    super(props);
    this.composeBlock = React.createRef();
  }

  render() {
    const { me, children, account, hasPatron, features } = this.props;

    return (
      <div className='page'>
        <div className='page__columns'>
          <div className='columns-area__panels'>

            <div className='columns-area__panels__pane columns-area__panels__pane--left'>
              <div className='columns-area__panels__pane__inner'>
                <UserPanel accountId={me} />
                {hasPatron && <FundingPanel />}
              </div>
            </div>

            <div className='columns-area__panels__main'>
              <div className='columns-area columns-area--mobile'>
                <div className='timeline-compose-block' ref={this.composeBlock}>
                  <div className='timeline-compose-block__avatar'>
                    <Avatar account={account} size={46} />
                  </div>
                  <ComposeFormContainer
                    shouldCondense
                    autoFocus={false}
                    clickableAreaRef={this.composeBlock}
                  />
                </div>

                {children}
              </div>
            </div>

            <div className='columns-area__panels__pane columns-area__panels__pane--right'>
              <div className='columns-area__panels__pane__inner'>
                {/* <GroupSidebarPanel /> */}
                {features.trends && <TrendsPanel limit={3} />}
                {features.suggestions && <WhoToFollowPanel limit={5} />}
                <FeaturesPanel />
                <PromoPanel />
                <LinkFooter />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
