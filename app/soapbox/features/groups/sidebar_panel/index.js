import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Icon from 'soapbox/components/icon';

import Item from './item';

const messages = defineMessages({
  title: { id: 'groups.sidebar-panel.title', defaultMessage: 'Groups You\'re In' },
  show_all: { id: 'groups.sidebar-panel.show_all', defaultMessage: 'Show all' },
});

const mapStateToProps = (state, { id }) => ({
  groupIds: state.getIn(['group_lists', 'member']),
});

export default @connect(mapStateToProps)
@injectIntl
class GroupSidebarPanel extends ImmutablePureComponent {

    static propTypes = {
      groupIds: ImmutablePropTypes.list,
    }

    render() {
      const { intl, groupIds } = this.props;
      const count = groupIds.count();

      // Only when there are groups to show
      if (count === 0) return null;

      return (
        <div className='wtf-panel group-sidebar-panel'>
          <div className='wtf-panel-header'>
            <Icon id='users' className='wtf-panel-header__icon' />
            <span className='wtf-panel-header__label'>{intl.formatMessage(messages.title)}</span>
          </div>

          <div className='wtf-panel__content'>
            <div className='group-sidebar-panel__items'>
              {groupIds.slice(0, 10).map(groupId => <Item key={groupId} id={groupId} />)}
              {count > 10 && <Link className='group-sidebar-panel__items__show-all' to='/groups/browse/member'>{intl.formatMessage(messages.show_all)}</Link>}
            </div>
          </div>
        </div>
      );
    }

}
