import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import Icon from 'soapbox/components/icon';

const tooltips = defineMessages({
  mentions: { id: 'notifications.filter.mentions', defaultMessage: 'Mentions' },
  favourites: { id: 'notifications.filter.favourites', defaultMessage: 'Likes' },
  boosts: { id: 'notifications.filter.boosts', defaultMessage: 'Reposts' },
  polls: { id: 'notifications.filter.polls', defaultMessage: 'Poll results' },
  follows: { id: 'notifications.filter.follows', defaultMessage: 'Follows' },
  moves: { id: 'notifications.filter.moves', defaultMessage: 'Moves' },
  emoji_reacts: { id: 'notifications.filter.emoji_reacts', defaultMessage: 'Emoji reacts' },
});

export default @injectIntl
class FilterBar extends React.PureComponent {

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
    const renderedElement = !advancedMode ? (
      <div className='notification__filter-bar'>
        <button
          className={selectedFilter === 'all' ? 'active' : ''}
          onClick={this.onClick('all')}
        >
          <FormattedMessage
            id='notifications.filter.all'
            defaultMessage='All'
          />
        </button>
        <button
          className={selectedFilter === 'mention' ? 'active' : ''}
          onClick={this.onClick('mention')}
        >
          <FormattedMessage
            id='notifications.filter.mentions'
            defaultMessage='Mentions'
          />
        </button>
      </div>
    ) : (
      <div className='notification__filter-bar'>
        <button
          className={selectedFilter === 'all' ? 'active' : ''}
          onClick={this.onClick('all')}
        >
          <FormattedMessage
            id='notifications.filter.all'
            defaultMessage='All'
          />
        </button>
        <button
          className={selectedFilter === 'mention' ? 'active' : ''}
          onClick={this.onClick('mention')}
          title={intl.formatMessage(tooltips.mentions)}
        >
          <Icon id='at' fixedWidth />
        </button>
        <button
          className={selectedFilter === 'favourite' ? 'active' : ''}
          onClick={this.onClick('favourite')}
          title={intl.formatMessage(tooltips.favourites)}
        >
          <Icon id='thumbs-up' fixedWidth />
        </button>
        {supportsEmojiReacts && <button
          className={selectedFilter === 'pleroma:emoji_reaction' ? 'active' : ''}
          onClick={this.onClick('pleroma:emoji_reaction')}
          title={intl.formatMessage(tooltips.emoji_reacts)}
        >
          <Icon id='smile-o' fixedWidth />
        </button>}
        <button
          className={selectedFilter === 'reblog' ? 'active' : ''}
          onClick={this.onClick('reblog')}
          title={intl.formatMessage(tooltips.boosts)}
        >
          <Icon id='retweet' fixedWidth />
        </button>
        <button
          className={selectedFilter === 'poll' ? 'active' : ''}
          onClick={this.onClick('poll')}
          title={intl.formatMessage(tooltips.polls)}
        >
          <Icon id='tasks' fixedWidth />
        </button>
        <button
          className={selectedFilter === 'follow' ? 'active' : ''}
          onClick={this.onClick('follow')}
          title={intl.formatMessage(tooltips.follows)}
        >
          <Icon id='user-plus' fixedWidth />
        </button>
        <button
          className={selectedFilter === 'move' ? 'active' : ''}
          onClick={this.onClick('move')}
          title={intl.formatMessage(tooltips.moves)}
        >
          <Icon id='suitcase' fixedWidth />
        </button>
      </div>
    );
    return renderedElement;
  }

}
