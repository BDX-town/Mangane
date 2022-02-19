import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { shortNumberFormat } from '../../../utils/numbers';

const messages = defineMessages({
  new_statuses: { id: 'groups.sidebar-panel.item.view', defaultMessage: 'new posts' },
  no_recent_activity: { id: 'groups.sidebar-panel.item.no_recent_activity', defaultMessage: 'No recent activity' },
});

const mapStateToProps = (state, { id }) => ({
  group: state.getIn(['groups', id]),
  relationships: state.getIn(['group_relationships', id]),
});

export default @connect(mapStateToProps)
@injectIntl
class Item extends ImmutablePureComponent {

    static propTypes = {
      group: ImmutablePropTypes.map,
      relationships: ImmutablePropTypes.map,
    }

    render() {
      const { intl, group, relationships } = this.props;

      // Wait for relationships
      if (!relationships) return null;

      const unreadCount = relationships.get('unread_count');

      return (
        <Link to={`/groups/${group.get('id')}`} className='group-sidebar-panel__item'>
          <div className='group-sidebar-panel__item__title'>{group.get('title')}</div>
          <div className='group-sidebar-panel__item__meta'>
            {unreadCount > 0 && <span className='group-sidebar-panel__item__meta__unread'>{shortNumberFormat(unreadCount)} {intl.formatMessage(messages.new_statuses)}</span>}
            {unreadCount === 0 && <span>{intl.formatMessage(messages.no_recent_activity)}</span>}
          </div>
        </Link>
      );
    }

}
