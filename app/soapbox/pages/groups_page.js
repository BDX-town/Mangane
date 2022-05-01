import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import GroupSidebarPanel from '../features/groups/sidebar_panel';
import LinkFooter from '../features/ui/components/link_footer';
import PromoPanel from '../features/ui/components/promo_panel';
import UserPanel from '../features/ui/components/user_panel';
import WhoToFollowPanel from '../features/ui/components/who-to-follow-panel';

const mapStateToProps = state => {
  const me = state.get('me');
  return {
    account: state.getIn(['accounts', me]),
  };
};

export default @connect(mapStateToProps)
class GroupsPage extends ImmutablePureComponent {

    static propTypes = {
      account: ImmutablePropTypes.record,
    };

    render() {
      const { children } = this.props;

      return (
        <div className='page'>
          <div className='page__columns'>
            <div className='columns-area__panels'>

              <div className='columns-area__panels__pane columns-area__panels__pane--left'>
                <div className='columns-area__panels__pane__inner'>
                  <UserPanel />
                  <PromoPanel />
                  <LinkFooter />
                </div>
              </div>

              <div className='columns-area__panels__main'>
                <div className='columns-area'>
                  {children}
                </div>
              </div>

              <div className='columns-area__panels__pane columns-area__panels__pane--right'>
                <div className='columns-area__panels__pane__inner'>
                  <GroupSidebarPanel />
                  <WhoToFollowPanel />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

}
