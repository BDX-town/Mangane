import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';

import Icon from 'soapbox/components/icon';

import { Tabs } from '../../../components/ui';

const messages = defineMessages({
  all: { id: 'notifications.filter.all', defaultMessage: 'All' },
  mentions: { id: 'notifications.filter.mentions', defaultMessage: 'Mentions' },
  favourites: { id: 'notifications.filter.favourites', defaultMessage: 'Likes' },
  boosts: { id: 'notifications.filter.boosts', defaultMessage: 'Reposts' },
  polls: { id: 'notifications.filter.polls', defaultMessage: 'Poll results' },
  follows: { id: 'notifications.filter.follows', defaultMessage: 'Follows' },
  moves: { id: 'notifications.filter.moves', defaultMessage: 'Moves' },
  emoji_reacts: { id: 'notifications.filter.emoji_reacts', defaultMessage: 'Emoji reacts' },
  statuses: { id: 'notifications.filter.statuses', defaultMessage: 'Updates from people you follow' },
});

export default @injectIntl
class NotificationFilterBar extends React.PureComponent {

  static propTypes = {
    selectFilter: PropTypes.func.isRequired,
    selectedFilter: PropTypes.string.isRequired,
    advancedMode: PropTypes.bool.isRequired,
    supportsEmojiReacts: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  };

  onClick(notificationType) {
    return () => this.props.selectFilter(notificationType);
  }

  render() {
    const { selectedFilter, advancedMode, supportsEmojiReacts, intl } = this.props;

    const items = [
      {
        text: intl.formatMessage(messages.all),
        action: this.onClick('all'),
        name: 'all',
      },
    ];

    if (!advancedMode) {
      items.push({
        text: intl.formatMessage(messages.mentions),
        action: this.onClick('mention'),
        name: 'mention',
      });
    } else {
      items.push({
        text: <Icon src={require('@tabler/icons/icons/at.svg')} />,
        title: intl.formatMessage(messages.mentions),
        action: this.onClick('mention'),
        name: 'mention',
      });
      items.push({
        text: <Icon src={require('@tabler/icons/icons/thumb-up.svg')} />,
        title: intl.formatMessage(messages.favourites),
        action: this.onClick('favourite'),
        name: 'favourite',
      });
      if (supportsEmojiReacts) items.push({
        text: <Icon src={require('@tabler/icons/icons/mood-smile.svg')} />,
        title: intl.formatMessage(messages.emoji_reacts),
        action: this.onClick('pleroma:emoji_reaction'),
        name: 'pleroma:emoji_reaction',
      });
      items.push({
        text: <Icon src={require('feather-icons/dist/icons/repeat.svg')} />,
        title: intl.formatMessage(messages.boosts),
        action: this.onClick('reblog'),
        name: 'reblog',
      });
      items.push({
        text: <Icon src={require('@tabler/icons/icons/chart-bar.svg')} />,
        title: intl.formatMessage(messages.polls),
        action: this.onClick('poll'),
        name: 'poll',
      });
      items.push({
        text: <Icon src={require('@tabler/icons/icons/home.svg')} />,
        title: intl.formatMessage(messages.statuses),
        action: this.onClick('status'),
        name: 'status',
      });
      items.push({
        text: <Icon src={require('@tabler/icons/icons/user-plus.svg')} />,
        title: intl.formatMessage(messages.follows),
        action: this.onClick('follow'),
        name: 'follow',
      });
      items.push({
        text: <Icon src={require('feather-icons/dist/icons/briefcase.svg')} />,
        title: intl.formatMessage(messages.moves),
        action: this.onClick('move'),
        name: 'move',
      });
    }

    return <Tabs items={items} activeItem={selectedFilter} />;
  }

}
