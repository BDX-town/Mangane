import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import WhoToFollowPanel from '../features/ui/components/who_to_follow_panel';
import TrendsPanel from '../features/ui/components/trends_panel';
import LinkFooter from '../features/ui/components/link_footer';
import PromoPanel from '../features/ui/components/promo_panel';
import UserPanel from '../features/ui/components/user_panel';
import FundingPanel from '../features/ui/components/funding_panel';
import ComposeFormContainer from '../features/compose/containers/compose_form_container';
import Avatar from '../components/avatar';
import GroupSidebarPanel from '../features/groups/sidebar_panel';

const mapStateToProps = state => {
  const me = state.get('me');
  return {
    account: state.getIn(['accounts', me]),
    hasPatron: state.getIn(['soapbox', 'extensions', 'patron']),
  };
};

export default @connect(mapStateToProps)
class HomePage extends ImmutablePureComponent {

  render () {
    const { children, account, hasPatron } = this.props;

    return (
      <div className='page'>
        <div className='page__columns'>
          <div className='columns-area__panels'>

            <div className='columns-area__panels__pane columns-area__panels__pane--left'>
              <div className='columns-area__panels__pane__inner'>
                <UserPanel />
                {hasPatron && <FundingPanel />}
                <PromoPanel />
                <LinkFooter />
              </div>
            </div>

            <div className='columns-area__panels__main'>
              <div className='columns-area columns-area--mobile'>
                <div className='timeline-compose-block'>
                  <div className='timeline-compose-block__avatar'>
                    <Avatar account={account} size={46} />
                  </div>
                  <ComposeFormContainer shouldCondense autoFocus={false} />
                </div>

                {children}
              </div>
            </div>

            <div className='columns-area__panels__pane columns-area__panels__pane--right'>
              <div className='columns-area__panels__pane__inner'>
                {/* <GroupSidebarPanel /> */}
                <TrendsPanel limit={3} />
                <WhoToFollowPanel limit={5} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
