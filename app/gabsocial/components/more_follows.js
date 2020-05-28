import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';

const messages = defineMessages({
  following_singular: {
    id: 'morefollows.following_label_singular',
    defaultMessage: '…and {count} more follow on a remote site.',
  },
  following_plural: {
    id: 'morefollows.following_label_plural',
    defaultMessage: '…and {count} more follows on remote sites.',
  },
  followers_singular: {
    id: 'morefollows.followers_label_singular',
    defaultMessage: '…and {count} more follower on a remote site.',
  },
  followers_plural: {
    id: 'morefollows.followers_label_plural',
    defaultMessage: '…and {count} more followers on remote sites.',
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
    const messageKey = `${type}_${count > 1 ? 'plural' : 'singular'}`;
    return intl.formatMessage(messages[messageKey], { count });
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
