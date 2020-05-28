import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

export default class MoreFollows extends React.PureComponent {

  static propTypes = {
    visible: PropTypes.bool,
    moreFollows: PropTypes.number,
    isFollowing: PropTypes.bool,
  }

  static defaultProps = {
    visible: true,
  }

  render() {
    const { moreFollows, isFollowing, visible } = this.props;

    if (isFollowing === true && moreFollows === 1) {
      return (
        <div className='morefollows-indicator'>
          <div>
            <div className='morefollows-indicator__label' style={{ visibility: visible ? 'visible' : 'hidden' }}>
              <FormattedMessage
                id='morefollows_indicator.follows_1_label'
                tagName='strong'
                defaultMessage='...and {moreFollows} more follow on a remote site.'
                values={{
                  moreFollows: <span>{moreFollows}</span>,
                }}
              />
            </div>
          </div>
        </div>
      );
    } else if (isFollowing && moreFollows > 1) {
      return (
        <div className='morefollows-indicator'>
          <div>
            <div className='morefollows-indicator__label' style={{ visibility: visible ? 'visible' : 'hidden' }}>
              <FormattedMessage
                id='morefollows_indicator.follows_2_label'
                tagName='strong'
                defaultMessage='...and {moreFollows} more follows on remote sites.'
                values={{
                  moreFollows: <span>{moreFollows}</span>,
                }}
              />
            </div>
          </div>
        </div>
      );
    } else if (!isFollowing && moreFollows === 1) {
      return (
        <div className='morefollows-indicator'>
          <div>
            <div className='morefollows-indicator__label' style={{ visibility: visible ? 'visible' : 'hidden' }}>
              <FormattedMessage
                id='morefollows_indicator.followers_1_label'
                tagName='strong'
                defaultMessage='...and {moreFollows} more follower on a remote site.'
                values={{
                  moreFollows: <span>{moreFollows}</span>,
                }}
              />
            </div>
          </div>
        </div>
      );
    } else if (!isFollowing && moreFollows > 1) {
      return (
        <div className='morefollows-indicator'>
          <div>
            <div className='morefollows-indicator__label' style={{ visibility: visible ? 'visible' : 'hidden' }}>
              <FormattedMessage
                id='morefollows_indicator.followers_2_label'
                tagName='strong'
                defaultMessage='...and {moreFollows} more followers on remote sites.'
                values={{
                  moreFollows: <span>{moreFollows}</span>,
                }}
              />
            </div>
          </div>
        </div>
      );
    } else {
      return (null);
    }
  }

}
