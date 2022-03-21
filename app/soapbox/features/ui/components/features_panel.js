import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import Icon from 'soapbox/components/icon';
import IconWithCounter from 'soapbox/components/icon_with_counter';
import { getFeatures } from 'soapbox/utils/features';

const messages = defineMessages({
  edit_profile: { id: 'account.edit_profile', defaultMessage: 'Edit Profile' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  security: { id: 'navigation_bar.security', defaultMessage: 'Security' },
  lists: { id: 'column.lists', defaultMessage: 'Lists' },
  bookmarks: { id: 'column.bookmarks', defaultMessage: 'Bookmarks' },
  follow_requests: { id: 'navigation_bar.follow_requests', defaultMessage: 'Follow requests' },
});

const mapStateToProps = state => {
  const me = state.get('me');

  const instance = state.get('instance');
  const features = getFeatures(instance);

  return {
    isLocked: state.getIn(['accounts', me, 'locked']),
    followRequestsCount: state.getIn(['user_lists', 'follow_requests', 'items'], ImmutableOrderedSet()).count(),
    features,
  };
};

export default @connect(mapStateToProps)
@injectIntl
class FeaturesPanel extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    isLocked: PropTypes.bool,
    followRequestsCount: PropTypes.number,
    features: PropTypes.object.isRequired,
  };

  render() {
    const { intl, isLocked, followRequestsCount, features } = this.props;

    return (
      <div className='wtf-panel promo-panel panel'>
        <div className='promo-panel__container'>
          {(isLocked || followRequestsCount > 0) && <NavLink className='promo-panel-item' to='/follow_requests'>
            <IconWithCounter src={require('@tabler/icons/icons/user-plus.svg')} count={followRequestsCount} className='promo-panel-item__icon' />
            {intl.formatMessage(messages.follow_requests)}
          </NavLink>}

          {features.bookmarks && (
            <NavLink className='promo-panel-item' to='/bookmarks'>
              <Icon src={require('@tabler/icons/icons/bookmark.svg')} className='promo-panel-item__icon' />
              {intl.formatMessage(messages.bookmarks)}
            </NavLink>
          )}

          {features.lists && (
            <NavLink className='promo-panel-item' to='/lists'>
              <Icon src={require('@tabler/icons/icons/list.svg')} className='promo-panel-item__icon' />
              {intl.formatMessage(messages.lists)}
            </NavLink>
          )}
        </div>
      </div>
    );
  }

}
