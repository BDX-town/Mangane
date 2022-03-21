import { PropTypes } from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import { fetchGroup } from '../actions/groups';
import GroupSidebarPanel from '../features/groups/sidebar_panel';
import GroupPanel from '../features/groups/timeline/components/panel';
import HeaderContainer from '../features/groups/timeline/containers/header_container';
import LinkFooter from '../features/ui/components/link_footer';
import PromoPanel from '../features/ui/components/promo_panel';
import WhoToFollowPanel from '../features/ui/components/who-to-follow-panel';

const mapStateToProps = (state, { params: { id } }) => ({
  group: state.getIn(['groups', id]),
  relationships: state.getIn(['group_relationships', id]),
});

export default @connect(mapStateToProps)
class GroupPage extends ImmutablePureComponent {

    static propTypes = {
      group: ImmutablePropTypes.map,
      relationships: ImmutablePropTypes.map,
      dispatch: PropTypes.func.isRequired,
    };

    componentDidMount() {
      const { params: { id }, dispatch } = this.props;

      dispatch(fetchGroup(id));
    }

    render() {
      const { children, group, relationships } = this.props;

      return (
        <div className='page group'>
          {group && <HeaderContainer groupId={group.get('id')} />}

          <div className='page__columns'>
            <div className='columns-area__panels'>
              <div className='columns-area__panels__pane columns-area__panels__pane--left'>
                <div className='columns-area__panels__pane__inner'>
                  {group && relationships &&
                  <GroupPanel
                    group={group}
                    relationships={relationships}
                  />}

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
