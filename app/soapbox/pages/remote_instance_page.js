import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import WhoToFollowPanel from 'soapbox/features/ui/components/who_to_follow_panel';
import TrendsPanel from 'soapbox/features/ui/components/trends_panel';
import PromoPanel from 'soapbox/features/ui/components/promo_panel';
import FeaturesPanel from 'soapbox/features/ui/components/features_panel';
import LinkFooter from 'soapbox/features/ui/components/link_footer';
import { getFeatures } from 'soapbox/utils/features';
import InstanceInfoPanel from 'soapbox/features/ui/components/instance_info_panel';

const mapStateToProps = state => {
  const features = getFeatures(state.get('instance'));

  return {
    showTrendsPanel: features.trends,
    showWhoToFollowPanel: features.suggestions,
  };
};

export default @connect(mapStateToProps)
class RemoteInstancePage extends ImmutablePureComponent {

  render() {
    const { children, showTrendsPanel, showWhoToFollowPanel, params: { instance: host } } = this.props;

    return (
      <div className='page'>
        <div className='page__columns'>
          <div className='columns-area__panels'>

            <div className='columns-area__panels__pane columns-area__panels__pane--left'>
              <div className='columns-area__panels__pane__inner'>
                <InstanceInfoPanel host={host} />
              </div>
            </div>

            <div className='columns-area__panels__main'>
              <div className='columns-area columns-area--mobile'>
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
