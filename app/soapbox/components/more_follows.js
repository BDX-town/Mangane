import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { getFeatures } from 'soapbox/utils/features';

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


const mapStateToProps = state => {
  const instance = state.get('instance');

  return {
    features: getFeatures(instance),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class MoreFollows extends React.PureComponent {

  static propTypes = {
    visible: PropTypes.bool,
    count: PropTypes.number,
    type: PropTypes.string,
    intl: PropTypes.object.isRequired,
    features: PropTypes.object.isRequired,
  }

  static defaultProps = {
    visible: true,
  }

  getMessage = () => {
    const { type, count, intl } = this.props;
    return intl.formatMessage(messages[type], { count });
  }

  render() {
    const { features } = this.props;

    // If the instance isn't federating, there are no remote followers
    if (!features.federating) {
      return null;
    }

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
