import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';

const messages = defineMessages({
  following: {
    id: 'morefollows.following_label',
    defaultMessage: '…and {count} more {count, plural, one {follow} other {follows}} on remote sites.',
  },
  followers: {
    id: 'morefollows.followers_label',
    defaultMessage: '…and {count} more {count, plural, one {follower} other {followers}} on remote sites.',
  },
});


export default @injectIntl
class MoreFollows extends React.PureComponent {

  static propTypes = {
    visible: PropTypes.bool,
    count: PropTypes.number,
    type: PropTypes.string,
    intl: PropTypes.object.isRequired,
  }

  static defaultProps = {
    visible: true,
  }

  getMessage = () => {
    const { type, count, intl } = this.props;
    return intl.formatMessage(messages[type], { count });
  }

  render() {
    return (
      <div className='morefollows-indicator'>
        <div>
          <div className='morefollows-indicator__label' style={{ visibility: this.props.visible ? 'visible' : 'hidden' }}>
            {this.getMessage()}
          </div>
        </div>
      </div>
    );
  }

}
